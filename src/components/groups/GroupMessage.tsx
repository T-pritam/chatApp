"use client"
import React from 'react'
import GroupNavbar from './GroupNavbar';
import { useState,useEffect,useRef } from 'react';
import { IoMdSend } from "react-icons/io";
import { useSelector } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import { pusherClient } from '@/lib/pusher';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/userStore';
import { updateMessage } from '@/store/chatListSlice';
import { UserState } from '@/store/userSlice';
import axios from 'axios';
import '@/components/css/scrollbar.css';
import { group } from 'console';

interface groupType{
    _id: string,
    username: string,
}

interface friendDetails{
  id: string,
  name: string,
  members: number,
  setDetails: React.Dispatch<React.SetStateAction<boolean>>
}

interface message{
  senderId: groupType,
  text: string,
  createdAt : string,
}

const GroupMessage:React.FC<friendDetails> = ({id, name, members, setDetails}) => {
  const dispatch = useDispatch<AppDispatch>()
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
      const res = await axios.get(`/api/messages/group?id=${id}`)
      setMessages(res.data.messages)
    }
    getMessages()
    scrollToBottom()
  },[])

  useEffect(() => {
    if (!pusherRef.current){
      const channel = pusherClient.subscribe(`groups`)
      channel.bind('new-messages', (data : {groupId : string,senderId : string, text : string,senderUsername: string}) => {
        console.log("Match Id : ",data.senderId,user._id)  
        if (data.senderId === user._id) {
            return
          } else {
          setMessages((prevMessages) => [...prevMessages, {senderId : {username : data.senderUsername,_id : data.senderId},text : data.text,createdAt:new Date().toISOString()}])
          dispatch(updateMessage({id : data.groupId,message : data.text,time:new Date().toISOString(),sender : data.senderUsername}))
      }})
      return () => {
        channel.unbind('new-messages')
        pusherClient.unsubscribe(`groups`)
      }
    }
    
  },[dispatch])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if(text.trim() !== ""){
      axios.post(`/api/messages/group`,{
        senderId : user._id,
        groupId : id,
        text,
        senderUsername : user.username
      })
      setMessages([...messages,{senderId : {_id : user._id,username : user.username},text,createdAt:new Date().toISOString()}])
      dispatch(updateMessage({id : id,message : text,time:new Date().toISOString(),sender : user.username}))
      setText("")
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString); // Convert string to Date object
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className='flex flex-col h-screen'>

      <div className='h-16 bg-gray-900' onClick={() => setDetails(true)}>
        <GroupNavbar name={name} members={members}/>
      </div>

      <div  ref={messageContainerRef} className='bg-gray-700 flex-1 overflow-y-auto h-screen scrollbar-thin p-4'>
        {
          messages.map((message,index) => (
            <div key={index}>
              <div className={`flex ${message.senderId._id === user._id ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`inline-block max-w-md break-words bg-opacity-80 px-2 py-1 mb-1 rounded text-white ${
              message.senderId._id === user._id ? 'bg-[#005c4b]' : 'bg-gray-500'
            }`}
          >
            <div>
                <p>{message.senderId._id === user._id ? null : message.senderId.username}</p>
               <p className='leading-5 text-base'>{message.text}</p>
               <p className='flex justify-end text-xs float-right text-[#ddd] mt-0'>{formatTime(message.createdAt)}</p>
            </div>
          </div>
        </div>
            </div>
          ))
        }
        
      </div>

      <div className='bg-gray-900 h-16 p-3 flex justify-around'>
            <input type="text" placeholder='Type a message' value={text} className='bg-gray-800 w-4/6 h-10 outline-none border-8 rounded border-gray-800 text-white' onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null}/>
            <IoMdSend size={'2.5vw'} color='#999' className='my-auto' onClick={ sendMessage }/>
      </div>
      
    </div>
  )
}

export default GroupMessage