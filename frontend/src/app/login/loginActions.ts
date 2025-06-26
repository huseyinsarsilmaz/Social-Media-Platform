import axios from "@/lib/axios";

export const loginUser = async (username: string, password: string) => {
  const response = await axios.post("/auth/login", { username, password });
  return response.data;
};
