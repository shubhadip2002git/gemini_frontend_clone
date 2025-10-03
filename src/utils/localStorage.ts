import { User } from "@/types";
import { Chatroom, Message } from "@/types";

const AUTH_KEY = "gemini_auth";
const CHATROOMS_KEY = "gemini_chatrooms";

export const storage = {
  getAuth: (): User | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },

  setAuth: (user: User): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },

  removeAuth: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_KEY);
  },

  getChatrooms: (): Chatroom[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(CHATROOMS_KEY);
    if (!data) return [];

    const chatrooms = JSON.parse(data);
    return chatrooms.map((room: Chatroom) => ({
      ...room,
      createdAt: new Date(room.createdAt),
      updatedAt: new Date(room.updatedAt),
      messages: room.messages.map((msg: Message) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  },

  setChatrooms: (chatrooms: Chatroom[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CHATROOMS_KEY, JSON.stringify(chatrooms));
  },
};
