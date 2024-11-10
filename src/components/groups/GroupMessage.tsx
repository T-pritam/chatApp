"use client"
import React from 'react'
import GroupNavbar from './GroupNavbar';
import { useState, useEffect, useRef } from 'react';
import { IoMdSend } from "react-icons/io";
import { useSelector } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import { pusherClient } from '@/lib/pusher';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/userStore';
import { updateMessage, updateUnReadMessageCount } from '@/store/chatListSlice';
import MessageBoxGrp from './MessageBoxGrp';
import { toast } from 'sonner'
import { Plus } from 'lucide-react';
import axios from 'axios';
import '@/components/css/scrollbar.css';

interface groupType {
  _id: string,
  username: string,
}

interface friendDetails {
  id: string,
  name: string,
  members: number,
  setDetails: React.Dispatch<React.SetStateAction<boolean>>
}

export interface message {
  senderId: groupType,
  text: string,
  fileType: string,
  fileUrl: string,
  downloadUrl: string,
  createdAt: string,
}

const GroupMessage: React.FC<friendDetails> = ({ id, name, members, setDetails }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [text, setText] = useState<string>('')
  const [messages, setMessages] = useState<message[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [typing, setTyping] = useState<boolean>(false)
  const MAX_FILE_SIZE_BYTES = 64 * 1024 * 1024;

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
      const res = await axios.get(`/api/messages/group?id=${id}&senderId=${user._id}`)
      setMessages(res.data.messages)
      dispatch(updateUnReadMessageCount({ senderId: id, unreadMessageCount: 0 }))
    }
    getMessages()
    scrollToBottom()
  }, [])

  useEffect(() => {
    if (!pusherRef.current) {
      const channel = pusherClient.subscribe(`groups-last-message`)
      channel.bind('new-messages', (data: { groupId: string, senderId: string, text: string, senderUsername: string, fileType: string, fileUrl: string, downloadUrl: string }) => {
        console.log("Match Id : ", data.senderId, user._id)
        if (data.senderId === user._id) {
          return
        } else {
          setMessages((prevMessages) => [...prevMessages, { senderId: { username: data.senderUsername, _id: data.senderId }, text: data.text, createdAt: new Date().toISOString(), fileType: data.fileType || '', fileUrl: data.fileUrl || '', downloadUrl: data.downloadUrl || "" }])
          dispatch(updateMessage({ id: data.groupId, message: data.text, time: new Date().toISOString(), sender: data.senderUsername, lastMessageType: 'data.fileType' }))
          dispatch(updateUnReadMessageCount({ senderId: id, unreadMessageCount: -1 }))
        }
      })
      return () => {
        channel.unbind('new-messages')
        pusherClient.unsubscribe(`groups`)
      }
    }

  }, [dispatch])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    setFileUrl(null);
    const formData = new FormData();
    formData.append('senderId', user._id);
    formData.append('groupId', id);
    formData.append('senderUsername', user.username);
    formData.append('text', text || '');
    formData.append('fileType', fileType || '');
    formData.append('file', selectedFile || '');
    const res = await axios.post(`/api/messages/group`, formData)
    setMessages([...messages, { senderId: { _id: user._id, username: user.username }, text, fileType: fileType || '', fileUrl: res.data.fileUrl || '', downloadUrl: res.data.downloadUrl || "", createdAt: new Date().toISOString() }])
    dispatch(updateMessage({ id: id, message: text, sender: user.username, lastMessageType: fileType || '', time: new Date().toISOString() }))
    setText("")
    scrollToBottom();
    setFileUrl(null)
    setFileLoading(false)
    setSelectedFile(null)
    setFileType(null)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString); // Convert string to Date object
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

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
      console.log(file.name, file.type)
      if (file.type === "video/mp4" || file.type.includes("image") || file.type.includes("application/pdf")) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
          toast.warning("File size is too large. Select a file smaller than 64 MB.", {
            position: "top-right",
            duration: 3000
          });
          return
        }
        setSelectedFile(file)
        setFileType(file.type)
        const url = URL.createObjectURL(file);
        setFileUrl(url);
      } else {
        toast.error("Invalid file type.", {
          position: "top-right",
          duration: 3000
        })
        setSelectedFile(null)
        setFileType(null)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setFileLoading(false)
    }
  };

  return (
    <div className='flex flex-col h-screen'>

      <div className='h-16 bg-gray-900' onClick={() => setDetails(true)}>
        <GroupNavbar name={name} members={members} />
      </div>

      <div ref={messageContainerRef} className='bg-gray-700 flex-1 overflow-y-auto h-screen scrollbar-thin p-4'>
        <MessageBoxGrp
          userId={user._id}
          userName={user.username}
          fileLoading={fileLoading}
          fileUrl={fileUrl}
          fileType={fileType}
          messages={messages}
          messageContainerRef={messageContainerRef}
          setFileUrl={setFileUrl}
          setFileType={setFileType}
          fileInputRef={fileInputRef}
          setFileLoading={setFileLoading}
        />
      </div>

      <div className='bg-gray-900 h-16 p-3 flex justify-around'>
        <input type="file" ref={fileInputRef} className='hidden' onChange={handleFileChange} />
        <label onClick={handleIconClick} className='cursor-pointer'>
          <Plus size={32} color='#999' />
        </label>
        <input type="text" placeholder='Type a message' value={text} className='bg-gray-800 w-4/6 h-10 outline-none border-8 rounded border-gray-800 text-white' onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null} />
        <button className='h-10 w-10 rounded-full flex justify-center items-center bg-[#005c4b] ml-2 cursor-pointer' onClick={sendMessage}>
          <IoMdSend size={20} color='#ddd' />
        </button>
      </div>

    </div>
  )
}

export default GroupMessage