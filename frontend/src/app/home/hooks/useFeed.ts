import { useState, useEffect, useCallback } from "react";
import { ApiResponse, PostWithUser } from "@/interface/interfaces";
import { fetchFeed } from "../homeActions";

export default function useFeed(token: string | null) {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFeed(token, 0);
      setPosts(res.data.data.content || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch feed");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  return { posts, loading, error, reload: loadFeed, setPosts };
}
