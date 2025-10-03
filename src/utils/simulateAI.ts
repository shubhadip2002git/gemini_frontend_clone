const AI_RESPONSES = [
  "That's an interesting question! Let me think about that...",
  "I understand what you're asking. Here's what I think...",
  "Great point! Based on my understanding...",
  "Let me help you with that. From what I can see...",
  "That's a thoughtful query. In my analysis...",
  "I appreciate your question. Here's my perspective...",
  "Excellent question! Let me break this down...",
  "I see where you're coming from. To address that...",
  "That's worth exploring. Consider this...",
  "Interesting approach! Here's how I'd think about it...",
];

export const generateAIResponse = (): string => {
  const randomIndex = Math.floor(Math.random() * AI_RESPONSES.length);
  return AI_RESPONSES[randomIndex];
};

export const simulateAIResponse = (
  onTypingStart: () => void,
  onTypingEnd: () => void,
  onResponse: (message: string) => void,
  throttleMs: number = 2000
): void => {
  onTypingStart();

  setTimeout(() => {
    onTypingEnd();
    const response = generateAIResponse();
    onResponse(response);
  }, throttleMs);
};
