"use client"

import React from "react";
import { createContext,useContext } from "react";
import { pusherClient } from "@/lib/pusher";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import { updateMessage } from "@/store/chatListSlice";
import { RootStateType } from "@/store/userStore";
import Pusher,{Channel} from "pusher-js";

const PusherContext = createContext<Channel | null>(null);

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
              dispatch(updateMessage({id : data.groupId,message : data.text,time:new Date().toISOString(),sender : data.senderUsername}))
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
            channel.bind('new-message', (data : {senderId : string, receiverId : string, text : string}) => {
                console.log("Pusher Pauyload data cntext : ",data)
                dispatch(updateMessage({id :data.senderId,message : data.text,time:new Date().toISOString()}))
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

export const usePusher = () => useContext(PusherContext);