import express from "express";
import {
  getMessages,
  saveMessage,
  getChatContacts,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.js";

const chatRoutes = express.Router();

chatRoutes.use(verifyJWT);

chatRoutes.route("/contacts").get(getChatContacts);// Get all employees for chat
chatRoutes.route("/send").post(saveMessage);// Send message (backup API)
chatRoutes.route("/:sender/:receiver").get(getMessages);// Fetch chat history

export default chatRoutes;
