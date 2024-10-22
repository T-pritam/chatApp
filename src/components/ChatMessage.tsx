"use client"
import React from 'react'
import UserNavbar from './UserNavbar'
import { useState,useEffect,useRef } from 'react';
import { IoMdSend } from "react-icons/io";
import { useSelector } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import { pusherClient } from '@/lib/pusher';
import axios from 'axios';
import '@/components/css/scrollbar.css';

interface friendDetails{
  id: string,
  username: string,
  about: string,
  email: string,
  setDetails: React.Dispatch<React.SetStateAction<boolean>>
}

interface message{
  senderId: string,
  receiverId: string,
  text: string,
  createdAt : string,
}

const ChatMessage:React.FC<friendDetails> = ({id, username, about, email, setDetails}) => {
  const [text, setText] = useState<string>('')
  const [messages,setMessages] = useState<message[]>([])
  const user = useSelector((state:RootStateType) => state.user)
  const pusherRef = useRef<any>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    async function getMessages(){
      console.log("senderId : ",user._id," receiverId : ",id)
      const res = await axios.get(`/api/messages/user?senderId=${user._id}&receiverId=${id}`)
      console.log("senderId : ",user._id," receiverId : ",id)
      console.log(res.data)
      setMessages(res.data.messages)
    }
    getMessages()
    scrollToBottom()
  },[])

  useEffect(() => {
    if (!pusherRef.current){
      const channel = pusherClient.subscribe(`user-${user._id}`)
      channel.bind('new-message', (data : {senderId : string, receiverId : string, text : string}) => {
          setMessages((prev) => [...prev, {senderId : data.senderId,receiverId : data.receiverId,text : data.text,createdAt:new Date().toISOString()}]);
      })

      return () => {
        channel.unbind('new-message')
        pusherClient.unsubscribe(`user-${user._id}`)
      }
    }
    
  },[])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString); // Convert string to Date object
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className='flex flex-col h-screen'>

      <div className='h-16 bg-gray-900'>
        <UserNavbar username={username}/>
      </div>

      <div  ref={messageContainerRef} className='bg-gray-700 flex-1 overflow-y-auto h-screen scrollbar-thin p-4'>
        {
          messages.map((message,index) => (
            <div key={index}>
              <div 
          className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`inline-block max-w-md break-words bg-opacity-80 p-1 mb-1 rounded-md text-white ${
              message.senderId === user._id ? 'bg-green-500' : 'bg-gray-400'
            }`}
          >
            {message.text}
            <div>
               <p className='text-xs inline-block float-right'>{formatTime(message.createdAt)}</p>
            </div>
          </div>
        </div>
            </div>
          ))
        }
        
      </div>

      <div className='bg-gray-900 h-16 p-3 flex justify-around'>
            <input type="text" placeholder='Type a message' className='bg-gray-800 w-4/6 h-10 outline-none border-8 rounded border-gray-800 text-white' onChange={(e) => setText(e.target.value)} />
            <IoMdSend size={'2.5vw'} color='#999' className='my-auto' onClick={() => {
              if(text !== ""){
                axios.post(`/api/messages/user`,{
                  senderId : user._id,
                  receiverId : id,
                  text
                })
                console.log("Before : ",text)
                setText("")
                setMessages([...messages,{senderId : user._id,receiverId : id,text,createdAt:new Date().toISOString()}])
                console.log("After : ",text)
              }
            }}/>
      </div>
      
    </div>
  )
}

export default ChatMessage