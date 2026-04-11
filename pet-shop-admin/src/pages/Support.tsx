import { useState, useEffect, useRef } from "react";
import { MessageCircleQuestion } from "lucide-react";
import { api } from "../api/api";
import { Alert, Snackbar } from "@mui/material";

interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  senderId: string;
}

interface Chat {
  id: string;
  userId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  isResolved: boolean;
  updatedAt: string;
  messages: Message[];
}

const SupportAdminPanel = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await api.get("/admin/support/chats", {
          withCredentials: true,
        });
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setNotification({
          open: true,
          message: "Failed to fetch support chats.",
          severity: "error",
        });
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat?.messages?.length) {
      scrollToBottom();
    }
  }, [selectedChat?.messages]);

  const handleSelectChat = async (chat: Chat) => {
    if (selectedChat?.id === chat.id) return;

    setSelectedChat({ ...chat, messages: [] });
    setIsLoadingMessages(true);

    try {
      const [messagesResponse] = await Promise.all([
        api.get(`/admin/support/chats/${chat.id}/messages`, {
          withCredentials: true,
        }),
        api.patch(
          `/admin/support/chats/${chat.id}/read`,
          {},
          {
            withCredentials: true,
          }
        ),
      ]);

      const fetchedMessages: Message[] = messagesResponse.data;

      setSelectedChat((prev) =>
        prev && prev.id === chat.id
          ? {
              ...chat,
              messages: fetchedMessages,
              updatedAt: chat.updatedAt,
              user: chat.user,
              isResolved: chat.isResolved,
            }
          : prev
      );

      setChats((prevChats) =>
        prevChats.map((c) => {
          if (c.id === chat.id) {
            const updatedMessages = c.messages.map((m) =>
              m.senderId === c.userId ? { ...m, isRead: true } : m
            );
            return { ...c, messages: updatedMessages };
          }
          return c;
        })
      );
    } catch (error) {
      console.error("Error selecting chat or fetching messages:", error);
      setNotification({
        open: true,
        message: "Failed to load chat messages.",
        severity: "error",
      });
      setSelectedChat(null);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedChat || !newMessage.trim()) return;

    try {
      const response = await api.post(
        `/admin/support/chats/${selectedChat.id}/messages`,
        {
          content: newMessage,
        },
        {
          withCredentials: true,
        }
      );

      const newAdminMessage: Message = response.data;

      setSelectedChat((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, newAdminMessage],
              updatedAt: newAdminMessage.createdAt,
            }
          : null
      );

      setChats(
        (prevChats) =>
          prevChats
            .map((chat) =>
              chat.id === selectedChat.id
                ? {
                    ...chat,
                    messages: [newAdminMessage],
                    updatedAt: newAdminMessage.createdAt, // Use server timestamp
                  }
                : chat
            )
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            ) // Keep list sorted
      );

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setNotification({
        open: true,
        message: "Failed to send message. Please try again.",
        severity: "error",
      });
    }
  };

  const handleResolveChat = async (chatId: string) => {
    try {
      await api.patch(
        `/admin/support/chats/${chatId}/resolve`,
        {},
        {
          withCredentials: true,
        }
      );
      const updatedChats = chats.map((chat) =>
        chat.id === chatId ? { ...chat, isResolved: true } : chat
      );
      setChats(updatedChats);

      if (selectedChat?.id === chatId) {
        setSelectedChat((prev) =>
          prev ? { ...prev, isResolved: true } : null
        );
      }
      setNotification({
        open: true,
        message: "Conversation marked as resolved!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error resolving chat:", error);
      setNotification({
        open: true,
        message: "Failed to resolve conversation. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <div className="p-6 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Support Messages</h1>

      <div className="flex gap-6 flex-1 overflow-hidden">
        <div className="w-1/3 border-r pr-6 overflow-y-auto">
          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`p-4 rounded-lg cursor-pointer ${
                  selectedChat?.id === chat.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                } ${
                  chat.messages.length > 0 &&
                  chat.messages[chat.messages.length - 1] &&
                  !chat.messages[chat.messages.length - 1].isRead &&
                  chat.messages[chat.messages.length - 1].senderId ===
                    chat.userId
                    ? "border-l-4 border-l-blue-500 font-semibold"
                    : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{chat.user.fullName}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {chat.messages[chat.messages.length - 1]?.content}
                </p>
                {chat.isResolved && (
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Resolved
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-4 border-b">
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedChat.user.fullName}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedChat.user.email}
                </p>
              </div>
              {!selectedChat.isResolved && (
                <button
                  onClick={() => handleResolveChat(selectedChat.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Mark as Resolved
                </button>
              )}
            </div>

            {isLoadingMessages ? (
              <div className="flex-1 flex items-center justify-center">
                <p>Loading messages...</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {selectedChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === selectedChat.userId
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-md md:max-w-lg lg:max-w-xl rounded-lg px-4 py-2 ${
                        message.senderId === selectedChat.userId
                          ? "bg-gray-200 text-gray-800"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <p className="text-xs mt-1 opacity-70 text-right">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {!selectedChat.isResolved && (
              <div className="mt-auto pt-4 border-t">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your response..."
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  disabled={isLoadingMessages}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isLoadingMessages}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                >
                  Send Message
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircleQuestion
                size={48}
                className="mx-auto text-gray-400 mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900">
                Select a chat
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the list to view messages
              </p>
            </div>
          </div>
        )}
      </div>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SupportAdminPanel;
