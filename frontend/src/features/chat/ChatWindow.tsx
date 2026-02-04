import { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, useTheme, Fade, IconButton, Badge } from "@mui/material";
import type { Theme } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/auth.context";
import { API_BASE_URL } from "../../lib/config";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const TypingIndicator = ({ styles }: { styles: any }) => (
    <Box sx={styles.typingContainer}>
        {[0, 1, 2].map((i) => (
            <Box
                key={i}
                sx={{
                    ...styles.typingDot,
                    animationDelay: `${i * 0.2}s`,
                }}
            />
        ))}
    </Box>
);

interface Message {
    role: "user" | "assistant";
    content: string;
    audio?: string; // Base64 audio string
}

const getStyles = (theme: Theme) => ({
    root: {
        height: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        maxWidth: "1000px",
        margin: "0 auto",
        width: "100%",
    },
    messageList: {
        flexGrow: 1,
        mb: 2,
        p: { xs: 2, sm: 3 },
        overflowY: "auto",
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        "&::-webkit-scrollbar": {
            width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: "10px",
        },
    },
    emptyState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        px: 3,
    },
    emptyIcon: {
        fontSize: 48,
        color: theme.palette.primary.main,
        mb: 2,
        opacity: 0.8,
    },
    error: {
        textAlign: "center" as const,
        my: 2,
        p: 1.5,
        backgroundColor: "rgba(239, 68, 68, 0.05)",
        borderRadius: 2,
        color: "error.main",
        fontSize: "0.875rem",
        border: "1px solid rgba(239, 68, 68, 0.1)",
    },
    streamingIndicator: {
        display: "flex",
        justifyContent: "center",
        mb: 2,
    },
    stopButton: {
        borderRadius: 20,
        px: 3,
        borderColor: theme.palette.divider,
        color: theme.palette.text.secondary,
        "&:hover": {
            borderColor: theme.palette.text.secondary,
            backgroundColor: "rgba(0,0,0,0.02)",
        },
    },
    scrollButton: {
        position: "absolute" as const,
        bottom: 100,
        right: { xs: 20, sm: 40 },
        backgroundColor: theme.palette.background.paper,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        "&:hover": {
            backgroundColor: "#f8f9fa",
        },
        zIndex: 10,
    },
    typingContainer: {
        display: "flex",
        gap: 0.5,
        p: 1.5,
        ml: 1,
        backgroundColor: "rgba(0,0,0,0.03)",
        borderRadius: "12px 12px 12px 2px",
        width: "fit-content"
    },
    typingDot: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        backgroundColor: "text.secondary",
        opacity: 0.4,
        animation: "typing 1.4s infinite ease-in-out both",
        "@keyframes typing": {
            "0%, 80%, 100%": { transform: "scale(0.6)", opacity: 0.4 },
            "40%": { transform: "scale(1.2)", opacity: 1 }
        }
    },
});

export function ChatWindow() {
    const [searchParams] = useSearchParams();
    const chatId = searchParams.get("id");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();
    const theme = useTheme();
    const styles = getStyles(theme);
    const scrollRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isAtBottomRef = useRef(true);

    useEffect(() => {
        if (chatId) {
            fetchChat(chatId);
        } else {
            setMessages([]);
        }
    }, [chatId]);

    useEffect(() => {
        const scrollEl = scrollRef.current;
        if (scrollEl) {
            const handleScroll = () => {
                const isAtBottom = scrollEl.scrollHeight - scrollEl.scrollTop <= scrollEl.clientHeight + 100;
                isAtBottomRef.current = isAtBottom;
                setShowScrollButton(!isAtBottom);
                if (isAtBottom) setUnreadCount(0);
            };
            scrollEl.addEventListener("scroll", handleScroll);
            return () => scrollEl.removeEventListener("scroll", handleScroll);
        }
    }, []);

    useEffect(() => {
        if (!isAtBottomRef.current && !isStreaming) {
            setUnreadCount(prev => prev + 1);
        }

        if (scrollRef.current && isAtBottomRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    useEffect(() => {
        if (isStreaming && isAtBottomRef.current) {
            scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "auto", // Auto for faster updates during streaming
            });
        }
    }, [messages, isStreaming]);

    const scrollToBottom = () => {
        setUnreadCount(0);
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    };

    const fetchChat = async (id: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/chat/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(response.data.messages);
        } catch (err) {
            console.error("Error fetching chat", err);
            setError("Failed to load chat history. Please try again.");
        }
    };

    const handleStopStreaming = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsStreaming(false);
        }
    };

    const handleSendMessage = async (content: string) => {
        setError(null);
        const userMessage: Message = { role: "user", content };
        setMessages((prev) => [...prev, userMessage]);
        setIsStreaming(true);

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            const response = await fetch(`${API_BASE_URL}/chat/stream`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ chatId, message: content }),
                signal: abortController.signal,
            });

            if (!response.ok) throw new Error("Failed to send message");

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No reader available");

            const decoder = new TextDecoder();
            let assistantContent = "";

            setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.token) {
                                assistantContent += data.token;
                                setMessages((prev) => {
                                    const newMessages = [...prev];
                                    newMessages[newMessages.length - 1].content = assistantContent;
                                    return newMessages;
                                });
                            }

                            if (data.error) {
                                setError(data.error);
                                break;
                            }

                            if (data.done) {
                                break;
                            }
                        } catch (e) {
                            // Partial chunks can fail parsing
                        }
                    }
                }
            }
        } catch (err: any) {
            if (err.name === "AbortError") {
                console.log("Stream aborted by user");
            } else {
                console.error("Streaming error", err);
                setError("Something went wrong while generating response.");
            }
        } finally {
            setIsStreaming(false);
            abortControllerRef.current = null;
        }
    };

    const handleSendAudio = async (audioBlob: Blob) => {
        setError(null);
        setIsStreaming(true);

        const formData = new FormData();
        formData.append("audio", audioBlob);
        if (chatId) formData.append("chatId", chatId);

        try {
            const response = await axios.post(`${API_BASE_URL}/chat/audio`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            const { transcript, response: aiResponse, audio, chatId: newChatId } = response.data;

            setMessages((prev) => [
                ...prev,
                { role: "user", content: transcript },
                { role: "assistant", content: aiResponse, audio }
            ]);

            // If it's a new chat, we might need to update URL (optional but good for consistency)
            if (!chatId && newChatId) {
                // Update search params without full reload
                const newParams = new URLSearchParams(window.location.search);
                newParams.set("id", newChatId);
                window.history.replaceState(null, "", "?" + newParams.toString());
            }

        } catch (err: any) {
            console.error("Audio capture error", err);
            setError("Failed to process voice message.");
        } finally {
            setIsStreaming(false);
        }
    };

    return (
        <Box sx={styles.root}>
            <Box
                sx={styles.messageList}
                ref={scrollRef}
            >
                {messages.length === 0 && !isStreaming && (
                    <Fade in timeout={800}>
                        <Box sx={styles.emptyState}>
                            <AutoAwesomeIcon sx={styles.emptyIcon} />
                            <Typography variant="h5" fontWeight={700} gutterBottom>
                                How can I assist you today?
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 450 }}>
                                Start a fresh conversation or pick up where you left off from the sidebar. I'm here to help with anything.
                            </Typography>
                        </Box>
                    </Fade>
                )}
                {messages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} />
                ))}
                {isStreaming && messages[messages.length - 1]?.role === "user" && (
                    <TypingIndicator styles={styles} />
                )}
                {error && (
                    <Typography sx={styles.error}>
                        {error}
                    </Typography>
                )}
            </Box>

            <Fade in={showScrollButton}>
                <IconButton
                    onClick={scrollToBottom}
                    sx={styles.scrollButton}
                    size="small"
                >
                    <Badge badgeContent={unreadCount} color="error" overlap="circular">
                        <KeyboardArrowDownIcon />
                    </Badge>
                </IconButton>
            </Fade>

            {isStreaming && (
                <Box sx={styles.streamingIndicator}>
                    <Button
                        variant="outlined"
                        startIcon={<StopCircleIcon />}
                        onClick={handleStopStreaming}
                        size="small"
                        sx={styles.stopButton}
                    >
                        Stop Generation
                    </Button>
                </Box>
            )}

            <ChatInput onSendMessage={handleSendMessage} onSendAudio={handleSendAudio} disabled={isStreaming} />
        </Box>
    );
}
