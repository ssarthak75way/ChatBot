import { useState } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/auth.context";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import type { Theme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { ChatSidebar } from "../features/chat/ChatSidebar";

const drawerWidth = 280;

const getStyles = (theme: Theme) => ({
  root: {
    display: "flex",
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backdropFilter: "blur(12px)",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderBottom: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
  },
  menuButton: {
    mr: 2,
    display: { sm: "none" },
  },
  title: {
    flexGrow: 1,
    fontWeight: 800,
    letterSpacing: "-0.5px",
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  nav: {
    width: { sm: drawerWidth },
    flexShrink: { sm: 0 },
  },
  drawerPaper: {
    boxSizing: "border-box",
    width: drawerWidth,
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  main: {
    flexGrow: 1,
    p: { xs: 2, sm: 3 },
    width: { sm: `calc(100% - ${drawerWidth}px)` },
    position: "relative",
  },
  headerWrapper: {
    display: "flex",
    alignItems: "center"
  },
  toolbar: {
    justifyContent: "space-between"
  },
  logoutButton: {
    borderRadius: 2,
    textTransform: "none" as const,
    fontWeight: 600
  },
  mobileDrawer: {
    display: { xs: "block", sm: "none" }
  },
  desktopDrawer: {
    display: { xs: "none", sm: "block" }
  }
});

export function ProtectedLayout() {
  const { token, logout, expiresIn } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const styles = getStyles(theme);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSelectChat = (chatId: string) => {
    navigate(`/chat?id=${chatId}`);
    if (isMobile) setMobileOpen(false);
  };

  const handleNewChat = () => {
    navigate("/chat");
    if (isMobile) setMobileOpen(false);
  };

  const selectedChatId = new URLSearchParams(location.search).get("id") || undefined;

  return (
    <Box sx={styles.root}>
      <AppBar position="fixed" sx={styles.appBar} elevation={0}>
        <Toolbar sx={styles.toolbar}>
          <Box sx={styles.headerWrapper}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={styles.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={styles.title}>
              AI Chat Bot
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {expiresIn !== null && (
              <Typography variant="body2" sx={{
                color: expiresIn < 60 ? 'error.main' : 'text.secondary',
                fontWeight: 600,
                display: { xs: 'none', md: 'block' }
              }}>
                Session expires in: {Math.floor(expiresIn / 60)}:{String(expiresIn % 60).padStart(2, '0')}
              </Typography>
            )}
            <Button
              variant="outlined"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={styles.logoutButton}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={styles.nav}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            ...styles.mobileDrawer,
            "& .MuiDrawer-paper": styles.drawerPaper,
          }}
        >
          <Toolbar />
          <ChatSidebar
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            selectedChatId={selectedChatId}
          />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            ...styles.desktopDrawer,
            "& .MuiDrawer-paper": styles.drawerPaper,
          }}
          open
        >
          <Toolbar />
          <ChatSidebar
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            selectedChatId={selectedChatId}
          />
        </Drawer>
      </Box>

      <Box component="main" sx={styles.main}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
