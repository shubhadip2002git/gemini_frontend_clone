import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import chatReducer from "./chatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "chat/addMessage",
          "chat/addChatroom",
          "chat/setChatrooms",
          "chat/loadMoreMessages",
        ],
        ignoredPaths: [
          "chat.chatrooms",
          "payload.timestamp",
          "payload.createdAt",
          "payload.updatedAt",
          "payload.message.timestamp",
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
