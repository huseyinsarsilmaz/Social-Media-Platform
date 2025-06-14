import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL,
});

instance.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("AUTH_TOKEN") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
