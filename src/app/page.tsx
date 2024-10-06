'use client';
import { useEffect, useState, useCallback } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';

interface Message {
  senderId: string;
  text: string;
  _id?: string;
}

const ChatPage = ({ chatId }: { chatId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [senderId] = useState<string>('user1'); // Static sender ID for demonstration; replace with actual auth ID

  // Fetch messages once when component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${chatId}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [chatId]);

  // Initialize Pusher and subscribe to the channel
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`chat-${chatId}`);
    channel.bind('message', (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup on component unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chatId]);

  // Send a message
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const newMessage = { senderId, text: message };

      // Optimistically add the message to UI
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Save the message in the database and trigger Pusher
      await axios.post(`/api/messages/${chatId}`, newMessage);
      await axios.post(`/api/pusher/trigger`, { chatId, ...newMessage });
      
      setMessage(''); // Clear the input field on successful send
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.senderId}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;




// "use client"

// import { useEffect,useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { get } from "http";


// export default function Home() {
//   interface User {
//     id: string;
//     username: string;
//     email: string;
//   }
//   const [user, setUser] = useState({} as User)
//   const [username, setUsername] = useState("")
//   const router = useRouter()
//   useEffect(() => {
//     async function getData() {
      
//       const response = await axios.get("/api/getCurrentUser")
//       if(!response.data.status){
//         console.log("not logged in")
//         router.push("/signin")
//       }
//       else{
//         setUser(response.data.user)
//         setUsername(response.data.user.username)
//       }
      
//     }
//     getData()
    
//   },[])

//   return (
//       <div className="text-red-500 text-5xl p-10">
//           <h3>{username}</h3>
//           <h3>{user.username}</h3>
//           <h3>{user.id}</h3>
//           <h3>{user.email}</h3>

//           <button onClick={async () => {
//             const response = await axios.get("/api/auth/logout")
//             router.push("/signin")
//           }}>Logout</button>

//       </div>

      
//   );
// }
