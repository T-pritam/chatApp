"use client";
import React from 'react'
import UserNavbar from './UserNavbar'
import MessageBox from './MessageBox';
import { useState, useEffect, useRef } from 'react';
import { IoMdSend } from "react-icons/io";
import { useSelector } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import { pusherClient } from '@/lib/pusher';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/userStore';
import { updateMessage,updateUnReadMessageCount } from '@/store/chatListSlice';
import { Plus } from 'lucide-react';
import { toast } from 'sonner'
import axios from 'axios';
import '@/components/css/scrollbar.css';

export interface friendDetails {
  id: string,
  username: string,
  about: string,
  email: string,
  setDetails: React.Dispatch<React.SetStateAction<boolean>>
}

export interface message {
  senderId: string,
  receiverId: string,
  text: string,
  fileType: string,
  fileUrl: string,
  downloadUrl: string,
  createdAt: string,
}

const ChatMessage: React.FC<friendDetails> = ({ id, username, about, email, setDetails }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [text, setText] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [typing, setTyping] = useState<boolean>(false)
  const [messages, setMessages] = useState<message[]>([])
  const MAX_FILE_SIZE_BYTES = 64 * 1024 * 1024;

  const lastMessages = useSelector((state: RootStateType) => state.chatList)
  const user = useSelector((state: RootStateType) => state.user)
  const pusherRef = useRef<any>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    async function getMessages() {
      const res = await axios.get(`/api/messages/user?senderId=${user._id}&receiverId=${id}`)
      setMessages(res.data.messages)
      dispatch(updateUnReadMessageCount({ senderId: id, unreadMessageCount: 0 }))
    }
    getMessages()
    scrollToBottom()
  }, [])

  useEffect(() => {
    if (!pusherRef.current) {
      const channel = pusherClient.subscribe(`user-last-message`)
      channel.bind('new-message', (data: { senderId: string, receiverId: string, text: string, fileType: string,fileUrl: string }) => {
        console.log("Pusher Pauyload data chat msg : ", data)
        if (data.senderId === user._id) {
          return
        } else {
          console.log("Pusher Pauyload data chat msg : ", data)
          setMessages((prev) => [...prev, { senderId: data.senderId, receiverId: data.receiverId, fileType: data.fileType, fileUrl: data.fileUrl , text: data.text, createdAt: new Date().toISOString(),downloadUrl : "" }]);
          dispatch(updateMessage({ id: data.senderId, message: data.text, lastMessageType: data.fileType ,time: new Date().toISOString(),unreadMessageCount: 0 }))
          setTyping(false)
        }
      })

      return () => {
        channel.unbind('new-message')
        pusherClient.unsubscribe(`user-${user._id}`)
      }
    }
  }, [dispatch])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const channel = pusherClient.subscribe(`user-${user._id}`);
    channel.bind('typing-event', (data: { senderId: string, receiverId: string, isTyping: boolean }) => {
      if (data.receiverId === user._id) {
        setTyping(data.isTyping)
      }
    })
    return () => {
      channel.unbind('typing-event')
      pusherClient.unsubscribe(`user-${user._id}`)
    }
  }, [])

  const sendMessage = () => {
    setFileUrl(null);
    const formData = new FormData();
    formData.append('receiverId', id);
    formData.append('senderId', user._id);
    formData.append('text', text || '');
    formData.append('fileType', fileType || '');
    formData.append('file', selectedFile || '');
    axios.post(`/api/messages/user`, formData)
    setMessages([...messages, { senderId: user._id, receiverId: id, text, fileType: fileType || '', fileUrl: fileUrl || '', downloadUrl: "" ,createdAt: new Date().toISOString() }])
    dispatch(updateMessage({ id: id, message: text,lastMessageType : selectedFile?.type || '' ,time: new Date().toISOString(), unreadMessageCount: 0 }))
    setText("")
  }

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setFileLoading(true)
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.warning("File size is too large. Select a file smaller than 64 MB.", {
          position: "top-right",
        });
        return
      }
      setSelectedFile(file)
      setFileType(file.type)
    } catch (err) {
      console.log(err)
    } finally {
      setFileLoading(false)
    }
    const url = URL.createObjectURL(file);
    setFileUrl(url);
  };

  return (
    <div className='flex flex-col h-screen'>
      <div className='h-16 bg-gray-900' onClick={() => setDetails(true)}>
        <UserNavbar username={username} id={id} istyping={typing} />
      </div>

      <div ref={messageContainerRef} className='bg-gray-700 flex-1 overflow-y-auto scrollbar-thin'>
        <MessageBox 
          userId = {user._id} 
          userName = {user.username}
          fileLoading = {fileLoading}
          fileUrl = {fileUrl}
          fileType = {fileType}
          messages = {messages}
          messageContainerRef = {messageContainerRef}
          setFileUrl = {setFileUrl}
          setFileType = {setFileType}
          fileInputRef = {fileInputRef}
          setFileLoading = {setFileLoading}
          />
      </div>
      <div className='bg-gray-900 h-16 p-3 flex justify-around'>
        <input type="file" ref={fileInputRef} className='hidden' onChange={handleFileChange} />
        <label onClick={handleIconClick} className='cursor-pointer'>
          <Plus size={32} color='#999' />
        </label>
        <input type="text" placeholder='Type a message' value={text} className='bg-gray-800 w-4/6 h-10 outline-none border-8 rounded border-gray-800 text-white' onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null}/>
        <button className='h-10 w-10 rounded-full flex justify-center items-center bg-[#005c4b] ml-2 cursor-pointer' onClick={sendMessage}>
          <IoMdSend size={20} color='#ddd' />
        </button>
      </div>
    </div>
  )
}

export default ChatMessage;
