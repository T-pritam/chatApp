"use client"
import React from 'react'
import { LoaderCircle } from 'lucide-react';
import { X } from 'lucide-react';
import { CldImage , getCldVideoUrl, getCldImageUrl } from 'next-cloudinary';
import { message } from './ChatMessage'
import { useEffect,useCallback,useState } from 'react';
import formatDateString from '@/lib/formatDate';
import { pusherClient } from '@/lib/pusher';
import 'next-cloudinary/dist/cld-video-player.css';
import { IoArrowDown } from "react-icons/io5";
import { ArrowDownToLine } from 'lucide-react';
import { User } from 'lucide-react';

function MessageBox(props : {
    fileLoading: boolean,
    userName : string,
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
    const [isMediaOpen, setIsMediaOpen] = useState<Boolean>(false);
    const [mediaData, setMediaData] = useState<message | null>(null);
    const fetchVideoUrl = useCallback((publicId: string) => {
      return getCldVideoUrl({
        src: publicId,
        width: 150,
        height: 150,
      })
    },[])
    
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

  // useEffect(() => {
  //   scrollToBottom();
  // }, [props.messages]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const getImg = (publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 1920,
      height: 1080,
    });
  };

    const isSameDay = (date1: string, date2: string) => {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      return d1.toDateString() === d2.toDateString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const downloadFile = (assetId: string) => {
      const fullUrl = `https://res-console.cloudinary.com/dh6nxoqzm/media_explorer_thumbnails/${assetId}/download`;
      const link = document.createElement("a");
      link.href = fullUrl;
      link.target = "_blank"; // Optional: opens in a new tab if needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

  return (
    
    <div className=''>
      {
        isMediaOpen && (
          <div
          className="w-screen h-screen fixed inset-0 bg-gray-800 z-50 p-6"
          onClick= { () => setIsMediaOpen(false)}>
          <div className='flex justify-between' onClick={(e) => e.stopPropagation()}>
            <div className='flex gap-3'>
              <User size={44} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer inline-block'/>
              <div className=''>
                <p className='text-[#ddd] '>{props.userName}</p>
                <p className='text-[#ddd] text-sm'>{new Date(mediaData?.createdAt as string).toLocaleDateString()} at {formatTime(mediaData?.createdAt as string)}</p>
              </div>
            </div>
            <div className='flex gap-4'>
              <ArrowDownToLine size={28}  color='#bbb' className='text-white inline-block cursor-pointer' onClick={() => downloadFile(mediaData?.downloadUrl as string)} />
              <X  color='#bbb' size={28}  className='text-white inline-block cursor-pointer' onClick={() => setIsMediaOpen(false)}/>
            </div>

          </div>
          <div className='flex justify-center align-center mt-10'>
          {
            mediaData?.fileType?.startsWith("image/") 
              ? <img src={getImg(mediaData?.fileUrl as string)} className='w-full h-[75vh] object-contain' alt="Selected File" />
              : <video className='w-full h-[75vh] object-contain' src={fetchVideoUrl(mediaData?.fileUrl as string)} controls />
          }
          </div>
        </div>
      )}
        {props.fileLoading ? (
        <div className="">
          <LoaderCircle size={48} className="animate-spin text-gray-400" />
        </div>
      ) : props.fileUrl ? (
        <div className="flex-1 flex items-center justify-center mt-16">
          <X className="text-[#ccc] cursor-pointer absolute top-20 left-4" onClick={clearFile} aria-hidden="true" />
          <div className="flex items-center justify-center">
            {props.fileType?.startsWith("image/") && (
              <img src={props.fileUrl} alt="Selected File" className="max-w-60" />
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
          {props.messages.map((message, index) => {
            const showDate = index === 0 || !isSameDay(props.messages[index - 1].createdAt, message.createdAt);
            return (
              <React.Fragment key={index}>
                {showDate && (
                    <div className="text-center sticky my-auto p-8 ">
                        <p className="text-sm text-gray-400 absolute right-[40%] bottom-3 px-3 py-2 bg-gray-800 rounded">{formatDateString(message.createdAt).includes(":") ? "Today" : formatDate(message.createdAt)}</p>
                    </div>
                )}
            {message.fileType == "" || message.fileType == null ? (
            <div key={index} className={`flex ${message.senderId === props.userId ? 'justify-end' : 'justify-start'}`}>
              <div className={`inline-block max-w-md break-words bg-opacity-80 px-2 py-1 mb-1 rounded text-white ${message.senderId === props.userId ? 'bg-[#005c4b]' : 'bg-gray-500'}`}>
                <p className='leading-5 text-base'>{message.text}</p>
                <p className='flex justify-end text-xs float-right text-[#ddd] mt-0'>{formatTime(message.createdAt)}</p>
              </div>
            </div> ):(
              message.fileType.startsWith("image/") ? (
                <div key={index} className={`flex ${message.senderId === props.userId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-1 rounded mb-1 max-w-sm break-words ${message.senderId === props.userId ? 'bg-[#005c4b]' : 'bg-gray-500'}`}>
                    <div className='relative'>
                    <CldImage src={message.fileUrl} width={250} height={400} className='cursor-pointer rounded' alt="Selected File" onClick={() => {
                      setIsMediaOpen(true)
                      setMediaData(message)
                    }}/>
                        <p className='text-[#ddd] text-xs absolute bottom-1 right-1'>{formatTime(message.createdAt)}</p>                  
                    </div>
                     <p className=' text-[#ddd] w-[250px]'>{message.text}</p>
                  </div>
                </div>
              ) : message.fileType.startsWith("video/") ? (
                <div key={index} className={`flex ${message.senderId === props.userId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-1 rounded mb-1 ${message.senderId === props.userId ? 'bg-[#005c4b]' : 'bg-gray-500'}`}>
                  <div className='relative'>
                    <video src={fetchVideoUrl(message.fileUrl)} controls className='max-w-xs cursor-pointer' onClick={() => {
                      setIsMediaOpen(true)
                      setMediaData(message)
                    }}/>
                    <p className='text-[#ddd] text-xs absolute bottom-1 right-1'>{formatTime(message.createdAt)}</p>                  
                      </div>
                  </div>
                </div>
              ) : message.fileType.startsWith("application/pdf") ? (
                <div key={index} className={`flex ${message.senderId === props.userId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-1 rounded mb-1 ${message.senderId === props.userId ? 'bg-[#005c4b]' : 'bg-gray-500'}`}>
                    {/* <h2>{message.fileUrl}</h2> */}
                    <div className='h-32 overflow-hidden'>
                    <img src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/v1/${message.fileUrl}`}
                      className='max-w-xs rounded' alt="" />
                    </div>
                    
                      <div className={`h-16 rounded flex justify-between mx-auto p-3 ${message.senderId === props.userId ? 'bg-[#125347]' : 'bg-[#3b3f3f47]'}`}>
                        <div>
                          <p className='text-[#ddd] text-md truncate w-64'>{message.fileUrl.replace("chat_files/", "")}.pdf</p>
                          <p className='text-[#bbb] text-xs'>PDF</p>
                        </div>
                        <div className='flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full'>
                          <IoArrowDown className='text-[#666] cursor-pointer' size={'2.1vw'} onClick={() => downloadFile(message.downloadUrl)} />
                        </div>
                      </div>
                      <div className={`flex ${message.senderId === props.userId ? 'justify-end' : 'justify-start'}`}>
                        <p className='text-[#bbb] text-xs'>{formatTime(message.createdAt)}</p>
                      </div>
                  </div>
                </div>
              ) : (
                <div key={index} className={`flex ${message.senderId === props.userId ? 'justify-end' : 'justify-start'}`}>
                </div>
              )
            )
            }
              </React.Fragment>
            )
          }
          )}
        </div>
      )}
    </div>
  )
}

export default MessageBox