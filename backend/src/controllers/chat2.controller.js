import { ChatMessage } from "../models/chat.model.js";
import { Employee } from "../models/index.js";

// Save new message (Optional - Socket already saves)
export const saveMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    // Validate that sender and receiver exist
    const senderExists = await Employee.findById(sender);
    const receiverExists = await Employee.findById(receiver);

    if (!senderExists || !receiverExists) {
      return res.status(404).json({ error: "Sender or receiver not found" });
    }

    const newMsg = await ChatMessage.create({ sender, receiver, message });

    const populatedMsg = await ChatMessage.findById(newMsg._id)
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.status(201).json(populatedMsg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.params;

    const messages = await ChatMessage.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getChatContacts = async (req, res) => {
  try {
    const currentEmployeeId = req.employee?._id; 
    const employees = await Employee.find({
      _id: { $ne: currentEmployeeId }, 
    }).select("name email department");

    res.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
