import { Employee } from "../models/emp.model.js";
import { ChatMessage } from "../models/chat.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

// Get all employees for chat contacts
const getChatContacts = asyncHandler(async (req, res) => {
  const currentEmployeeId = req.employee?._id;

  const employees = await Employee.find({
    _id: { $ne: currentEmployeeId },
  }).select("name email department").populate("department","name");

  return res
    .status(200)
    .json(
      new ApiResponse(200, employees, "Chat contacts fetched successfully")
    );
});

// Get chat history between two employees
const getMessages = asyncHandler(async (req, res) => {
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

  const count = messages.length;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { count, messages },
        "All messages fetched successfully"
      )
    );
});

// Save new message (Optional - Socket already saves)
const saveMessage = asyncHandler(async (req, res) => {
  const { sender, receiver, message } = req.body;

  const senderExists = await Employee.findById(sender);
  const receiverExists = await Employee.findById(receiver);

  if (!senderExists || !receiverExists) {
    throw new ApiError(404, "Sender or receiver not found");
  }

  const newMessage = await ChatMessage.create({sender,receiver,message})

  const populatedMsg = await ChatMessage.findById(newMessage._id)
        .populate("sender", "name email")
        .populate("receiver", "name email");

  return res
  .status(201)
  .json(
    new ApiResponse(201,populatedMsg,'Message saved successfully')
  ) 
});

export { getChatContacts, getMessages,saveMessage };
