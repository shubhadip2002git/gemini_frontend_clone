export interface User {
  id: string;
  phoneNumber: string;
  countryCode: string;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  image?: string;
}

export interface Chatroom {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Country {
  name: {
    common: string;
  };
  cca2: string;
  idd: {
    root: string;
    suffixes?: string[];
  };
  flags: {
    svg: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface ChatState {
  chatrooms: Chatroom[];
  activeChatroomId: string | null;
  isTyping: boolean;
}
