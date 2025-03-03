import { useState } from "react";
import ChatButton from "../../assets/Image/ChatButton.png";
import LineChat from "../../assets/Image/LineChat.png";
import facebook from "../../assets/Image/facebook.png";

const ChatFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIcons = () => setIsOpen(!isOpen);

  return (
    <div className="fixed right-4 bottom-20 md:bottom-6 lg:bottom-4 xl:bottom-4 flex flex-col items-center space-y-2 z-50">
      {isOpen && (
        <div className="flex flex-col items-center space-y-2 mb-2">
          {/* LINE Chat */}
          <a
            href="https://line.me/R/ti/p/@021nijcx"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={LineChat}
              alt="Line Chat"
              className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-14 xl:h-14 rounded-full shadow-lg hover:scale-110 transition-transform"
            />
          </a>

          {/* Facebook Chat */}
          <a
            href="https://www.facebook.com/ADCdigitalpower"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={facebook}
              alt="Facebook Chat"
              className="w-10 h-10 md:w-12 md:h-12 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full shadow-lg hover:scale-110 transition-transform"
            />
          </a>
        </div>
      )}

      {/* ปุ่มหลักสำหรับเปิด/ปิดเมนู */}
      <button onClick={toggleIcons} className="focus:outline-none">
        <img
          src={ChatButton}
          alt="แชทกับเรา"
          className="w-16 h-17 md:w-17 md:h-18 lg:w-17 lg:h-18 xl:w-20 xl:h-20 hover:scale-105 transition-transform"
        />
      </button>
    </div>
  );
};

export default ChatFloatingButton;
