"use client";

import { useState, useEffect, useRef } from "react";
import {
  Stack,
  TextInput,
  Button,
  Group,
  Paper,
  Text,
  ActionIcon,
  FileButton,
  Image,
  Loader,
  // Skeleton,
  Box,
  Tooltip,
} from "@mantine/core";
import { IconSend, IconPhoto, IconCopy } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addMessage, setIsTyping, loadMoreMessages } from "@/store/chatSlice";
import { Message } from "@/types";
import { simulateAIResponse } from "@/utils/simulateAI";
import { generateDummyMessages } from "@/utils/generateDummyMessages";

export default function ChatInterface() {
  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const dispatch = useAppDispatch();
  const { activeChatroomId, isTyping } = useAppSelector((state) => state.chat);
  const activeChatroom = useAppSelector((state) =>
    state.chat.chatrooms.find((room) => room.id === activeChatroomId)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!initialLoad && activeChatroom) {
      scrollToBottom();
    }
  }, [activeChatroom, activeChatroom?.messages, initialLoad]);

  useEffect(() => {
    if (activeChatroom) {
      setInitialLoad(false);
      setTimeout(scrollToBottom, 100);
    }
  }, [activeChatroom, activeChatroomId]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || !activeChatroomId || loadingMore || !hasMore) return;

    if (container.scrollTop === 0) {
      setLoadingMore(true);

      setTimeout(() => {
        const newMessages = generateDummyMessages(20, (page + 1) * 20);
        dispatch(
          loadMoreMessages({
            chatroomId: activeChatroomId,
            messages: newMessages,
          })
        );
        setPage(page + 1);
        setLoadingMore(false);

        if (page >= 4) {
          setHasMore(false);
        }

        const scrollHeight = container.scrollHeight;
        container.scrollTop = scrollHeight - container.clientHeight - 100;
      }, 1000);
    }
  };

  const handleImageSelect = (file: File | null) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      notifications.show({
        title: "Error",
        message: "Image size should be less than 5MB",
        color: "red",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = () => {
    if (!activeChatroomId || (!inputMessage.trim() && !selectedImage)) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      image: selectedImage || undefined,
    };

    dispatch(
      addMessage({ chatroomId: activeChatroomId, message: userMessage })
    );
    setInputMessage("");
    setSelectedImage(null);

    notifications.show({
      title: "Message sent",
      message: "Your message has been sent",
      color: "blue",
    });

    simulateAIResponse(
      () => dispatch(setIsTyping(true)),
      () => dispatch(setIsTyping(false)),
      (response) => {
        const aiMessage: Message = {
          id: `msg-${Date.now()}-ai`,
          content: response,
          sender: "ai",
          timestamp: new Date(),
        };
        dispatch(
          addMessage({ chatroomId: activeChatroomId, message: aiMessage })
        );
      },
      2500
    );
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    notifications.show({
      title: "Copied",
      message: "Message copied to clipboard",
      color: "green",
    });
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!activeChatroom) {
    return null;
  }

  return (
    <Stack gap="md" style={{ height: "calc(100vh - 100px)" }}>
      <Paper p="md" withBorder>
        <Text size="lg" fw={500}>
          {activeChatroom.title}
        </Text>
      </Paper>

      <Paper
        p="md"
        withBorder
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {loadingMore && (
          <Box ta="center" mb="md">
            <Loader size="sm" />
          </Box>
        )}

        {!hasMore && activeChatroom.messages.length > 0 && (
          <Text size="xs" c="dimmed" ta="center" mb="md">
            No more messages
          </Text>
        )}

        <Stack gap="md">
          {activeChatroom.messages.length === 0 ? (
            <Text c="dimmed" ta="center" mt="xl">
              No messages yet. Start the conversation!
            </Text>
          ) : (
            activeChatroom.messages.map((message) => (
              <Group
                key={message.id}
                justify={message.sender === "user" ? "flex-end" : "flex-start"}
                align="flex-start"
                wrap="nowrap"
              >
                <Paper
                  p="sm"
                  bg={message.sender === "user" ? "blue.1" : "gray.1"}
                  style={{
                    maxWidth: "70%",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    const copyBtn = e.currentTarget.querySelector(
                      ".copy-button"
                    ) as HTMLElement;
                    if (copyBtn && message.content)
                      copyBtn.style.display = "block";
                  }}
                  onMouseLeave={(e) => {
                    const copyBtn = e.currentTarget.querySelector(
                      ".copy-button"
                    ) as HTMLElement;
                    if (copyBtn) copyBtn.style.display = "none";
                  }}
                >
                  <Stack gap="xs">
                    {message.image && (
                      <Image
                        src={message.image}
                        alt="Uploaded"
                        radius="md"
                        style={{ maxWidth: "100%", maxHeight: 300 }}
                      />
                    )}
                    <Text size="sm" c="black">
                      {message.content}
                    </Text>
                    <Group justify="space-between" align="center">
                      <Text size="xs" c="dimmed">
                        {formatTimestamp(message.timestamp)}
                      </Text>
                      <Tooltip label="Copy message">
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          className="copy-button"
                          style={{ display: "none" }}
                          onClick={() => handleCopyMessage(message.content)}
                        >
                          <IconCopy size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Stack>
                </Paper>
              </Group>
            ))
          )}

          {isTyping && (
            <Group justify="flex-start">
              <Paper p="sm" bg="gray.1">
                <Group gap="xs">
                  <Loader size="xs" />
                  <Text size="sm" c="dimmed">
                    Gemini is typing...
                  </Text>
                </Group>
              </Paper>
            </Group>
          )}

          <div ref={messagesEndRef} />
        </Stack>
      </Paper>

      <Paper p="md" withBorder>
        <Stack gap="sm">
          {selectedImage && (
            <Group>
              <Image
                src={selectedImage}
                alt="Selected"
                radius="md"
                style={{ maxWidth: 100, maxHeight: 100 }}
              />
              <Button
                variant="subtle"
                color="red"
                size="xs"
                onClick={() => setSelectedImage(null)}
              >
                Remove
              </Button>
            </Group>
          )}

          <Group align="flex-end" wrap="nowrap">
            <FileButton onChange={handleImageSelect} accept="image/*">
              {(props) => (
                <Tooltip label="Upload image">
                  <ActionIcon {...props} size="lg" variant="default">
                    <IconPhoto size={20} />
                  </ActionIcon>
                </Tooltip>
              )}
            </FileButton>

            <TextInput
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              style={{ flex: 1 }}
            />

            <Button
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && !selectedImage) || isTyping}
              leftSection={<IconSend size={16} />}
            >
              Send
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}
