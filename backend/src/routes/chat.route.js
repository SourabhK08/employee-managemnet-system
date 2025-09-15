import express from "express";
import {
  getMessages,
  saveMessage,
  getChatContacts,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.js";

const chatRoutes = express.Router();

// chatRoutes.use(verifyJWT);

chatRoutes.get("/contacts", getChatContacts); // Get all employees for chat
chatRoutes.post("/send", saveMessage); // Send message (backup API)
chatRoutes.get("/:sender/:receiver", getMessages); // Fetch chat history

export default chatRoutes;
