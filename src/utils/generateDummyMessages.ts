import { Message } from "@/types";

const DUMMY_USER_MESSAGES = [
  "Hello, how are you?",
  "Can you help me with this?",
  "What do you think about that?",
  "Tell me more about this topic",
  "That's interesting!",
  "I have a question",
  "Could you explain that better?",
  "Thanks for your help",
];

const DUMMY_AI_MESSAGES = [
  "Hello! I'm doing well, thank you for asking. How can I assist you today?",
  "Of course! I'd be happy to help. What specifically would you like to know?",
  "That's an excellent question. Let me share my thoughts on this...",
  "I'd be glad to elaborate. Here's what you should know...",
  "I'm pleased you find this engaging! Let's explore it further.",
  "Feel free to ask anything. I'm here to help you.",
  "Let me break that down for you in simpler terms...",
  "You're welcome! Is there anything else you'd like to know?",
];

export const generateDummyMessages = (
  count: number,
  startId: number = 0
): Message[] => {
  const messages: Message[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const isUser = i % 2 === 0;
    const messageList = isUser ? DUMMY_USER_MESSAGES : DUMMY_AI_MESSAGES;
    const content = messageList[Math.floor(Math.random() * messageList.length)];

    messages.push({
      id: `msg-${startId + i}`,
      content,
      sender: isUser ? "user" : "ai",
      timestamp: new Date(now.getTime() - (count - i) * 60000),
    });
  }

  return messages;
};
