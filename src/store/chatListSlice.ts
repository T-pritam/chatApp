import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootStateType } from './userStore';
import axios from 'axios';
import { string } from 'zod';

interface FriendChat {
  friendId: {
    _id: string;
    username: string;
  };
  lastMessage: string | null;
  lastMessageTime: string | null;
}

interface GroupChat {
  groupId: {
    _id: string;
    name: string;
  };
  lastMessageSender: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
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
    updateMessage(state, action: PayloadAction<{ id: string; message: string; time: string , sender?: string}>) {
        console.log("payload : ",action.payload)
        const chat = state.data.find((item) =>
          'friendId' in item ? item.friendId._id === action.payload.id : item.groupId._id === action.payload.id
        );
  
        if (chat) {
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

export const { updateMessage } = chatListSlice.actions;
export default chatListSlice.reducer;