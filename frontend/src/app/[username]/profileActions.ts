import axios from "@/lib/axios";
import {
  ApiResponse,
  PaginatedResponse,
  Post,
  UserSimple,
} from "@/interface/interfaces";

export const fetchUserPosts = (token: string, userId: number) =>
  axios.get<ApiResponse<PaginatedResponse<Post>>>(`/posts/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProfile = (token: string, form: any) =>
  axios.put("/users/me", form, {
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

export const fetchUserFollowings = (
  token: string,
  userId: number,
  page: number = 0
) =>
  axios.get<ApiResponse<PaginatedResponse<UserSimple>>>(`/users/followings`, {
    params: { id: userId, page },
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchUserFollowers = (
  token: string,
  userId: number,
  page: number = 0
) =>
  axios.get<ApiResponse<PaginatedResponse<UserSimple>>>(`/users/followers`, {
    params: { id: userId, page },
    headers: { Authorization: `Bearer ${token}` },
  });

export const followUser = (token: string, userId: number) =>
  axios.post(`/users/follow/${userId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const unfollowUser = (token: string, userId: number) =>
  axios.delete(`/users/unfollow/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
