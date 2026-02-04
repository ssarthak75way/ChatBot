import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "./auth.api";
import { useAuth } from "./auth.context";
import {
    Box,
    Typography,
    TextField,
    Button,
    useTheme,
    Link as MuiLink,
    alpha,
    Stack,
} from "@mui/material";
import type { Theme } from "@mui/material";

const getStyles = (theme: Theme) => ({
    "@keyframes slideInLeft": {
        "0%": { opacity: 0, transform: "translateX(-30px)" },
        "100%": { opacity: 1, transform: "translateX(0)" },
    },
    "@keyframes slideInRight": {
        "0%": { opacity: 0, transform: "translateX(30px)" },
        "100%": { opacity: 1, transform: "translateX(0)" },
    },
    root: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row-reverse" } as const, // Reverse for Form Left, Banner Right
        backgroundColor: "#fff",
    },
    bannerSide: {
        flex: 1,
        display: { xs: "none", md: "flex" },
        background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.primary.light} 100%)`,
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        padding: 8,
        position: "relative" as const,
        overflow: "hidden",
        "&::before": {
            content: '""',
            position: "absolute",
            width: "200%",
            height: "200%",
            background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            top: "-50%",
            left: "-50%",
        }
    },
    formSide: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "center",
        padding: { xs: 4, md: 10 },
        animation: "slideInLeft 0.8s ease-out",
    },
    formWrapper: {
        width: "100%",
        maxWidth: 400,
    },
    title: {
        fontWeight: 800,
        marginBottom: 1,
        background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    subtitle: {
        color: theme.palette.text.secondary,
        marginBottom: 5,
        fontSize: "1rem",
        fontWeight: 500,
    },
    bannerTitle: {
        fontWeight: 800,
        fontSize: "3rem",
        textAlign: "center" as const,
        marginBottom: 2,
        animation: "slideInRight 0.8s ease-out",
    },
    bannerSubtitle: {
        fontSize: "1.2rem",
        textAlign: "center" as const,
        opacity: 0.9,
        maxWidth: "80%",
        animation: "slideInRight 0.8s ease-out 0.2s forwards",
    },
});

const signupSchema = z
    .object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type SignupInput = z.infer<typeof signupSchema>;

export function Signup() {
    const navigate = useNavigate();
    const theme = useTheme();
    const styles = getStyles(theme);
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupInput) => {
        try {
            const res = await registerUser({
                email: data.email,
                password: data.password,
            });
            login(res);
            navigate("/chat");
        } catch (error: any) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <Box sx={styles.root}>
            {/* Banner Side (Right) */}
            <Box sx={styles.bannerSide}>
                <Typography variant="h2" sx={styles.bannerTitle}>
                    Join Us Today!
                </Typography>
                <Typography sx={styles.bannerSubtitle}>
                    Create an account and start interacting with the most advanced AI models in seconds.
                </Typography>
            </Box>
            {/* Form Side (Left) */}
            <Box sx={styles.formSide}>
                <Box sx={styles.formWrapper}>
                    <Typography
                        variant="h6"
                        fontWeight={800}
                        color="secondary"
                        sx={{ mb: 4, letterSpacing: 1 }}
                    >
                        AI CHAT BOT
                    </Typography>
                    <Typography variant="h4" sx={styles.title}>
                        Create Account
                    </Typography>
                    <Typography sx={styles.subtitle}>
                        Start your journey with AI Chat Bot
                    </Typography>

                    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={3} noValidate>
                        <TextField
                            fullWidth
                            label="Email Address"
                            placeholder="name@example.com"
                            autoComplete="email"
                            autoFocus
                            {...register("email")}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            placeholder="Min 6 characters"
                            type="password"
                            {...register("password")}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            placeholder="Repeat your password"
                            type="password"
                            {...register("confirmPassword")}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={isSubmitting}
                            sx={{
                                py: 1.8,
                                fontSize: "1.1rem",
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 700,
                                boxShadow: `0 8px 25px -8px ${alpha(theme.palette.secondary.main, 0.52)}`,
                                "&:hover": {
                                    boxShadow: `0 12px 30px -10px ${alpha(theme.palette.secondary.main, 0.6)}`,
                                }
                            }}
                        >
                            {isSubmitting ? "Creating account..." : "Sign Up"}
                        </Button>
                    </Stack>

                    <Box sx={{ mt: 5, textAlign: "center" }}>
                        <Typography color="text.secondary">
                            Already have an account?{" "}
                            <MuiLink component={Link} to="/login" sx={{
                                color: theme.palette.secondary.main,
                                fontWeight: 700,
                                textDecoration: "none",
                                "&:hover": { textDecoration: "underline" }
                            }}>
                                Sign in here
                            </MuiLink>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box >
    );
}
