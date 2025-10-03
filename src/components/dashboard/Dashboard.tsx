"use client";

import { useState, useEffect } from "react";
import {
  AppShell,
  Burger,
  Group,
  TextInput,
  Button,
  Stack,
  Text,
  ActionIcon,
  Paper,
  Modal,
  useMantineColorScheme,
  Tooltip,
  Container,
  Skeleton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconPlus,
  IconTrash,
  IconSun,
  IconMoon,
  IconLogout,
  IconSearch,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addChatroom,
  deleteChatroom,
  setActiveChatroom,
  setChatrooms,
} from "@/store/chatSlice";
import { logout } from "@/store/authSlice";
import { storage } from "@/utils/localStorage";
import { Chatroom } from "@/types";
import { useDebounce } from "@/utils/hooks";
import ChatInterface from "@/components/chat/ChatInterface";

export default function Dashboard() {
  const [opened, { toggle }] = useDisclosure();
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [newChatroomTitle, setNewChatroomTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dispatch = useAppDispatch();
  const { chatrooms, activeChatroomId } = useAppSelector((state) => state.chat);
  // const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const savedChatrooms = storage.getChatrooms();
    if (savedChatrooms.length > 0) {
      dispatch(setChatrooms(savedChatrooms));
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    storage.setChatrooms(chatrooms);
  }, [chatrooms]);

  const handleCreateChatroom = () => {
    if (!newChatroomTitle.trim()) {
      notifications.show({
        title: "Error",
        message: "Please enter a chatroom title",
        color: "red",
      });
      return;
    }

    const newChatroom: Chatroom = {
      id: `chatroom-${Date.now()}`,
      title: newChatroomTitle,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch(addChatroom(newChatroom));
    dispatch(setActiveChatroom(newChatroom.id));
    setNewChatroomTitle("");
    setCreateModalOpened(false);

    notifications.show({
      title: "Success",
      message: `Chatroom "${newChatroomTitle.slice(0, 10)} ${
        newChatroomTitle.length > 10 ? "..." : " "
      }" created`,
      color: "green",
    });
  };

  const handleDeleteChatroom = (id: string, title: string) => {
    dispatch(deleteChatroom(id));
    notifications.show({
      title: "Deleted",
      message: `Chatroom "${title}" deleted`,
      color: "orange",
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    storage.removeAuth();
    notifications.show({
      title: "Logged out",
      message: "You have been logged out successfully",
      color: "blue",
    });
  };

  const filteredChatrooms = chatrooms.filter((room) =>
    room.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text size="xl" fw={700}>
              Gemini Clone
            </Text>
          </Group>
          <Group>
            <Tooltip
              label={colorScheme === "dark" ? "Light mode" : "Dark mode"}
            >
              <ActionIcon
                variant="default"
                onClick={() => toggleColorScheme()}
                size="lg"
              >
                {colorScheme === "dark" ? (
                  <IconSun size={18} />
                ) : (
                  <IconMoon size={18} />
                )}
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Logout">
              <ActionIcon
                variant="default"
                onClick={handleLogout}
                size="lg"
                color="red"
              >
                <IconLogout size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="md">
          <TextInput
            placeholder="Search chatrooms..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setCreateModalOpened(true)}
            fullWidth
          >
            New Chat
          </Button>

          <Stack gap="xs" style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, i) => <Skeleton key={i} height={50} radius="md" />)
            ) : filteredChatrooms.length === 0 ? (
              <Text c="dimmed" size="sm" ta="center" mt="xl">
                {searchQuery
                  ? "No chatrooms found"
                  : "No chatrooms yet. Create one to start!"}
              </Text>
            ) : (
              filteredChatrooms.map((room) => (
                <Paper
                  key={room.id}
                  p="sm"
                  withBorder
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      activeChatroomId === room.id
                        ? "var(--mantine-color-blue-light)"
                        : undefined,
                  }}
                  onClick={() => dispatch(setActiveChatroom(room.id))}
                >
                  <Group justify="space-between">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text size="sm" fw={500} truncate>
                        {room.title.slice(0, 25)}
                        {room.title.length > 25 ? "...." : " "}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {room.messages.length} messages
                      </Text>
                    </div>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChatroom(room.id, room.title);
                      }}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Paper>
              ))
            )}
          </Stack>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        {activeChatroomId ? (
          <ChatInterface />
        ) : (
          <Container size="sm" mt="xl">
            <Stack align="center" gap="md">
              <Text size="xl" fw={500} c="dimmed">
                Select a chatroom or create a new one to start chatting
              </Text>
            </Stack>
          </Container>
        )}
      </AppShell.Main>

      <Modal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
        title="Create New Chatroom"
      >
        <Stack gap="md">
          <TextInput
            label="Chatroom Title"
            placeholder="Enter chatroom title"
            value={newChatroomTitle}
            onChange={(e) => setNewChatroomTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateChatroom();
              }
            }}
          />
          <Button onClick={handleCreateChatroom} fullWidth>
            Create
          </Button>
        </Stack>
      </Modal>
    </AppShell>
  );
}
