import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { AIProvider, Message, StreamCallbacks } from "./ai.provider";

export class GeminiProvider extends AIProvider {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        super();
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }

    private convertMessages(messages: Message[]) {

        const systemMessage = messages.find(m => m.role === "system");
        const chatMessages = messages.filter(m => m.role !== "system");

        if (chatMessages.length === 0) {
            return { history: [], latestMessage: "", systemInstruction: systemMessage?.content };
        }

        const history = chatMessages.slice(0, -1).map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
        }));

        const latestMessage = chatMessages[chatMessages.length - 1].content;

        return { history, latestMessage, systemInstruction: systemMessage?.content };
    }

    async generateResponse(messages: Message[]): Promise<string> {
        const { history, latestMessage, systemInstruction } = this.convertMessages(messages);

        const modelWithSystem = systemInstruction
            ? this.genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction })
            : this.model;

        const chat = modelWithSystem.startChat({ history });
        const result = await chat.sendMessage(latestMessage);
        const response = await result.response;
        return response.text();
    }

    async streamResponse(messages: Message[], callbacks: StreamCallbacks, signal?: AbortSignal): Promise<void> {
        try {
            const { history, latestMessage, systemInstruction } = this.convertMessages(messages);

            const modelWithSystem = systemInstruction
                ? this.genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction })
                : this.model;

            const chat = modelWithSystem.startChat({ history });
            const result = await chat.sendMessageStream(latestMessage);

            let fullContent = "";
            for await (const chunk of result.stream) {
                if (signal?.aborted) return;
                const text = chunk.text();
                if (text) {
                    fullContent += text;
                    callbacks.onToken(text);
                }
            }
            callbacks.onComplete(fullContent);
        } catch (error: any) {
            callbacks.onError(error);
        }
    }

    async generateTitle(firstMessage: string): Promise<string> {
        const prompt = `Generate a short, concise title (max 5 words) for a chat conversation based on this message: "${firstMessage}". Return only the title text without quotes.`;
        const result = await this.model.generateContent(prompt);
        return result.response.text().trim().replace(/["']/g, "");
    }

    async speechToText(audioBuffer: Buffer): Promise<string> {
        try {
            const result = await this.model.generateContent([
                {
                    inlineData: {
                        mimeType: "audio/wav",
                        data: audioBuffer.toString("base64"),
                    },
                },
                { text: "Precisely transcribe this audio into text. Return only the transcription." },
            ]);
            return result.response.text();
        } catch (error) {
            console.error("Gemini STT Error:", error);
            throw new Error("Failed to transcribe audio with Gemini");
        }
    }

    async textToSpeech(text: string): Promise<Buffer> {
        // Gemini currently doesn't have a direct TTS API in the node SDK.
        // We return an empty buffer to avoid crashes, while the UI displays the text response.
        return Buffer.alloc(0);
    }
}
