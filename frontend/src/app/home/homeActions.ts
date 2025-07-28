import {
  ApiResponse,
  PaginatedResponse,
  PostWithUser,
} from "@/interface/interfaces";
import axios from "@/lib/axios";

export const fetchFeed = (token: string, page: number) => {
  return axios.get<ApiResponse<PaginatedResponse<PostWithUser>>>(
    `/feed?page=${page}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
