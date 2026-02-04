import { Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../../middleware/auth.middleware";
import { Chat } from "./chat.model";
import aiProvider from "./ai.service";
import { Message as AIMessage } from "./ai.provider";

export async function listChats(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const chats = await Chat.find({ userId: new Types.ObjectId(userId) }).select("title createdAt updatedAt").sort({ updatedAt: -1 });
        res.json(chats);
    } catch (error: any) {
        res.status(500).json({ message: "Error listing chats", error: error.message });
    }
}

export async function getChatById(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user?.userId;

    try {
        const chat = await Chat.findOne({ _id: id, userId: new Types.ObjectId(userId) });
        if (!chat) {
            res.status(404).json({ message: "Chat not found" });
            return;
        }
        res.json(chat);
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching chat", error: error.message });
    }
}

export async function deleteChat(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user?.userId;

    try {
        const result = await Chat.deleteOne({ _id: id, userId: new Types.ObjectId(userId) });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Chat not found" });
            return;
        }
        res.json({ message: "Chat deleted" });
    } catch (error: any) {
        res.status(500).json({ message: "Error deleting chat", error: error.message });
    }
}

export async function streamMessage(req: AuthRequest, res: Response): Promise<void> {
    const { chatId, message } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        let chat;
        if (chatId) {
            chat = await Chat.findOne({ _id: chatId, userId: new Types.ObjectId(userId) });
        }

        if (!chat) {
            chat = new Chat({ userId, messages: [], title: "New Chat" });
            await chat.save();
        }

        // Prepare history for AI
        const history: AIMessage[] = chat.messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));
        history.push({ role: "user", content: message });

        // Set headers for SSE
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        let fullAIResponse = "";
        const abortController = new AbortController();

        req.on("close", () => {
            console.log("Client disconnected, aborting AI stream");
            abortController.abort();

            // Save partial message if any
            if (fullAIResponse) {
                saveChatSession(chat!, message, fullAIResponse);
            }
        });

        await aiProvider.streamResponse(
            history,
            {
                onToken: (token) => {
                    fullAIResponse += token;
                    res.write(`data: ${JSON.stringify({ token })}\n\n`);
                },
                onComplete: async (finalContent) => {
                    await saveChatSession(chat!, message, finalContent);

                    // Auto-generate title if it's the first user message
                    if (chat!.messages.length === 2 && chat!.title === "New Chat") {
                        try {
                            const newTitle = await aiProvider.generateTitle(message);
                            chat!.title = newTitle;
                            await chat!.save();
                            res.write(`data: ${JSON.stringify({ title: newTitle })}\n\n`);
                        } catch (titleError) {
                            console.error("Title generation failed:", titleError);
                        }
                    }

                    res.write(`data: ${JSON.stringify({ done: true, chatId: chat!._id })}\n\n`);
                    res.end();
                },
                onError: (error) => {
                    console.error("AI Provider Stream Error:", error);
                    res.write(`data: ${JSON.stringify({ error: error.message || "AI stream failed" })}\n\n`);
                    res.end();
                },
            },
            abortController.signal
        );
    } catch (error: any) {
        console.error("Stream Message Error:", error);
        res.status(500).json({ message: "Error streaming message", error: error.message });
    }
}

async function saveChatSession(chat: any, userMsg: string, assistantMsg: string) {
    // Check if messages already exist to avoid duplicates if onComplete is called after partial save
    const alreadySavedUser = chat.messages.find((m: any) => m.role === 'user' && m.content === userMsg && (new Date().getTime() - m.timestamp.getTime() < 5000));

    if (!alreadySavedUser) {
        chat.messages.push({ role: "user", content: userMsg, timestamp: new Date() });
    }

    // Update or add assistant message
    const lastMsg = chat.messages[chat.messages.length - 1];
    if (lastMsg && lastMsg.role === "assistant") {
        lastMsg.content = assistantMsg;
    } else {
        chat.messages.push({ role: "assistant", content: assistantMsg, timestamp: new Date() });
    }

    await chat.save();
}
