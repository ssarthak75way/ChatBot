import { useState, useRef } from "react";
import { IconButton, Tooltip, Box, Typography, Fade } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

interface VoiceRecorderProps {
    onSendAudio: (audioBlob: Blob) => void;
    disabled?: boolean;
}

const getStyles = () => ({
    root: {
        display: "flex",
        alignItems: "center",
        gap: 1
    },
    recordingBadge: {
        display: "flex",
        alignItems: "center",
        gap: 1,
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        px: 1.5,
        py: 0.5,
        borderRadius: 10
    },
    pulseIcon: {
        color: "error.main",
        fontSize: 14,
        animation: "pulse 1.5s infinite",
        "@keyframes pulse": {
            "0%": { opacity: 1 },
            "50%": { opacity: 0.3 },
            "100%": { opacity: 1 }
        }
    },
    timerText: {
        color: "error.main",
        fontWeight: 700,
        fontSize: "0.75rem"
    },
    recorderButton: (isRecording: boolean) => ({
        color: isRecording ? "error.main" : "primary.main",
        backgroundColor: isRecording ? "rgba(239, 68, 68, 0.05)" : "transparent",
        "&:hover": {
            backgroundColor: isRecording ? "rgba(239, 68, 68, 0.1)" : "rgba(99, 102, 241, 0.05)",
        }
    })
});

export function VoiceRecorder({ onSendAudio, disabled }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                onSendAudio(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = window.setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const styles = getStyles();

    return (
        <Box sx={styles.root}>
            {isRecording && (
                <Fade in>
                    <Box sx={styles.recordingBadge}>
                        <FiberManualRecordIcon sx={styles.pulseIcon} />
                        <Typography sx={styles.timerText}>
                            {formatTime(recordingTime)}
                        </Typography>
                    </Box>
                </Fade>
            )}

            <Tooltip title={isRecording ? "Stop Recording" : "Record Voice"}>
                <IconButton
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={disabled}
                    sx={styles.recorderButton(isRecording)}
                >
                    {isRecording ? <StopIcon /> : <MicIcon />}
                </IconButton>
            </Tooltip>
        </Box>
    );
}
