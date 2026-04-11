import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

export const ChatInput = ({ onSendMessage, isProcessing }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isProcessing) {
      onSendMessage(prompt.trim());
      setPrompt('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full p-6 pb-8 bg-gradient-to-t from-surface via-surface to-transparent pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-center bg-surface-card rounded-[1.5rem] shadow-[0_12px_40px_rgba(43,52,55,0.08)] border border-text-sub/10 overflow-hidden transition-all focus-within:shadow-[0_16px_48px_rgba(82,95,116,0.15)] focus-within:border-primary/30"
        >
          <div className="pl-6 text-primary flex items-center justify-center">
             <Sparkles size={20} />
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your problem or request..."
            className="flex-1 bg-transparent border-none py-5 px-4 text-text-main placeholder:text-text-sub/50 focus:outline-none focus:ring-0 text-lg"
            maxLength={500}
            disabled={isProcessing}
          />
          <div className="pr-4">
            <button
              type="submit"
              disabled={!prompt.trim() || isProcessing}
              className={`p-3 rounded-full flex items-center justify-center transition-all ${
                prompt.trim() && !isProcessing
                  ? 'bg-gradient-to-r from-primary to-blue-300 text-white shadow-md hover:opacity-90 cursor-pointer'
                  : 'bg-surface-dim text-text-sub/30 cursor-not-allowed'
              }`}
            >
              <Send size={18} className={prompt.trim() && !isProcessing ? "ml-1" : ""} />
            </button>
          </div>
        </form>
        <p className="text-center text-xs text-text-sub/50 mt-4 tracking-wide">
          AI Chat Canvas evaluates solutions dynamically. Use with care.
        </p>
      </div>
    </div>
  );
};
