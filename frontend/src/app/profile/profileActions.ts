import axios from "@/lib/axios";
import { PaginatedResponse, Post, UserSimple } from "@/interface/interfaces";

export const fetchUser = (token: string) =>
  axios.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchUserPosts = (token: string) =>
  axios.get<{ status: boolean; message: string; data: Post[] }>("/posts/my", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProfile = (token: string, form: any) =>
  axios.put("/users/me", form, {
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

export const uploadImage = (
  token: string,
  formData: FormData,
  type: "profile" | "cover"
) =>
  axios.post(
    type === "profile" ? "/users/profilePicture" : "/users/coverPicture",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

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

export const fetchUserFollowings = (
  token: string,
  userId: number,
  page: number = 0
) =>
  axios.get<{
    status: boolean;
    message: string;
    data: PaginatedResponse<UserSimple>;
  }>(`/users/followings`, {
    params: { id: userId, page },
    headers: { Authorization: `Bearer ${token}` },
  });

  export const fetchUserFollowers = (
    token: string,
    userId: number,
    page: number = 0
  ) =>
    axios.get<{
      status: boolean;
      message: string;
      data: PaginatedResponse<UserSimple>;
    }>(`/users/followers`, {
      params: { id: userId, page },
      headers: { Authorization: `Bearer ${token}` },
    });
