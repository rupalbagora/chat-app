import api from "../api/axios.js";

export const userService = {
  getProfile: async () => {
    const res = await api.get("/users/profile");
    return res.data.data;
  },

  updateProfile: async (data) => {
    const res = await api.put("/users/profile", data);
    return res.data.data;
  },

  searchUsers: async (query) => {
    const res = await api.get("/users/search", { params: { q: query } });
    return res.data.data;
  },

  getUserById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data.data;
  },
};
