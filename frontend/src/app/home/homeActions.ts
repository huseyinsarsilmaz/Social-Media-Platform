import axios from "@/lib/axios";

export const fetchFeed = (token: string, page: number) => {
  return axios.get(`/feed?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createPost = (token: string, text: string) =>
  axios.post(
    "/posts",
    { text },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

export const fetchUser = (token: string) =>
  axios.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
