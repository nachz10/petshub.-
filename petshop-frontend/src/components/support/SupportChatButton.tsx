import { useState } from "react";
import { MessageCircleQuestion } from "lucide-react";
import SupportChatModal from "./SupportChatModal";

const SupportChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center space-x-2 text-white/90 hover:text-white transition-colors cursor-pointer"
      >
        <MessageCircleQuestion size={18} />
        <span className="text-md font-medium">24/7 Support</span>
      </button>

      {isOpen && <SupportChatModal onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default SupportChatButton;
