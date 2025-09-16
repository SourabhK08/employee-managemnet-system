"use client";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import {
  useGetChatContactsQuery,
  useGetChatHistoryQuery,
} from "@/store/features/chatSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";

let socket = null;

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  const currentUser = useSelector((state) => state.user?.user);
  // const token = useSelector((state) => state.user?.accessToken);
  // const token = Cookies.get("accessToken");
  // console.log("---token---", token);

  const {
    data: contactsData,
    isLoading: contactsLoading,
    isError: contactsError,
  } = useGetChatContactsQuery();

  const contacts = contactsData?.data || [];

  const {
    data: chatHistoryData,
    isLoading: chatLoading,
    refetch: refetchChatHistory,
  } = useGetChatHistoryQuery(
    selectedContact && currentUser
      ? { senderId: currentUser._id, receiverId: selectedContact._id }
      : "",
    {
      skip: !(selectedContact && currentUser),
    }
  );

  const sendMessage = () => {
    if (!input.trim() || !selectedContact || !currentUser || !isConnected) {
      return;
    }

    const messageData = {
      sender: currentUser._id,
      receiver: selectedContact._id,
      message: input.trim(),
    };

    socket.emit("sendMessage", messageData);
    setInput("");
  };

  useEffect(() => {
    socket = io("http://localhost:9000", {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setIsConnected(true);
      if (currentUser?._id) {
        socket.emit("joinRoom", currentUser._id);
      }
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection failed:", error);
      setIsConnected(false);
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("messageSent", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("messageError", (error) => {
      alert("Failed to send message");
    });

    socket.on("activeUsers", (users) => {
      setActiveUsers(users);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    console.log("chatHistoryData", chatHistoryData);
    console.log("chatHistoryData?.success", chatHistoryData?.success);
    if (chatHistoryData?.success) {
      setMessages(chatHistoryData.data.messages);
    }
  }, [chatHistoryData]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Contacts Sidebar */}
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <h3>Contacts</h3>
        <div style={{ marginBottom: "10px" }}>
          Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>
        <div style={{ marginBottom: "10px" }}>
          Online: {activeUsers.length} users
        </div>

        {contacts.map((contact) => (
          <div
            key={contact._id}
            onClick={() => setSelectedContact(contact)}
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor:
                selectedContact?._id === contact._id
                  ? "#e3f2fd"
                  : "transparent",
              borderRadius: "5px",
              marginBottom: "5px",
            }}
          >
            <div style={{ fontWeight: "bold" }}>{contact.name}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {contact.email}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <h2>
          {selectedContact
            ? `Chat with ${selectedContact.name}`
            : "Select a contact to start chatting"}
        </h2>

        {selectedContact && (
          <>
            {/* Messages */}
            <div
              style={{
                flex: 1,
                border: "1px solid #ccc",
                padding: "10px",
                overflowY: "scroll",
                marginBottom: "10px",
                backgroundColor: "#f9f9f9",
              }}
            >
              {messages?.map((msg, i) => {
                const isCurrentUser = msg?.sender?._id === currentUser?._id;
          
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        padding: "8px 12px",
                        borderRadius: "10px",
                        backgroundColor: isCurrentUser ? "#007bff" : "#e9ecef",
                        color: isCurrentUser ? "white" : "black",
                        maxWidth: "70%",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>{msg.message}</div>
                      <div style={{ fontSize: "10px", opacity: 0.7 }}>
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type message..."
                disabled={!isConnected}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!isConnected || !input.trim()}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
