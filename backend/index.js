import dotenv from "dotenv";
import connectDb from "./src/db/index.js";
import app from "./app.js";

import http from "http";
import { Server } from "socket.io";
import { ChatMessage } from "./src/models/chat.model.js";

dotenv.config();

const port = process.env.PORT;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Handle user joining with their employee ID
  socket.on("joinRoom", (employeeId) => {
    socket.employeeId = employeeId;
    socket.join(employeeId);

    // Add to active users
    activeUsers.set(employeeId, socket.id);

    console.log(`Employee ${employeeId} joined with socket ${socket.id}`);

    // Broadcast active users to all clients
    io.emit("activeUsers", Array.from(activeUsers.keys()));
  });

  // Handle sending messages
  socket.on("sendMessage", async (data) => {
    try {
      const { sender, receiver, message } = data;
      console.log("Message received:", { sender, receiver, message });

      // Save message to database
      const newMsg = await ChatMessage.create({
        sender,
        receiver,
        message,
      });

      // Populate sender info if needed
      const populatedMsg = await ChatMessage.findById(newMsg._id)
        .populate("sender", "name")
        .populate("receiver", "name");

      // Send to specific receiver if they're online
      const receiverSocketId = activeUsers.get(receiver);
      if (receiverSocketId) {
        io.to(receiver).emit("receiveMessage", populatedMsg);
      }

      // Send confirmation back to sender
      socket.emit("messageSent", populatedMsg);

      console.log("Message saved and sent:", populatedMsg);
    } catch (err) {
      console.error("Error saving chat message:", err);
      socket.emit("messageError", { error: "Failed to send message" });
    }
  });

  // Handle typing indicators
  socket.on("typing", ({ receiver, isTyping }) => {
    const receiverSocketId = activeUsers.get(receiver);
    if (receiverSocketId) {
      io.to(receiver).emit("userTyping", {
        sender: socket.employeeId,
        isTyping,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    // Remove from active users
    if (socket.employeeId) {
      activeUsers.delete(socket.employeeId);
      // Broadcast updated active users
      io.emit("activeUsers", Array.from(activeUsers.keys()));
    }
  });
});

connectDb()
  .then(() => {
    app.on("error", (err) => {
      console.log("Error while connecting from express", err);
    });

    server.listen(port, () => {
      console.log(`server connection at ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error in connecting db", err);
  });
