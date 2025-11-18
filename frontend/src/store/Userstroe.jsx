import axios from 'axios';
import { toast } from 'react-toastify';
import { create } from 'zustand';

const API = import.meta.env.VITE_API_URL; // ✅ Base URL from .env

export const UserStore = create((set) => ({
  user: null,
  isAutth: true,
  noteid: null,
  postdata: null,
  notedata: null,
  loading: false,

  setnoteid: (id) => {
    set({ noteid: id });
  },

  checkAuth: async () => {
    try {
      set({ loading: true });
const res = await axios.get(`${API}/apii/user/check`, {
  withCredentials: true,
});
console.log("check auth", API,res.data);
      set({ user: res.data, loading: false });
    } catch {
      set({ user: null, isAutth: false, loading: false });
    }
  },

  signup: async (data) => {
    try {
      const res = await axios.post(`${API}/apii/user/signup`, data,{withCredentials: true});
      set({ user: res.data });
      console.log("signup",res.data);
    } catch (e) {
      console.log(e);
      toast.error("Wrong credentials or password");
      set({ user: null });
    }
  },

  login: async (data) => {
    try {
      console.log(API)
      const res = await axios.post(`${API}/apii/user/login`, data,{
          withCredentials: true,
      });
      set({ user: res.data });
      console.log(res.data);
    } catch (e) {
      console.log("error", e);
      toast.error("Wrong credentials or password");
      set({ user: null });
    }
  },

  logout: async () => {
    try {
const res = await axios.post(`${API}/apii/user/logout`, null, {
  withCredentials: true,
});
      set({ user: null });
      console.log(res.data, "logout");
    } catch (e) {
      console.log(e);
    }
  },

  post: async (id) => {
    try {
      const res = await axios.get(`${API}/apii/post/${id}`);
      console.log(id);
      set({ postdata: res.data });
    } catch (e) {
      console.log("post error", e);
      set({ postdata: null });
    }
  },

  notes: async (id) => {
    try {
      const res = await axios.get(`${API}/apii/dir/${id}`);
      set({ notedata: res.data });
      console.log("notestore", res.data);
    } catch (e) {
      console.log("notes error", e);
      set({ notedata: null });
    }
  },
}));
