'use client';
import { useEffect, useState, useCallback, use } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';
import { sendMessage } from '@/actions/message-actions';
import { pusherClient } from '@/lib/pusher';

const ChatPage = ({ chatId }: { chatId: string }) => {


  return (
    <div>
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
