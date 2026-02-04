import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth.context";
import { loginUser } from "./auth.api";
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
  "@keyframes slideInRight": {
    "0%": { opacity: 0, transform: "translateX(30px)" },
    "100%": { opacity: 1, transform: "translateX(0)" },
  },
  "@keyframes slideInLeft": {
    "0%": { opacity: 0, transform: "translateX(-30px)" },
    "100%": { opacity: 1, transform: "translateX(0)" },
  },
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    backgroundColor: "#fff",
  },
  bannerSide: {
    flex: 1,
    display: { xs: "none", md: "flex" },
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.light} 100%)`,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    padding: 8,
    position: "relative",
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: { xs: 4, md: 10 },
    animation: "slideInRight 0.8s ease-out",
  },
  formWrapper: {
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontWeight: 800,
    marginBottom: 1,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
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
    textAlign: "center",
    marginBottom: 2,
    animation: "slideInLeft 0.8s ease-out",
  },
  bannerSubtitle: {
    fontSize: "1.2rem",
    textAlign: "center",
    opacity: 0.9,
    maxWidth: "80%",
    animation: "slideInLeft 0.8s ease-out 0.2s forwards",
  },
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginInput = z.infer<typeof loginSchema>;

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = getStyles(theme);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput): Promise<void> => {
    try {
      const res = await loginUser(data);
      login(res);
      navigate("/chat");
    } catch (error: any) {
      alert(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <Box sx={styles.root}>
      {/* Banner Side (Left) */}
      <Box sx={styles.bannerSide}>
        <Typography variant="h2" sx={styles.bannerTitle}>
          Welcome Back!
        </Typography>
        <Typography sx={styles.bannerSubtitle}>
          Your AI companion is ready to pick up where you left off. Sign in to continue your journey.
        </Typography>
      </Box>

      {/* Form Side (Right) */}
      <Box sx={styles.formSide}>
        <Box sx={styles.formWrapper}>
          <Typography
            variant="h6"
            fontWeight={800}
            color="primary"
            sx={{ mb: 4, letterSpacing: 1 }}
          >
            AI CHAT BOT
          </Typography>
          <Typography variant="h4" sx={styles.title}>
            Sign In
          </Typography>
          <Typography sx={styles.subtitle}>
            Enter your details to access your account
          </Typography>

          <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={3} noValidate>
            <TextField
              fullWidth
              label="Email address"
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
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
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
                boxShadow: `0 8px 25px -8px ${alpha(theme.palette.primary.main, 0.52)}`,
                "&:hover": {
                  boxShadow: `0 12px 30px -10px ${alpha(theme.palette.primary.main, 0.6)}`,
                }
              }}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </Stack>

          <Box sx={{ mt: 5, textAlign: "center" }}>
            <Typography color="text.secondary">
              Don't have an account?{" "}
              <MuiLink component={Link} to="/signup" sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" }
              }}>
                Create one here
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
