import axios from "@/lib/axios";
import { ApiResponse, PostWithReplies } from "@/interface/interfaces";

export const fetchPostWithReplies = (token: string, postId: number) =>
  axios.get<ApiResponse<PostWithReplies>>(`/feed/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
