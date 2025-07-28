import axios from "@/lib/axios";

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

export const fetchUser = (token: string, username: string) =>
  axios.get(`/users/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updatePost = (token: string, id: number, text: string) =>
  axios.put(
    `/posts/${id}`,
    { text },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const deletePost = (token: string, id: number) =>
  axios.delete(`/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
