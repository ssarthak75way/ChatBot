import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Typography,
    Card,
    CardContent,
    Stack,
    useTheme,
    alpha,
} from "@mui/material";
import type { Theme } from "@mui/material";
import {
    Chat as ChatIcon,
    Mic as MicIcon,
    Speed as SpeedIcon,
    Security as SecurityIcon,
    AutoAwesome as AutoAwesomeIcon,
} from "@mui/icons-material";

const getStyles = (theme: Theme) => ({
    "@keyframes fadeInUp": {
        "0%": { opacity: 0, transform: "translateY(20px)" },
        "100%": { opacity: 1, transform: "translateY(0)" },
    },
    "@keyframes fadeIn": {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
    },
    root: {
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.light} 100%)`,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
    },
    hero: {
        padding: { xs: "60px 20px", md: "120px 0" },
        textAlign: "center",
        color: "#fff",
        animation: "fadeIn 1s ease-out",
    },
    title: {
        fontWeight: 800,
        fontSize: { xs: "2.8rem", md: "4.5rem" },
        lineHeight: 1.1,
        marginBottom: "24px",
        animation: "fadeInUp 0.8s ease-out forwards",
        background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    subtitle: {
        fontSize: { xs: "1.1rem", md: "1.4rem" },
        marginBottom: "48px",
        opacity: 0,
        maxWidth: "800px",
        margin: "0 auto 48px",
        animation: "fadeInUp 0.8s ease-out 0.2s forwards",
    },
    buttonGroup: {
        gap: "20px",
        justifyContent: "center",
        opacity: 0,
        animation: "fadeInUp 0.8s ease-out 0.4s forwards",
    },
    btnPrimary: {
        px: 5,
        py: 1.8,
        fontSize: "1.1rem",
        backgroundColor: "#fff",
        color: theme.palette.primary.main,
        borderRadius: "50px",
        boxShadow: "0 10px 20px -5px rgba(0,0,0,0.2)",
        "&:hover": {
            backgroundColor: alpha("#fff", 0.95),
            transform: "translateY(-3px)",
            boxShadow: "0 15px 30px -10px rgba(0,0,0,0.3)",
        },
    },
    btnSecondary: {
        px: 5,
        py: 1.8,
        fontSize: "1.1rem",
        borderRadius: "50px",
        borderColor: "rgba(255,255,255,0.5)",
        borderWidth: "2px",
        color: "#fff",
        "&:hover": {
            borderWidth: "2px",
            borderColor: "#fff",
            backgroundColor: "rgba(255,255,255,0.1)",
            transform: "translateY(-3px)",
        },
    },
    featuresSection: {
        padding: { xs: "60px 20px", md: "100px 0" },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: { xs: "40px 40px 0 0", md: "80px 80px 0 0" },
        mt: "auto",
        boxShadow: "0 -20px 40px -20px rgba(0,0,0,0.1)",
    },
    featureCard: {
        height: "100%",
        p: 1.5,
        background: "#fff",
        borderRadius: "24px",
        border: "1px solid rgba(0,0,0,0.05)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 20px 40px -15px rgba(99, 102, 241, 0.15)",
            borderColor: alpha(theme.palette.primary.main, 0.2),
        },
    },
    iconWrapper: {
        width: "56px",
        height: "56px",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main,
        mb: 3,
    },
});

export const LandingPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const styles = getStyles(theme);

    const features = [
        {
            title: "Hugging Face Powered",
            description: "Leverage state-of-the-art open-source LLMs through Hugging Face integration.",
            icon: <AutoAwesomeIcon sx={{ fontSize: 32 }} />,
        },
        {
            title: "Voice Interaction",
            description: "Natural-sounding voice synthesis and accurate speech-to-text transcription.",
            icon: <MicIcon sx={{ fontSize: 32 }} />,
        },
        {
            title: "Real-time Chat",
            description: "Instant responses with fluid streaming technology for a seamless conversation.",
            icon: <ChatIcon sx={{ fontSize: 32 }} />,
        },
        {
            title: "Ultra Fast",
            description: "Optimized infrastructure ensuring lightning-fast AI interactions.",
            icon: <SpeedIcon sx={{ fontSize: 32 }} />,
        },
        {
            title: "Private & Secure",
            description: "Your conversations are encrypted and your privacy is our top priority.",
            icon: <SecurityIcon sx={{ fontSize: 32 }} />,
        },
    ];

    return (
        <Box sx={styles.root}>
            {/* Hero Section */}
            <Container maxWidth="lg" sx={styles.hero}>
                <Typography variant="h1" sx={styles.title}>
                    The Future of AI Chat <br /> Starts Here
                </Typography>
                <Typography variant="body1" sx={styles.subtitle}>
                    Experience the power of open-source AI with a seamless, voice-enabled interface. Built for speed, privacy, and performance.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} sx={styles.buttonGroup}>
                    <Button
                        variant="contained"
                        sx={styles.btnPrimary}
                        size="large"
                        onClick={() => navigate("/signup")}
                    >
                        Start Chatting Now
                    </Button>
                    <Button
                        variant="outlined"
                        sx={styles.btnSecondary}
                        size="large"
                        onClick={() => navigate("/login")}
                    >
                        Sign In
                    </Button>
                </Stack>
            </Container>

            {/* Features Section */}
            <Box sx={styles.featuresSection}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        textAlign="center"
                        mb={8}
                        color="text.primary"
                        fontWeight={800}
                        sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
                    >
                        Unmatched Capabilities
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                                md: "repeat(3, 1fr)",
                            },
                            gap: 4,
                        }}
                    >
                        {features.map((feature, index) => (
                            <Card sx={styles.featureCard} key={index}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={styles.iconWrapper}>{feature.icon}</Box>
                                    <Typography variant="h5" gutterBottom fontWeight={700}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" lineHeight={1.6}>
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Container>

                {/* Footer / CTA Section */}
                <Container maxWidth="md" sx={{ py: 12, textAlign: "center" }}>
                    <Typography variant="h3" mb={4} fontWeight={800} sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}>
                        Ready to elevate your conversations?
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        sx={{
                            px: 8,
                            py: 2,
                            borderRadius: "50px",
                            fontSize: "1.2rem",
                            textTransform: "none",
                            boxShadow: "0 10px 30px -10px rgba(236, 72, 153, 0.5)",
                            "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: "0 15px 40px -12px rgba(236, 72, 153, 0.6)",
                            },
                        }}
                        onClick={() => navigate("/signup")}
                    >
                        Create Your Account
                    </Button>
                </Container>
            </Box>
        </Box>
    );
};
