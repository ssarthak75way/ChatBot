import { Box, Paper, Typography, useTheme, Fade, CircularProgress } from "@mui/material";
import type { Theme } from "@mui/material";
import { lazy, Suspense } from "react";

const MarkdownRenderer = lazy(() => import("./MarkdownRenderer"));

interface Message {
    role: "user" | "assistant";
    content: string;
    audio?: string;
}

const getStyles = (theme: Theme) => ({
    root: (isUser: boolean) => ({
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
        px: { xs: 1, sm: 2 },
    }),
    paper: (isUser: boolean) => ({
        maxWidth: { xs: "90%", sm: "80%" },
        p: 2,
        borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
        backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
        color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
        boxShadow: isUser
            ? "0 4px 15px -3px rgba(99, 102, 241, 0.3)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        border: isUser ? "none" : `1px solid ${theme.palette.divider}`,
    }),
    markdown: (isUser: boolean) => ({
        fontSize: "0.9375rem",
        lineHeight: 1.6,
        "& p": { m: 0, my: 0.5 },
        "& ul, & ol": { pl: 2, my: 1 },
        "& code": {
            backgroundColor: isUser ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.05)",
            px: 0.6,
            py: 0.2,
            borderRadius: 1,
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: "0.85em",
        },
        "& pre": {
            m: 0,
            mt: 1,
            backgroundColor: "transparent !important",
            "& > div": {
                borderRadius: "8px !important",
                fontSize: "0.85em !important",
            }
        },
        "& table": {
            borderCollapse: "collapse",
            width: "100%",
            my: 2,
        },
        "& th, & td": {
            border: `1px solid ${isUser ? "rgba(255,255,255,0.2)" : theme.palette.divider}`,
            p: 1,
        }
    }),
    sender: (isUser: boolean) => ({
        display: "block",
        mt: 1,
        textAlign: isUser ? "right" : "left",
        fontSize: "0.7rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        opacity: 0.6,
        color: "inherit",
    }),
    animationPaper: (isUser: boolean) => ({
        animation: `${isUser ? "slideInRight" : "slideInLeft"} 0.3s ease-out`,
        "@keyframes slideInRight": {
            from: { opacity: 0, transform: "translateX(20px)" },
            to: { opacity: 1, transform: "translateX(0)" }
        },
        "@keyframes slideInLeft": {
            from: { opacity: 0, transform: "translateX(-20px)" },
            to: { opacity: 1, transform: "translateX(0)" }
        }
    }),
    audioContainer: {
        mt: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1
    },
    audioPlayer: (isUser: boolean) => ({
        width: "100%",
        height: "36px",
        borderRadius: "18px",
        filter: isUser ? "invert(1) hue-rotate(180deg) brightness(1.5)" : "none"
    }),
});

export function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === "user";
    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <Fade in timeout={500}>
            <Box sx={styles.root(isUser)}>
                <Paper
                    elevation={0}
                    sx={{
                        ...styles.paper(isUser),
                        ...styles.animationPaper(isUser)
                    }}
                >
                    <Box sx={styles.markdown(isUser)}>
                        <Suspense fallback={<CircularProgress size={20} color="inherit" />}>
                            <MarkdownRenderer content={message.content} isUser={isUser} />
                        </Suspense>
                    </Box>
                    {message.audio && (
                        <Box sx={styles.audioContainer}>
                            <audio
                                controls
                                src={`data:audio/wav;base64,${message.audio}`}
                                style={styles.audioPlayer(isUser) as React.CSSProperties}
                            />
                        </Box>
                    )}
                    <Typography variant="caption" sx={styles.sender(isUser)}>
                        {isUser ? "You" : "AI Assistant"}
                    </Typography>
                </Paper>
            </Box>
        </Fade>
    );
}
