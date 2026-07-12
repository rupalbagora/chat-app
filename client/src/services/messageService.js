import api from "../api/axios.js";

export const messageService = {
  sendMessage: async (data) => {
    const res = await api.post("/messages", data);
    return res.data.data;
  },

  getConversation: async (userId, page = 1) => {
    const res = await api.get(`/messages/${userId}`, { params: { page } });
    return res.data.data;
  },

  getRecentConversations: async () => {
    const res = await api.get("/messages/conversations");
    return res.data.data;
  },

  searchMessages: async (query) => {
    const res = await api.get("/messages/search", { params: { q: query } });
    return res.data.data;
  },

  editMessage: async (id, text) => {
    const res = await api.put(`/messages/${id}`, { text });
    return res.data.data;
  },

  deleteMessage: async (id) => {
    const res = await api.delete(`/messages/${id}`);
    return res.data.data;
  },

  markSeen: async (id) => {
    const res = await api.patch(`/messages/${id}/seen`);
    return res.data.data;
  },
};
