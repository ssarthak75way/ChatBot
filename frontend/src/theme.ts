import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#6366f1", // Indigo
            light: "#818cf8",
            dark: "#4f46e5",
            contrastText: "#fff",
        },
        secondary: {
            main: "#ec4899", // Pink
            light: "#f472b6",
            dark: "#db2777",
            contrastText: "#fff",
        },
        background: {
            default: "#f8fafc",
            paper: "#ffffff",
        },
        text: {
            primary: "#1e293b",
            secondary: "#64748b",
        },
        divider: "#e2e8f0",
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: {
            textTransform: "none",
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: "8px 16px",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    },
                },
                containedPrimary: {
                    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                    borderRadius: 12,
                },
                elevation1: {
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
                size: "small",
            },
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 8,
                        backgroundColor: "#fff",
                        "& fieldset": {
                            borderColor: "#e2e8f0",
                        },
                        "&:hover fieldset": {
                            borderColor: "#cbd5e1",
                        },
                        "&.Mui-focused fieldset": {
                            borderWidth: "1px",
                        },
                    },
                },
            },
        },
    },
});
