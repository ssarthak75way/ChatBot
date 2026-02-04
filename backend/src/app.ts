import express from "express";
import cors from 'cors'
import authRoutes from './modules/auth/auth.routes'
import chatRoutes from './modules/chat/chat.routes'
import { authRateLimiter, chatRateLimiter } from "./middleware/rate-limiter.middleware";

export const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRateLimiter, authRoutes);
app.use("/api/chat", chatRateLimiter, chatRoutes);

app.get("/", (req, res) => {
    res.send({ status: "I'm fine..." })
})

export default app;