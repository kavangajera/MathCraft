import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import './Chat.css';

const MathChat = () => {
  const socket = useMemo(() => io("http://localhost:5000"), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [chats, setChats] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [roomMessages, setRoomMessages] = useState([]);

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

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (username) {
      socket.emit("user-connected", username);
    }
  }, [username, socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && room.trim()) {
      const newMessage = { message, room, username, socketId: socket.id };
      socket.emit("message", newMessage);
      setMessage("");
    }
  };

  const handleRoomSubmit = (e) => {
    e.preventDefault();
    if (roomName.trim()) {
      socket.emit("join-room", { room: roomName, username });
      setRoom(roomName);
      setRoomName("");
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit("user-connected", username);
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
          <div className="user-form">
            <form onSubmit={handleUsernameSubmit}>
              <input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button type="submit">Set Username</button>
            </form>
          </div>

          <div className="room-form">
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
                users.map((user, index) => <li key={index}>{user}</li>)
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