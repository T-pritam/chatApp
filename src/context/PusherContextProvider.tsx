"use client"

import React from "react";
import { createContext,useContext } from "react";
import { pusherClient } from "@/lib/pusher";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import { updateMessage,updateUnReadMessageCount } from "@/store/chatListSlice";
import { RootStateType } from "@/store/userStore";
import Pusher from "pusher-js";

const PusherContext = createContext<Pusher | null>(null);

export function PusherContextProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch()
    const users = useSelector((state:RootStateType) => state.user)
    const pusherRef = React.useRef<any>(null);

    useEffect(() => {
        console.log("Pusher Running Useeffect in context")
        if (!pusherRef.current){
          const channel = pusherClient.subscribe(`groups`)
          channel.bind('new-messages', (data : {groupId : string,senderId : string, text : string,senderUsername: string}) => {
            if (data.senderId == users._id) {
                return
              } else {
                console.log("Pusher Pauyload data cntext : ",data)
                console.log("Pusher Pauyload data cntext : ",data.groupId)
              dispatch(updateMessage({id : data.groupId,message : data.text,time:new Date().toISOString(),sender : data.senderUsername,lastMessageType: 'data.fileType'}))
          }})
          return () => {
            channel.unbind('new-messages')
            pusherClient.unsubscribe(`groups`)
          }
        }
        
      },[dispatch])

      useEffect(() => {
        if (!pusherRef.current){
            const channel = pusherClient.subscribe(`user`)
            channel.bind('new-message', (data : {senderId : string, receiverId : string, text : string,filetype: string}) => {
                console.log("Pusher Pauyload data context User: ",data)
                dispatch(updateMessage({id :data.senderId,message : data.text,time:new Date().toISOString(),lastMessageType: data.filetype}))
                dispatch(updateUnReadMessageCount({senderId : data.senderId,unreadMessageCount : 1}))
          })
            return () => {
              channel.unbind('new-message')
              pusherClient.unsubscribe(`user`)
            }
          }
      }, [dispatch]);

    return <PusherContext.Provider value={null}>
        {children}
    </PusherContext.Provider>
}

export const usePusher = () => {
    const context = useContext(PusherContext);
    if (!context) {
      throw new Error("usePusher must be used within a PusherContextProvider");
    }
    return context;
}