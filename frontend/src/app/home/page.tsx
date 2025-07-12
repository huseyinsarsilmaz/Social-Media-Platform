"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Button,
  Paper,
} from "@mui/material";

import PostList from "./components/PostList";
import { fetchFeed } from "./homeActions";
import { ApiResponse, PostWithUser } from "@/interface/interfaces";
import NewPostBox from "./components/NewPostBox";

export default function HomePage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authToken = localStorage.getItem("AUTH_TOKEN");
    if (!authToken) {
      router.push("/login");
    } else {
      setToken(authToken);
    }
  }, []);

  const loadFeed = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFeed(token, 0);
      const data = (res.data as ApiResponse).data.content;
      setPosts(data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch feed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadFeed(token);
    }
  }, [token, loadFeed]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography color="error" mb={2}>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          mt: 4,
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ flex: 1, maxWidth: "600px" }}>
          <NewPostBox onPostSuccess={() => token && loadFeed(token)} />
          <PostList
            posts={posts}
            loading={false}
            error={null}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: "300px",
          }}
        >
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Trends for you
            </Typography>
            <Typography color="text.secondary">#Placeholder</Typography>
            <Typography color="text.secondary">#TrendingTopic</Typography>
            <Typography color="text.secondary">#ComingSoon</Typography>
          </Paper>
        </Box>
      </Box>
    );
  };

  return <Container maxWidth="lg">{renderContent()}</Container>;
}
