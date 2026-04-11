import axios from 'axios';

// The Vite config prefixes this with the local dev server.
const API_URL = 'https://sheriyans-typescript.onrender.com/api/chats';

export const fetchAllChats = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.chats || [];
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
};

export const fetchSingleChat = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching chat ${id}:`, error);
    throw error;
  }
};

export const deleteChat = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting chat ${id}:`, error);
    return false;
  }
};

export const fetchChatResponse = async (prompt, chatId) => {
  try {
    const response = await axios.post(API_URL, { input: prompt, chatId });
    
    const data = response.data;
    
    if (data.success && data.aiMessage) {
        // Because the AI message maps exactly to the component needs 
        // due to our database schema design:
        const { aiMessage } = data;
        
        // Ensure judge is mapped accurately to the frontend contract.
        const judge = aiMessage.judge ? {
          solution_1_score: aiMessage.judge.solution_1_score || 0,
          solution_2_score: aiMessage.judge.solution_2_score || 0,
          solution_1_reasoning: aiMessage.judge.solution_1_reason || aiMessage.judge.solution_1_reasoning || "N/A",
          solution_2_reasoning: aiMessage.judge.solution_2_reason || aiMessage.judge.solution_2_reasoning || "N/A",
        } : null;
        
        return {
          chatId: data.chatId,
          userMessage: data.userMessage,
          aiMessage: { ...aiMessage, judge },
        };
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.error("Error fetching chat response:", error);
    throw error;
  }
};

export const uploadImageActAPI = async (file, prompt, chatId) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    if (prompt) formData.append('input', prompt);
    if (chatId) formData.append('chatId', chatId);

    const response = await axios.post(`${API_URL}/vision`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    const data = response.data;
    if (data.success) {
      return {
        chatId: data.chatId,
        userMessage: data.userMessage,
        aiMessage: data.aiMessage
      };
    }
    throw new Error('Upload failed');
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
