"use client";
import { useState, useEffect } from "react";
import { io } from "socket.io-client"; // Updated import
import { useSelector } from "react-redux"; // Assuming you use Redux

// Initialize socket connection
let socket = null;

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  // Get current user from Redux store (assuming you store user data)
  const currentUser = useSelector((state) => state.user?.user);
  const token = useSelector((state) => state.user?.accessToken);

  useEffect(() => {
    // Initialize socket connection
    socket = io("http://localhost:9000", {
      transports: ["websocket", "polling"], // Allow both transports
      timeout: 20000,
    });

    // Connection event handlers
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
      setIsConnected(true);

      // Join room with current user's ID
      if (currentUser?._id) {
        socket.emit("joinRoom", currentUser._id);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection failed:", error);
      setIsConnected(false);
    });

    // Message handlers
    socket.on("receiveMessage", (msg) => {
      console.log("Received message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("messageSent", (msg) => {
      console.log("Message sent confirmation:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("messageError", (error) => {
      console.error("Message error:", error);
      alert("Failed to send message");
    });

    socket.on("activeUsers", (users) => {
      setActiveUsers(users);
    });

    // Load chat contacts
    loadChatContacts();

    // Cleanup on component unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [currentUser]);

  // Load chat history when contact is selected
  useEffect(() => {
    if (selectedContact && currentUser) {
      loadChatHistory(currentUser._id, selectedContact._id);
    }
  }, [selectedContact, currentUser]);

  const loadChatContacts = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/chat/contacts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error("Failed to load contacts:", error);
    }
  };

  const loadChatHistory = async (senderId, receiverId) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/chat/${senderId}/${receiverId}`
      );
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !selectedContact || !currentUser || !isConnected) {
      return;
    }

    const messageData = {
      sender: currentUser._id,
      receiver: selectedContact._id,
      message: input.trim(),
    };

    console.log("Sending message:", messageData);
    socket.emit("sendMessage", messageData);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

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
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: "10px",
                    textAlign:
                      msg.sender === currentUser._id ? "right" : "left",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      backgroundColor:
                        msg.sender === currentUser._id ? "#007bff" : "#e9ecef",
                      color: msg.sender === currentUser._id ? "white" : "black",
                      maxWidth: "70%",
                    }}
                  >
                    <div style={{ fontSize: "14px" }}>{msg.message}</div>
                    <div style={{ fontSize: "10px", opacity: 0.7 }}>
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
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
