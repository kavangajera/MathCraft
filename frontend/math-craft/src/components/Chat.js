import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { baseUrl } from "../Urls";  
import './Chat.css';

const MathChat = () => {
  const socket = useMemo(() => io(`${baseUrl}`), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [chats, setChats] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [users, setUsers] = useState([]);
  const [roomMessages, setRoomMessages] = useState([]);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected with id: ", socket.id);
    });

    socket.on("receive-message", (data) => {
      setChats((prevChats) => [...prevChats, data]);
    });

    socket.on("update-user-status", (onlineUsers) => {
      setUsers(onlineUsers);
    });

    socket.on("room-activity", (data) => {
      console.log("Room activity received:", data);
      setRoomMessages((prevMessages) => [...prevMessages, data]);
    });

    fetchCurrentUser();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (currentUser && currentUser.username) {
      socket.emit("user-connected", { username: currentUser.username, badgeId: currentUser.badgeId });
    }
  }, [currentUser, socket]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && room.trim()) {
      const newMessage = {
        message,
        room,
        username: currentUser.username,
        socketId: socket.id,
      };
      socket.emit("message", newMessage);
      setMessage("");
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/user/current`, {
        credentials: 'include',
      });
      const data = await response.json();
      setCurrentUser(data.user);
    } catch (err) {
      setError(`Failed to load user: ${err.message}`);
    }
  };

  const handleRoomSubmit = (e) => {
    e.preventDefault();
    if (roomName.trim()) {
      socket.emit("join-room", { room: roomName, username: currentUser.username });
      setRoom(roomName);
      setRoomName("");
    }
  };

  const insertMathSymbol = (symbol) => {
    setMessage((prevMessage) => prevMessage + symbol);
  };

  return (
    <div className="math-chat">
      <header className="chat-header">
        <h1>Instant MathChat</h1>
      </header>

      <div className="chat-container">
        <div className="sidebar">
          <div className="room-form">
            <h5>Create or Join Room to start instant chat</h5>
            <form onSubmit={handleRoomSubmit}>
              
              <input
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <button type="submit">Join Room</button>
            </form>
          </div>

          <div className="online-users">
            <h3>Online Users</h3>
            <ul>
    {users.length > 0 ? (
      users.map((user, index) => {
        let badgeSymbol = "";
        let badgeClass = "";

        // Assign symbols and classes based on badge position
        switch (user.badgeId ? user.badgeId.position : "") {
          case "Beginner":
            badgeSymbol = "🌱";
            badgeClass = "beginner-badge";
            break;
          case "Rookie":
            badgeSymbol = "🪖";
            badgeClass = "rookie-badge";
            break;
          case "Intermediate":
            badgeSymbol = "🎖️";
            badgeClass = "intermediate-badge";
            break;
          case "Expert":
            badgeSymbol = "⭐";
            badgeClass = "expert-badge";
            break;
          default:
            break;
        }

        return (
          <li key={index}>
            <span>{user.username}</span>
            <span className={`badge ${badgeClass}`}>{badgeSymbol} {user.badgeId?.position}</span>
          </li>
        );
      })
    ) : (
      <li>No users online</li>
    )}
  </ul>
          </div>

          <div className="room-messages">
            <h3>Room Activity</h3>
            <ul>
              {roomMessages.map((msg, index) => (
                <li key={index}>{msg.username} joined room: {msg.room}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="chat-main">
          <div className="chat-messages">
            {chats.length > 0 ? (
              chats.map((chat, index) => (
                <div
                  key={index}
                  className={`message ${chat.socketId === socket.id ? 'sent' : 'received'}`}
                >
                  <span className="username">{chat.username}</span>
                  <p>{chat.message}</p>
                </div>
              ))
            ) : (
              <p className="no-messages">No messages yet</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="message-form">
            <input
              placeholder="Type your mathematical message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
          <div className="math-keyboard">
            {['+', '-', '×', '÷', '=', '≠', '≈', '√', 'π', '∑', '∫', '∞'].map((symbol) => (
              <button key={symbol} onClick={() => insertMathSymbol(symbol)}>{symbol}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathChat;
