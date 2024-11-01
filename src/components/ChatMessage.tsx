"use client";
import React from 'react'
import UserNavbar from './UserNavbar'
import { useState, useEffect, useRef } from 'react';
import { IoMdSend } from "react-icons/io";
import { compressAndValidateFile } from '@/lib/fileCompression';
import { useSelector } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import { pusherClient } from '@/lib/pusher';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/userStore';
import { updateMessage } from '@/store/chatListSlice';
import { LoaderCircle } from 'lucide-react';
import { Plus } from 'lucide-react';
import { X } from 'lucide-react';
import { toast } from 'sonner'
import { CldImage } from 'next-cloudinary';
import axios from 'axios';
import '@/components/css/scrollbar.css';
import { set } from 'mongoose';

interface friendDetails {
  id: string,
  username: string,
  about: string,
  email: string,
  setDetails: React.Dispatch<React.SetStateAction<boolean>>
}

interface message {
  senderId: string,
  receiverId: string,
  text: string,
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
    }
    getMessages()
    scrollToBottom()
  }, [])

  useEffect(() => {
    if (!pusherRef.current) {
      const channel = pusherClient.subscribe(`user-last-message`)
      channel.bind('new-message', (data: { senderId: string, receiverId: string, text: string }) => {
        if (data.senderId === user._id) {
          return
        } else {
          setMessages((prev) => [...prev, { senderId: data.senderId, receiverId: data.receiverId, text: data.text, createdAt: new Date().toISOString() }]);
          dispatch(updateMessage({ id: data.senderId, message: data.text, time: new Date().toISOString() }))
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
    console.log("Before Post : ",selectedFile)
    axios.post(`/api/messages/user`, formData)
    setMessages([...messages, { senderId: user._id, receiverId: id, text, createdAt: new Date().toISOString() }])
    dispatch(updateMessage({ id: id, message: text, time: new Date().toISOString() }))
    setText("")
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    await axios.post(`/api/typing`, {
      senderId: user._id,
      receiverId: id,
      isTyping: e.target.value !== ""
    })
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
      // const compressedFile = await compressAndValidateFile(file)
      // setSelectedFile(compressedFile as File)
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

  const clearFile = () => {
    setFileUrl(null);
    setFileType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className='flex flex-col h-screen'>
      <div className='h-16 bg-gray-900' onClick={() => setDetails(true)}>
        <UserNavbar username={username} id={id} istyping={typing} />
      </div>

      {fileLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoaderCircle size={48} className="animate-spin text-gray-400" />
        </div>
      ) : fileUrl ? (
        <div className="flex-1 h-screen flex items-center justify-center relative">
          <X className="text-[#ccc] cursor-pointer absolute top-4 left-4" onClick={clearFile} aria-hidden="true" />
          <div className="flex items-center justify-center h-fit">
            {fileType?.startsWith("image/") && (
              <img src={fileUrl} alt="Selected File" className="max-w-xs" />
            )}
            {fileType?.startsWith("video/") && (
              <video controls className="overflow-hidden max-w-60" src={fileUrl} />
            )}
            {fileType?.startsWith("application/") && (
              <iframe src={fileUrl} className="h-[40vh] overflow-hidden border-none" />
            )}
          </div>
        </div>
      ) : (
        <div ref={messageContainerRef} className='bg-gray-700 flex-1 overflow-y-auto h-screen scrollbar-thin p-4'>
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}>
              <div className={`inline-block max-w-md break-words bg-opacity-80 px-2 py-1 mb-1 rounded text-white ${message.senderId === user._id ? 'bg-[#005c4b]' : 'bg-gray-500'}`}>
                <p className='leading-5 text-base'>{message.text}</p>
                <p className='flex justify-end text-xs float-right text-[#ddd] mt-0'>{formatTime(message.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className='bg-gray-900 h-16 p-3 flex justify-around'>
        <input type="file" ref={fileInputRef} className='hidden' onChange={handleFileChange} />
        <label onClick={handleIconClick} className='cursor-pointer'>
          <Plus size={32} color='#999' />
        </label>
        <input type="text" placeholder='Type a message' value={text} className='bg-gray-800 w-4/6 h-10 outline-none border-0 px-4 text-gray-300 rounded-md' onChange={handleInput} />
        <button className='h-10 w-10 rounded-full flex justify-center items-center bg-[#005c4b] ml-2 cursor-pointer' onClick={sendMessage}>
          <IoMdSend size={20} color='#ddd' />
        </button>
      </div>
    </div>
  )
}

export default ChatMessage;
