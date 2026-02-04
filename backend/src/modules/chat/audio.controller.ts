import { Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../../middleware/auth.middleware";
import { Chat } from "./chat.model";
import aiProvider from "./ai.service";
import { Message as AIMessage } from "./ai.provider";

export async function processAudioMessage(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const { chatId } = req.body;
    const audioFile = req.file; // Assuming multer is used

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    if (!audioFile) {
        res.status(400).json({ message: "No audio file provided" });
        return;
    }

    try {
        // 1. STT: Speech to Text
        const transcript = await aiProvider.speechToText(audioFile.buffer);

        if (!transcript) {
            res.status(400).json({ message: "Could not transcribe audio" });
            return;
        }

        // 2. LLM: Generate Response
        let chat;
        if (chatId) {
            chat = await Chat.findOne({ _id: chatId, userId: new Types.ObjectId(userId) });
        }

        if (!chat) {
            chat = new Chat({ userId, messages: [], title: "Voice Chat" });
            await chat.save();
        }

        const history: AIMessage[] = chat.messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));
        history.push({ role: "user", content: transcript });

        const aiResponse = await aiProvider.generateResponse(history);
        console.log(aiResponse);

        // 3. TTS: Text to Speech
        const audioBuffer = await aiProvider.textToSpeech(aiResponse);

        // 4. Save to DB
        chat.messages.push({ role: "user", content: transcript, timestamp: new Date() });
        chat.messages.push({ role: "assistant", content: aiResponse, timestamp: new Date() });

        // Auto-generate title if it's the first message
        if (chat.messages.length === 2 && chat.title === "Voice Chat") {
            const newTitle = await aiProvider.generateTitle(transcript);
            chat.title = newTitle;
        }

        await chat.save();

        // 5. Response
        res.json({
            chatId: chat._id,
            transcript,
            response: aiResponse,
            audio: audioBuffer.length > 0 ? audioBuffer.toString("base64") : null,
        });

    } catch (error: any) {
        console.error("Audio Message Error:", error);
        res.status(500).json({ message: "Error processing audio message", error: error.message });
    }
}
