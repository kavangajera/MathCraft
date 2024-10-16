import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import Navbar from '../components/Navbar'; 

const ChatApp = () => {
    const socket = useMemo(() => io("http://localhost:5000"), []);
    const [message, setMessage] = useState('');
    const [room, setRoom] = useState('');
    const [socketId, setSocketId] = useState('');
    const [chats, setChats] = useState([]);
    const [roomName,setRoomName] = useState([])

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("message", { message, room });
        setMessage("");
    };

    const handleRoomSubmit = (e) => {
        e.preventDefault();
        socket.emit("join-room",roomName);
    }

    useEffect(() => {
        socket.on("connect", () => {
            setSocketId(socket.id);
            console.log("Connected with id: ", socket.id);
        });
        
        socket.on("receive-message", (data) => {
            console.log(data)
            setChats((prevChats) => [...prevChats, data]);
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return (
        <div>
            <Navbar />
            <br />
            <br />
            <h1>Welcome to Chats</h1>
            <h3>{socketId}</h3>

            <form onSubmit={handleRoomSubmit}>
                <input 
                    placeholder="Room Name" 
                    value={roomName} 
                    onChange={e => setRoomName(e.target.value)}
                />
               
                <br />
                <button type="submit">Join</button>
            </form>

            <form onSubmit={handleSubmit}>
                <input 
                    placeholder="Message" 
                    value={message} 
                    onChange={e => setMessage(e.target.value)}
                />
                <input 
                    placeholder="Room" 
                    value={room} 
                    onChange={e => setRoom(e.target.value)}
                />
                <br />
                <button type="submit">Send</button>
            </form>

            {/* Display the chat messages */}
            <div>
                {chats.map((chat, index) => (
                    <p key={index}>{chat}</p>
                ))}
            </div>
        </div>
    );
};

export default ChatApp;
