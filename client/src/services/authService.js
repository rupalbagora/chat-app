import api from "../api/axios.js";

export const authService = {
  register: async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data.data;
  },

  login: async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data.data;
  },

  getMe: async () => {
    const res = await api.get("/auth/profile");
    return res.data.data;
  },
};
