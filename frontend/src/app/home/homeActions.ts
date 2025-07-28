import axios from "@/lib/axios";

export const fetchFeed = (token: string, page: number) => {
  return axios.get(`/feed?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};