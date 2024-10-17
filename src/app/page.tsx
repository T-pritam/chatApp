'use client';

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/store/userSlice";
import { useEffect } from "react";
import axios from "axios";

const ChatPage = ({ chatId }: { chatId: string }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    async function getUser(token:string){
      const response = await axios.get('/api/getUser?token='+token)
      if(response.data.status){
        dispatch(login(response.data.user))
        router.push('/chat')
      } else {
        localStorage.removeItem('token')
        router.push('/auth/signin')
      }
    }
    const token = localStorage.getItem('token')
    if (token){
      getUser(token)
    } else {
      router.push('/auth/signin')
    }
  },[])

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
