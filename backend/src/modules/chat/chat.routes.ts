import { Router } from "express";
import multer from "multer";
import { streamMessage, listChats, getChatById, deleteChat } from "./chat.controller";
import { processAudioMessage } from "./audio.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", authMiddleware, listChats);
router.get("/:id", authMiddleware, getChatById);
router.delete("/:id", authMiddleware, deleteChat);
router.post("/stream", authMiddleware, streamMessage);
router.post("/audio", authMiddleware, upload.single("audio"), processAudioMessage);

export default router;
