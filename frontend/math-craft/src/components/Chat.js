import React from "react"
import {io} from "socket.io-client"
import Navbar from '../components/Navbar'; 

    const ChatApp = ()=>{
        const socket = io("http://localhost:5000");
        return <div>
                    <Navbar/>
               </div>
    };

    export default ChatApp