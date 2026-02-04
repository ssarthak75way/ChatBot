import {
  createBrowserRouter,
} from "react-router-dom";

import { PublicLayout } from "./layouts/PublicLayout";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { Login } from "./features/auth/Login";
import { Signup } from "./features/auth/Signup";
import { ChatWindow } from "./features/chat/ChatWindow";
import { LandingPage } from "./features/landing/LandingPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/",
        element: <LandingPage />,
      },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/chat",
        element: <ChatWindow />,
      },
    ],
  },
  {
    path: "*",
    element: <Login />,
  },
]);
