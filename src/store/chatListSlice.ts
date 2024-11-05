import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootStateType } from './userStore';
import axios from 'axios';
import { string } from 'zod';

interface FriendChat {
  friendId: {
    _id: string;
    username: string;
  };
  lastMessageType: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadMessageCount: number;
}

interface GroupChat {
  groupId: {
    _id: string;
    name: string;
  };
  lastMessageType: string | null;
  lastMessageSender: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadMessageCount: number;
}

interface ChatListState {
  status: boolean;
  message: string;
  data: (FriendChat | GroupChat)[];
}

const initialState: ChatListState = {
  status: false,
  message: '',
  data: []
};

export const fetchChatListById = createAsyncThunk<Partial<ChatListState>,string>(
  'chatList/fetchChatListById',
  async (id) => {
    console.log("id : ",id)
    const response = await axios.get(`/api/chatList?id=${id}` );
    console.log(response.data);
    return response.data;
  }
);

const chatListSlice = createSlice({
  name: 'chatList',
  initialState,
  reducers: {
    updateMessage(state, action: PayloadAction<{ id: string; message: string; time: string , sender?: string, lastMessageType: string,unreadMessageCount:number}>) {
        console.log("payload : ",action.payload)
        const chat = state.data.find((item) =>
          'friendId' in item ? item.friendId._id === action.payload.id : item.groupId._id === action.payload.id
        );
  
        if (chat) {
          chat.lastMessageType = action.payload.lastMessageType;
          chat.lastMessage = action.payload.message;
          chat.lastMessageTime = action.payload.time;

          if ('groupId' in chat && action.payload.sender) {
            chat.lastMessageSender = action.payload.sender;
          }
          
          state.data.sort((a, b) => {
            const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
            const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
            return timeB - timeA; // Sort in descending order
          });

        }
        
      },
      updateUnReadMessageCount(state, action: PayloadAction<{ senderId: string; unreadMessageCount: number }>) {
        console.log("payload : ",action.payload)
        console.log("Data : ",state.data)
        const chat = state.data.find((item) =>
          'friendId' in item ? item.friendId._id === action.payload.senderId : item.groupId._id === action.payload.senderId
        );
        console.log("chat : ",chat)
        if (chat) {
          if (action.payload.unreadMessageCount === 0) {
            chat.unreadMessageCount = 0;
          } else {
            chat.unreadMessageCount += action.payload.unreadMessageCount;
          }
        }
      }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChatListById.fulfilled, (state, action) => {
      // Update only the data returned by the API call
      if (action.payload.status !== undefined) state.status = action.payload.status;
      if (action.payload.message) state.message = action.payload.message;
      if (action.payload.data) state.data = action.payload.data;
    });
  }
});

export const { updateMessage,updateUnReadMessageCount } = chatListSlice.actions;
export default chatListSlice.reducer;