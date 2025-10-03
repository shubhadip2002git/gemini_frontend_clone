import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatState, Chatroom, Message } from "@/types";

const initialState: ChatState = {
  chatrooms: [],
  activeChatroomId: null,
  isTyping: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatrooms: (state, action: PayloadAction<Chatroom[]>) => {
      state.chatrooms = action.payload;
    },
    addChatroom: (state, action: PayloadAction<Chatroom>) => {
      state.chatrooms.unshift(action.payload);
    },
    deleteChatroom: (state, action: PayloadAction<string>) => {
      state.chatrooms = state.chatrooms.filter(
        (room) => room.id !== action.payload
      );
      if (state.activeChatroomId === action.payload) {
        state.activeChatroomId = null;
      }
    },
    setActiveChatroom: (state, action: PayloadAction<string>) => {
      state.activeChatroomId = action.payload;
    },
    addMessage: (
      state,
      action: PayloadAction<{ chatroomId: string; message: Message }>
    ) => {
      const chatroom = state.chatrooms.find(
        (room) => room.id === action.payload.chatroomId
      );
      if (chatroom) {
        chatroom.messages.push(action.payload.message);
        chatroom.updatedAt = new Date();
      }
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    loadMoreMessages: (
      state,
      action: PayloadAction<{ chatroomId: string; messages: Message[] }>
    ) => {
      const chatroom = state.chatrooms.find(
        (room) => room.id === action.payload.chatroomId
      );
      if (chatroom) {
        chatroom.messages = [...action.payload.messages, ...chatroom.messages];
      }
    },
  },
});

export const {
  setChatrooms,
  addChatroom,
  deleteChatroom,
  setActiveChatroom,
  addMessage,
  setIsTyping,
  loadMoreMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
