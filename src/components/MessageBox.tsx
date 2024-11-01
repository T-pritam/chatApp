"use client"
import React from 'react'
import { LoaderCircle } from 'lucide-react';
import { X } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { message } from './ChatMessage'
import { useEffect } from 'react';
import { pusherClient } from '@/lib/pusher';
import { CldVideoPlayer } from 'next-cloudinary';

function MessageBox(props : {
    fileLoading: boolean,
    fileUrl: string | null,
    userId : string,
    setFileUrl: React.Dispatch<React.SetStateAction<string | null>>,
    setFileType: React.Dispatch<React.SetStateAction<string | null>>,
    setFileLoading: React.Dispatch<React.SetStateAction<boolean>>,
    fileInputRef: React.MutableRefObject<HTMLInputElement | null>,
    fileType: string | null,
    messageContainerRef: React.MutableRefObject<HTMLDivElement | null>,
    messages: message[],
 }) {

    // const scrollToBottom = () => {
    //     if (props.messageContainerRef.current) {
    //       props.messageContainerRef.current.scrollTop = props.messageContainerRef.current.scrollHeight;
    //     }
    //   };
    
    useEffect(() => {
        const channel = pusherClient.subscribe(`user-last-message`);
        channel.bind('new-message', (data: { senderId: string, receiverId: string, text: string, fileType: string,fileUrl: string }) =>{
            console.log("Data : ",data)
        })
    },[])

  const clearFile = () => {
    props.setFileUrl(null);
    props.setFileType(null);
    if (props.fileInputRef.current) {
      props.fileInputRef.current.value = "";
    }
  };

//   useEffect(() => {
//     scrollToBottom();
//   }, [props.messages]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div>
        {props.fileLoading ? (
        <div className="">
          <LoaderCircle size={48} className="animate-spin text-gray-400" />
        </div>
      ) : props.fileUrl ? (
        <div className="flex-1 h-screen flex items-center justify-center relative">
          <X className="text-[#ccc] cursor-pointer absolute top-4 left-4" onClick={clearFile} aria-hidden="true" />
          <div className="flex items-center justify-center h-fit">
            {props.fileType?.startsWith("image/") && (
              <img src={props.fileUrl} alt="Selected File" className="max-w-xs" />
            )}
            {props.fileType?.startsWith("video/") && (
              <video controls className="overflow-hidden max-w-60" src={props.fileUrl} />
            )}
            {props.fileType?.startsWith("application/") && (
              <iframe src={props.fileUrl} className="h-[40vh] overflow-hidden border-none" />
            )}
          </div>
        </div>
      ) : (
        <div ref={props.messageContainerRef} className='bg-gray-700 h-screen p-4 '>
          {props.messages.map((message, index) => (
            message.fileType == "" || message.fileType == null ? (
              <div key={index} className={`flex ${message.senderId === props.userId ? 'justify-end' : 'justify-start'}`}>
              <div className={`inline-block max-w-md break-words bg-opacity-80 px-2 py-1 mb-1 rounded text-white ${message.senderId === props.userId ? 'bg-[#005c4b]' : 'bg-gray-500'}`}>
                <p className='leading-5 text-base'>{message.text}</p>
                <p className='flex justify-end text-xs float-right text-[#ddd] mt-0'>{formatTime(message.createdAt)}</p>
              </div>
            </div> ):(
              message.fileType.startsWith("image/") ? (
                <div key={index} className={`flex ${message.senderId === props.userId ? 'justify-end' : 'justify-start'}`}>
                  <CldImage src={message.fileUrl} width={200} height={200} alt="Selected File" />
                </div>
              ) : message.fileType.startsWith("video/") ? (
                <div key={index} className={`flex ${message.senderId === props.userId ? 'justify-end' : 'justify-start'}`}>
                  <CldVideoPlayer src={message.fileUrl} width={200} height={200} />
                </div>
              ) : (
                <div key={index} className={`flex ${message.senderId === props.userId ? 'justify-end' : 'justify-start'}`}>
                </div>
              )
            )
            )
          )}
        </div>
      )}

    </div>
  )
}

export default MessageBox