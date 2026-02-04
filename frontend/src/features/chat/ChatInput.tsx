import { useState } from "react";
import { Box, TextField, IconButton, InputAdornment, useTheme } from "@mui/material";
import type { Theme } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { VoiceRecorder } from "./VoiceRecorder";

interface ChatInputProps {
    onSendMessage: (msg: string) => void;
    onSendAudio: (blob: Blob) => void;
    disabled?: boolean;
}

const getStyles = (theme: Theme) => ({
    root: {
        p: { xs: 1.5, sm: 2 },
        pb: { xs: 2.5, sm: 3 },
        backgroundColor: "transparent",
        position: "relative",
    },
    inputWrapper: {
        display: "flex",
        alignItems: "center",
        gap: 1
    },
    textField: {
        "& .MuiOutlinedInput-root": {
            borderRadius: 4,
            transition: "all 0.2s",
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 4px 20px -5px rgba(0,0,0,0.08)",
            "& fieldset": {
                borderColor: theme.palette.divider,
            },
            "&:hover fieldset": {
                borderColor: theme.palette.primary.light,
            },
            "&.Mui-focused": {
                boxShadow: `0 4px 20px -5px rgba(99, 102, 241, 0.15)`,
            }
        },
    },
    sendButton: {
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
        "&:hover": {
            backgroundColor: theme.palette.primary.dark,
        },
       "&.Mui-disabled": {
            backgroundColor: "rgba(0,0,0,0.05)",
            color: "rgba(0,0,0,0.2)",
            cursor: "not-allowed",
        },

        width: 40,
        height: 40,
        borderRadius: 2,
        
    },
});

export function ChatInput({ onSendMessage, onSendAudio, disabled }: ChatInputProps) {
    const [text, setText] = useState("");
    const theme = useTheme();
    const styles = getStyles(theme);

    const handleSend = () => {
        if (text.trim() && !disabled) {
            onSendMessage(text);
            setText("");
        }
    };

    return (
        <Box sx={styles.root}>
            <Box sx={styles.inputWrapper}>
                <VoiceRecorder onSendAudio={onSendAudio} disabled={disabled} />
                <TextField
                    fullWidth
                    placeholder="Ask me anything..."
                    variant="outlined"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={disabled}
                    onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    multiline
                    maxRows={8}
                    sx={styles.textField}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleSend}
                                    disabled={!text.trim() || disabled}
                                    sx={styles.sendButton}
                                    
                                >
                                    <SendRoundedIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </Box>
    );
}
