import { useEffect, useState } from "react";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    Typography,
    Box,
    Button,
    useTheme,
    Tooltip,
} from "@mui/material";
import type { Theme } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import axios from "axios";
import { useAuth } from "../auth/auth.context";

interface ChatSummary {
    _id: string;
    title: string;
    updatedAt: string;
}

interface ChatSidebarProps {
    onSelectChat: (chatId: string) => void;
    onNewChat: () => void;
    selectedChatId?: string;
}

const getStyles = (theme: Theme) => ({
    root: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: theme.palette.background.paper,
    },
    header: {
        p: 2,
    },
    newChatButton: {
        mb: 3,
        borderRadius: 2.5,
        py: 1.2,
        boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
    },
    overline: {
        px: 1,
        mb: 1,
        color: theme.palette.text.secondary,
        fontWeight: 700,
        fontSize: "0.7rem",
        letterSpacing: "1px",
        display: "block",
    },
    list: {
        flexGrow: 1,
        overflowY: "auto",
        px: 1.5,
        "&::-webkit-scrollbar": {
            width: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: "10px",
        },
    },
    listItem: {
        mb: 0.5,
        borderRadius: 2,
        overflow: "hidden",
    },
    listItemButton: (selected: boolean) => ({
        borderRadius: 2,
        transition: "all 0.2s",
        backgroundColor: selected ? "rgba(99, 102, 241, 0.08)" : "transparent",
        "&:hover": {
            backgroundColor: selected ? "rgba(99, 102, 241, 0.12)" : "rgba(0,0,0,0.03)",
        },
    }),
    chatTitle: (selected: boolean) => ({
        noWrap: true,
        variant: "body2" as const,
        fontWeight: selected ? 600 : 500,
        color: selected ? "primary.main" : "text.primary",
    }),
});

export function ChatSidebar({ onSelectChat, onNewChat, selectedChatId }: ChatSidebarProps) {
    const [chats, setChats] = useState<ChatSummary[]>([]);
    const { token } = useAuth();
    const theme = useTheme();
    const styles = getStyles(theme);

    const fetchChats = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/chat", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setChats(response.data);
        } catch (error) {
            console.error("Error fetching chats", error);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await axios.delete(`http://localhost:5000/api/chat/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setChats((prev) => prev.filter((c) => c._id !== id));
            if (selectedChatId === id) {
                onNewChat();
            }
        } catch (error) {
            console.error("Error deleting chat", error);
        }
    };

    return (
        <Box sx={styles.root}>
            <Box sx={styles.header}>
                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onNewChat}
                    sx={styles.newChatButton}
                >
                    New Conversation
                </Button>
                <Typography variant="overline" sx={styles.overline}>
                    Recent History
                </Typography>
            </Box>

            <List sx={styles.list}>
                {chats.map((chat) => {
                    const isSelected = selectedChatId === chat._id;
                    return (
                        <ListItem
                            key={chat._id}
                            disablePadding
                            secondaryAction={
                                <Tooltip title="Delete Chat">
                                    <IconButton
                                        edge="end"
                                        size="small"
                                        onClick={(e) => handleDelete(e, chat._id)}
                                        sx={{
                                            opacity: 0,
                                            transition: "0.2s",
                                            "&:hover": { color: "error.main" }
                                        }}
                                        className="delete-button"
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            }
                            sx={{
                                ...styles.listItem,
                                "&:hover .delete-button": { opacity: 1 }
                            }}
                        >
                            <ListItemButton
                                selected={isSelected}
                                onClick={() => onSelectChat(chat._id)}
                                sx={styles.listItemButton(isSelected)}
                            >
                                <ChatBubbleOutlineIcon
                                    sx={{
                                        fontSize: 18,
                                        mr: 1.5,
                                        color: isSelected ? "primary.main" : "text.secondary"
                                    }}
                                />
                                <ListItemText
                                    primary={chat.title}
                                    primaryTypographyProps={styles.chatTitle(isSelected)}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}
