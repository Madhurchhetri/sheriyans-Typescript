import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MessageItem } from "../components/MessageItem";
import { ChatInput } from "../components/ChatInput";
import { Sidebar } from "../components/Sidebar";

export const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messages = useSelector((state) => state.chat.messages);
  const isProcessing = useSelector((state) => state.chat.isProcessing);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [messages, isProcessing]);

  useEffect(() => {
  const handleToggle = () => setIsSidebarOpen(prev => !prev);

  window.addEventListener("toggleSidebar", handleToggle);

  return () => {
    window.removeEventListener("toggleSidebar", handleToggle);
  };
}, []);

  return (
    <div className="flex w-full h-[calc(100vh-73px)] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* 🔥 Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-surface z-50 transform transition-transform duration-300
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden`}
      >
        <Sidebar />
      </div>

      {/* 🔥 Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 overflow-y-auto relative pb-32 no-scrollbar">
        <main className="px-6 sm:px-12 md:px-24">
          {messages.length === 0 && !isProcessing ? (
            <div className="h-[70vh] flex items-center justify-center flex-col text-center opacity-60">
              <h2 className="text-3xl font-display font-semibold mb-4 text-primary">
                Ready for Evaluation
              </h2>
              <p className="text-text-sub max-w-md mx-auto line-height-relaxed">
                Enter your problem, prompt, or upload an image below. The system
                will process it and provide a judicial recommendation or image
                analysis.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 pb-12 pt-8">
              {messages.map((msg) => (
                <MessageItem key={msg.id} message={msg} />
              ))}
              {isProcessing && (
                <div className="w-full max-w-6xl mx-auto py-12 flex justify-center opacity-50">
                  <div className="animate-pulse flex items-center gap-2 text-primary font-medium tracking-widest uppercase text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150"></div>
                    <span className="ml-2">Analyzing models...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} className="h-1" />
            </div>
          )}
        </main>

        <ChatInput />
      </div>
    </div>
  );
};
