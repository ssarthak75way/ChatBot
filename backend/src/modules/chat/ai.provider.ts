export interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

export interface StreamCallbacks {
    onToken: (token: string) => void;
    onComplete: (fullContent: string) => void;
    onError: (error: Error) => void;
}

export abstract class AIProvider {
    abstract generateResponse(messages: Message[]): Promise<string>;
    abstract streamResponse(messages: Message[], callbacks: StreamCallbacks, signal?: AbortSignal): Promise<void>;
    abstract generateTitle(firstMessage: string): Promise<string>;
    abstract speechToText(audioBlob: Buffer | Blob): Promise<string>;
    abstract textToSpeech(text: string): Promise<Buffer>;
}
