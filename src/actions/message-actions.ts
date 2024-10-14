"use server"

import { pusherServer } from "@/lib/pusher"

export const sendMessage = async(message : string) => {
    try {
        pusherServer.trigger("chatapp","upcommingMsg",{
            message
        })
    } catch (error) {
        throw new Error("Failed to send message")
    }
}