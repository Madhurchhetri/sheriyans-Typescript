import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllChats, fetchSingleChat, deleteChat, fetchChatResponse, uploadImageActAPI } from '../api/chat';

export const loadHistoryAct = createAsyncThunk('chat/loadHistory', async () => {
  const history = await fetchAllChats();
  return history;
});

export const loadSingleChatAct = createAsyncThunk('chat/loadSingle', async (id) => {
  const data = await fetchSingleChat(id);
  return data;
});

export const removeChatAct = createAsyncThunk('chat/delete', async (id) => {
  await deleteChat(id);
  return id;
});

export const sendMessageAct = createAsyncThunk(
  'chat/sendMessage',
  async ({ prompt, chatId }) => {
    const response = await fetchChatResponse(prompt, chatId);
    return response;
  }
);

export const sendImageAct = createAsyncThunk(
  'chat/sendImage',
  async ({ file, prompt, chatId }) => {
    const response = await uploadImageActAPI(file, prompt, chatId);
    return response;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    historyList: [],
    activeChatId: null,
    messages: [],
    isProcessing: false,
    isUploading: false,
  },
  reducers: {
    createNewChatUI: (state) => {
        state.activeChatId = null;
        state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Load History
      .addCase(loadHistoryAct.fulfilled, (state, action) => {
        state.historyList = action.payload;
      })
      
      // Load Single Chat
      .addCase(loadSingleChatAct.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.activeChatId = action.payload.chat._id;
          state.messages = action.payload.chat.messages;
        }
      })
      
      // Delete Chat
      .addCase(removeChatAct.fulfilled, (state, action) => {
        state.historyList = state.historyList.filter(chat => chat._id !== action.payload);
        if (state.activeChatId === action.payload) {
            state.activeChatId = null;
            state.messages = [];
        }
      })
      
      // Send Message (Text)
      .addCase(sendMessageAct.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(sendMessageAct.fulfilled, (state, action) => {
        state.isProcessing = false;
        
        // If it was a new chat, update activeChatId
        if (!state.activeChatId) {
            state.activeChatId = action.payload.chatId;
        }
        
        state.messages.push(action.payload.userMessage);
        state.messages.push(action.payload.aiMessage);
      })
      .addCase(sendMessageAct.rejected, (state, action) => {
        state.isProcessing = false;
        console.error("Failed to send message:", action.error);
      })
      
      // Send Message (Image)
      .addCase(sendImageAct.pending, (state) => {
        state.isUploading = true;
        state.isProcessing = true;
      })
      .addCase(sendImageAct.fulfilled, (state, action) => {
        state.isUploading = false;
        state.isProcessing = false;
        
        if (!state.activeChatId) {
            state.activeChatId = action.payload.chatId;
        }
        
        state.messages.push(action.payload.userMessage);
        state.messages.push(action.payload.aiMessage);
      })
      .addCase(sendImageAct.rejected, (state, action) => {
        state.isUploading = false;
        state.isProcessing = false;
      });
  },
});

export const { createNewChatUI } = chatSlice.actions;
export default chatSlice.reducer;
