import React, { useState, useRef } from 'react';
import { Send, Sparkles, Paperclip, Loader2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessageAct, sendImageAct } from '../store/chatSlice';

export const ChatInput = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  
  const isProcessing = useSelector((state) => state.chat.isProcessing);
  const isUploading = useSelector((state) => state.chat.isUploading);
  const activeChatId = useSelector((state) => state.chat.activeChatId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isProcessing) return;
    
    if (selectedFile) {
        dispatch(sendImageAct({ file: selectedFile, prompt: prompt.trim(), chatId: activeChatId }));
        setSelectedFile(null);
        setPrompt('');
    } else if (prompt.trim()) {
        dispatch(sendMessageAct({ prompt: prompt.trim(), chatId: activeChatId }));
        setPrompt('');
    }
  };

  const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
          setSelectedFile(e.target.files[0]);
      }
  };

  return (
    <div className="fixed bottom-0 left-0 lg:left-64 right-0  px-3 py-3 sm:p-6 pb-6 bg-gradient-to-t from-surface via-surface to-transparent pointer-events-none transition-all duration-300">
      <div className="max-w-4xl mx-auto pointer-events-auto relative">
        
        {/* Image Preview Overlay */}
        {selectedFile && (
            <div className="absolute -top-14 sm:-top-16 left-2 sm:left-4 bg-surface-card border border-text-sub/10 shadow-sm rounded-lg p-2 pr-8 flex items-center gap-2 shadow-md">
                <span className="text-xs font-semibold text-primary truncate max-w-[150px]">
                    {selectedFile.name}
                </span>
                <button 
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="absolute right-1 top-1 p-1 text-text-sub hover:text-red-500 bg-surface rounded-full"
                >
                    <X size={12} />
                </button>
            </div>
        )}

        <form 
          onSubmit={handleSubmit}
          className="relative flex items-center bg-surface-card  rounded-2xl sm:rounded-[1.5rem] shadow-[0_12px_40px_rgba(43,52,55,0.08)] border border-text-sub/10 overflow-hidden transition-all focus-within:shadow-[0_16px_48px_rgba(82,95,116,0.15)] focus-within:border-primary/30"
        >
          <div className="pl-3 sm:pl-6 text-primary flex items-center justify-center">
             <Sparkles size={20} />
          </div>
          
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={selectedFile ? "Add details about the image..." : "Describe your problem or request..."}
            className="flex-1 bg-transparent border-none py-3 sm:py-5 px-3 sm:px-4 text-sm sm:text-lg text-text-main placeholder:text-text-sub/50 focus:outline-none focus:ring-0 text-lg"
            maxLength={500}
            disabled={isProcessing}
          />

          <div className="flex items-center gap-1 sm:gap-2 pr-2 sm:pr-3 shrink-0">
            <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg"
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <button
               type="button"
               disabled={isProcessing}
               onClick={() => fileInputRef.current?.click()}
               className={`p-2 sm:p-3 rounded-full flex items-center justify-center shrink-0 text-text-sub/70 hover:text-primary transition-colors cursor-pointer ${selectedFile ? 'bg-primary/10 text-primary' : ''}`}
            >
               <Paperclip size={20} className="sm:w-5 sm:h-5" />
            </button>
            
            <button
              type="submit"
              disabled={(!prompt.trim() && !selectedFile) || isProcessing}
              className={`p-2 sm:p-3 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 active:scale-95 ${
                (prompt.trim() || selectedFile) && !isProcessing
                  ? 'bg-gradient-to-r from-primary to-blue-400 text-white shadow-md hover:shadow-lg'
                  : 'bg-surface-dim text-text-sub/30 cursor-not-allowed'
              }`}
            >
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className={(prompt.trim() || selectedFile) && !isProcessing ? "ml-1" : ""} />}
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
