"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Button,
} from "@mui/material";

import {
  ApiResponse,
  JwtPayload,
  PostWithUser,
  UserSimple,
} from "@/interface/interfaces";
import NewPostBox from "./components/NewPostBox";
import ThreeColumnLayout from "../layouts/ThreeColumnLayout";
import Sidebar from "../components/Sidebar";
import Trending from "../components/Trending";
import PostList from "../components/PostList";
import NewPostDialog from "../components/NewPostDialog";
import { fetchUser } from "../components/commonActions";
import { fetchFeed } from "./homeActions";

export default function HomePage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserSimple | null>(null);
  const [ownUsername, setOwnUsername] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postOpen, setPostOpen] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("AUTH_TOKEN");
    if (!authToken) {
      router.push("/login");
      return;
    }

    const init = async () => {
      try {
        const decoded = jwtDecode<JwtPayload>(authToken);
        const username = decoded.sub;
        setToken(authToken);
        setOwnUsername(username);

        const userRes = await fetchUser(authToken, username);
        const userData = (userRes.data as ApiResponse).data;
        setUser(userData);

        const feedRes = await fetchFeed(authToken, 0);
        const feedData = (feedRes.data as ApiResponse).data.content;
        setPosts(feedData || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load home feed");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const reloadFeed = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetchFeed(token, 0);
      const data = (res.data as ApiResponse).data.content;
      setPosts(data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to refresh feed");
    }
  }, [token]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography color="error" mb={2}>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <ThreeColumnLayout
        left={
          <Sidebar
            onPostOpen={() => setPostOpen(true)}
            username={ownUsername}
          />
        }
        center={
          <>
            <NewPostBox
              profilePicture={user?.profilePicture || null}
              onPostSuccess={reloadFeed}
            />
            <PostList
              ownUsername={ownUsername}
              posts={posts}
              loading={false}
              error={null}
              onEdit={() => {}}
              onDelete={() => {}}
            />
            <NewPostDialog
              open={postOpen}
              profilePicture={user?.profilePicture}
              onClose={() => setPostOpen(false)}
              onPostSuccess={reloadFeed}
            />
          </>
        }
        right={<Trending />}
      />
    </Container>
  );
}
