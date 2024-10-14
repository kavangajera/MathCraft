    import React from "react"
    import {io} from "socket.io-client"

    const ChatApp = ()=>{
        const socket = io("http://localhost:5000");
        return <div>Chat App</div>
    };

    export default ChatApp