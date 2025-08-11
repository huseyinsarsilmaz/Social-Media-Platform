import { ApiResponse, UserSimple } from "@/interface/interfaces";
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
  axios.get<ApiResponse<UserSimple>>(`/users/${username}`, {
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

export const likePost = (token: string, postId: number) =>
  axios.post(`/posts/like/${postId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const unlikePost = (token: string, postId: number) =>
  axios.delete(`/posts/unlike/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
