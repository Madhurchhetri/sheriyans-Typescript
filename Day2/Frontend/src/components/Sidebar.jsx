import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadHistoryAct, loadSingleChatAct, removeChatAct, createNewChatUI } from '../store/chatSlice';
import { MessageSquare, Trash2, PlusCircle } from 'lucide-react';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const historyList = useSelector((state) => state.chat.historyList);
  const activeChatId = useSelector((state) => state.chat.activeChatId);

  useEffect(() => {
    dispatch(loadHistoryAct());
  }, [dispatch, activeChatId]); // Refresh when activeChatId changes (new chat created)

  const handleSelectChat = (id) => {
    if (id !== activeChatId) {
        dispatch(loadSingleChatAct(id));
    }
  };

  const handleDeleteChat = (e, id) => {
    e.stopPropagation();
    dispatch(removeChatAct(id));
  };

  return (
    <div className="w-64 h-[calc(100vh-73px)] border-r border-surface-dim bg-surface-card flex flex-col transition-colors duration-300">
      <div className="p-4 border-b border-surface-dim">
        <button 
            onClick={() => dispatch(createNewChatUI())}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-blue-400 text-white font-medium hover:opacity-90 transition-opacity"
        >
            <PlusCircle size={18} />
            New Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <h3 className="text-xs font-semibold text-text-sub uppercase tracking-wider mb-4 pl-2">History</h3>
        
        {historyList.length === 0 ? (
          <p className="text-sm text-text-sub/50 pl-2">No past chats yet.</p>
        ) : (
          historyList.map(chat => (
            <div 
                key={chat._id}
                onClick={() => handleSelectChat(chat._id)}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    activeChatId === chat._id ? 'bg-primary/10 text-primary' : 'hover:bg-surface-dim text-text-main'
                }`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <MessageSquare size={16} className={activeChatId === chat._id ? "text-primary" : "text-text-sub/60"} />
                    <span className="text-sm font-medium truncate">{chat.title}</span>
                </div>
                <button 
                    onClick={(e) => handleDeleteChat(e, chat._id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-text-sub/50 hover:text-red-500 rounded-md hover:bg-surface transition-all"
                >
                    <Trash2 size={14} />
                </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
