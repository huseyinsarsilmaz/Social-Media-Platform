import { useState, useEffect, useCallback } from "react";
import { fetchUserPosts } from "../profileActions";
import {
  ApiResponse,
  Post,
  PostWithUser,
  UserSimple,
} from "@/interface/interfaces";

export default function useUserPosts(
  token: string | null,
  user: UserSimple | null
) {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    setError(null);
    try {
      const postsRes = await fetchUserPosts(token, user.id);
      const rawPosts = (postsRes.data as ApiResponse).data.content || [];
      const wrappedPosts = rawPosts.map((post: Post) => ({ user, post }));
      setPosts(wrappedPosts);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return { posts, loading, error, reload: loadPosts, setPosts };
}
