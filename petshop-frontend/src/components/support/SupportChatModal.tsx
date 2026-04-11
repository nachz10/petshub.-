import { useState, useEffect, useRef } from "react";
import { X, Send, MessageSquareText, UserCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  senderType?: "user" | "support";
}

interface SupportChatModalProps {
  onClose: () => void;
}

const SupportChatModal = ({ onClose }: SupportChatModalProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/support/messages",
          { withCredentials: true }
        );
        const processedMessages = response.data.map((msg: Message) => ({
          ...msg,
          senderType: msg.senderId === user?.id ? "user" : "support",
        }));
        setMessages(processedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([
          {
            id: "1",
            content: "Hello! How can I help you today?",
            senderId: "support-admin",
            senderType: "support",
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            content: "I am having an issue with my account.",
            senderId: user?.id || "mock-user-id",
            senderType: "user",
            createdAt: new Date(Date.now() - 60000).toISOString(),
          },
          {
            id: "3",
            content: "Could you please describe the issue in more detail?",
            senderId: "support-admin",
            senderType: "support",
            createdAt: new Date(Date.now() - 30000).toISOString(),
          },
        ]);
      }
    };

    if (user) {
      // Only fetch if user is available
      fetchMessages();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const tempId = Date.now().toString();
    const sentMessage: Message = {
      id: tempId,
      content: newMessage,
      senderId: user.id,
      senderType: "user",
      createdAt: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, sentMessage]);
    setNewMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/support/messages",
        { content: newMessage },
        { withCredentials: true }
      );
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === tempId ? { ...response.data, senderType: "user" } : msg
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== tempId)
      );
      alert("Failed to send message. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSenderAvatar = (
    senderType?: "user" | "support",
    senderId?: string
  ) => {
    if (senderType === "user") {
      return <UserCircle size={28} className="text-sky-500" />;
    }
    return <MessageSquareText size={28} className="text-emerald-500" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-2xl w-full max-w-lg h-[90vh] md:h-[85vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <MessageSquareText size={28} className="text-sky-600" />
            <h3 className="text-xl font-semibold text-slate-800">
              Support Chat
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-200 transition-colors"
            aria-label="Close chat"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 scroll-smooth">
          {messages.map((message, index) => {
            const isUser = message.senderType === "user";
            const prevMessage = messages[index - 1];
            const showAvatar =
              !prevMessage ||
              prevMessage.senderId !== message.senderId ||
              new Date(message.createdAt).getTime() -
                new Date(prevMessage.createdAt).getTime() >
                5 * 60 * 1000;

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && showAvatar && (
                  <div className="flex-shrink-0 self-start p-1 bg-white rounded-full shadow-sm border border-slate-200">
                    {getSenderAvatar(message.senderType, message.senderId)}
                  </div>
                )}
                <div
                  className={`max-w-[70%] md:max-w-[65%] p-3 rounded-2xl shadow-md ${
                    isUser
                      ? "bg-sky-500 text-white rounded-br-none"
                      : "bg-white text-slate-700 border border-slate-200 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1.5 text-right ${
                      isUser ? "text-sky-100 opacity-90" : "text-slate-400"
                    }`}
                  >
                    {formatDate(message.createdAt)}
                  </p>
                </div>
                {isUser && showAvatar && (
                  <div className="flex-shrink-0 self-start p-1 bg-white rounded-full shadow-sm border border-slate-200">
                    {getSenderAvatar(message.senderType, message.senderId)}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70">
          <div className="flex items-end space-x-2">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none overflow-y-auto max-h-32 min-h-[48px]" // min-h added
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-sky-500 text-white p-3 rounded-xl hover:bg-sky-600 disabled:bg-sky-300 disabled:cursor-not-allowed transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 flex-shrink-0"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2.5 text-center">
            Our support team aims to respond within a few minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportChatModal;
