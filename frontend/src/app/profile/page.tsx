"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "../../lib/axios";
import {
  Container,
  Stack,
  Typography,
  CircularProgress,
  Button,
  Avatar,
  Box,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { parseISO, format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  ChatBubbleOutline,
  Delete,
  Edit,
  FavoriteBorder,
  ImageSharp,
  Repeat,
  Share,
} from "@mui/icons-material";

interface UserSimple {
  id: number;
  email: string;
  username: string;
  name: string;
  surname: string;
  createdAt: string;
  bio: string;
  profilePicture: string | null;
  coverPicture: string | null;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: UserSimple | null;
}

interface Post {
  id: number;
  text: string;
  image: string | null;
  userId: number;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserSimple | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    email: "",
    username: "",
    name: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [postOpen, setPostOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editingPost, setEditingPost] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const getTokenOrRedirect = () => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) {
      router.push("/login");
    }
    return token;
  };

  const fetchPosts = async () => {
    setPostsLoading(true);
    setPostsError(null);
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await axios.get<{
        status: boolean;
        message: string;
        data: Post[];
      }>("/posts/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status) {
        setPosts(res.data.data);
      } else {
        setPostsError(res.data.message || "Failed to fetch posts.");
      }
    } catch (err: any) {
      setPostsError(err?.response?.data?.message || "Failed to fetch posts.");
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = getTokenOrRedirect();
      if (!token) return;

      try {
        const res = await axios.get<ApiResponse>("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status && res.data.data) {
          setUser(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch user data.");
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchPosts();
  }, [router]);

  const handleEditOpen = () => {
    if (!user) return;
    setForm({
      email: user.email,
      username: user.username,
      name: user.name,
      bio: user.bio || "",
    });
    setSaveError(null);
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const token = getTokenOrRedirect();
    if (!token) return;

    setSaving(true);
    setSaveError(null);

    try {
      const res = await axios.put<ApiResponse>("/users/me", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status && res.data.data) {
        setUser(res.data.data);
        setIsEditing(false);
      } else {
        setSaveError(res.data.message || "Failed to update profile.");
      }
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    const token = getTokenOrRedirect();
    if (!token) return;

    try {
      await axios.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete post.");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error" mb={2}>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => router.push("/login")}>
          Go to Login
        </Button>
      </Container>
    );
  }

  if (!user) return null;

  const textFieldStyles = {
    bgcolor: "#1e1e1e",
    borderRadius: 1,
    "& label": { color: "rgba(255, 255, 255, 0.7)" },
    "& label.Mui-focused": { color: "#fff" },
    "& .MuiInputBase-input": { color: "#fff" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
      "&:hover fieldset": { borderColor: "#fff" },
      "&.Mui-focused fieldset": { borderColor: "#fff" },
    },
  };

  return (
    <>
      <Container
        maxWidth="sm"
        sx={{ mt: 2, bgcolor: "#121212", borderRadius: 2 }}
      >
        <Box
          sx={{
            height: 120,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            position: "relative",
            backgroundColor: "#1da1f2",
            backgroundImage: user.coverPicture
              ? `url(http://localhost:8080/api/users/images/${user.coverPicture})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Avatar
            alt={user.name || user.username}
            src={
              user.profilePicture
                ? `http://localhost:8080/api/users/images/${user.profilePicture}`
                : "/favicon.ico"
            }
            sx={{
              width: 96,
              height: 96,
              border: "4px solid #121212",
              position: "absolute",
              bottom: -48,
              left: 16,
            }}
          />
        </Box>

        <Box sx={{ mt: 6, px: 2, color: "#fff" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {user.name}{" "}
              </Typography>
              <Typography variant="subtitle1" color="gray">
                @{user.username}
              </Typography>
            </Box>

            <Button
              variant="outlined"
              sx={{ borderColor: "#1da1f2", color: "#1da1f2" }}
              onClick={handleEditOpen}
            >
              Edit Profile
            </Button>
          </Stack>

          <Typography sx={{ mt: 1, color: "#ccc" }}>{user.bio}</Typography>

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 1, color: "gray", fontSize: 14 }}
          >
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarTodayIcon fontSize="small" />
              <Typography>
                Joined {format(parseISO(user.createdAt), "MMMM yyyy")}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={4} sx={{ mt: 2, color: "#ccc" }}>
            <Box>
              <Typography component="span" fontWeight="bold" color="#fff">
                0
              </Typography>{" "}
              Followers
            </Box>
            <Box>
              <Typography component="span" fontWeight="bold" color="#fff">
                0
              </Typography>{" "}
              Following
            </Box>
          </Stack>

          <Divider sx={{ mt: 3, bgcolor: "#2f2f2f" }} />
        </Box>
      </Container>

      <Dialog
        open={isEditing}
        onClose={() => !saving && setIsEditing(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { bgcolor: "#121212", color: "#fff", borderRadius: 2 },
        }}
      >
        <DialogTitle>Edit Profile</DialogTitle>

        <DialogContent dividers sx={{ borderColor: "#2f2f2f" }}>
          {saveError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {saveError}
            </Alert>
          )}

          <Stack spacing={2}>
            {(["email", "username", "name", "bio"] as const).map((field) => (
              <TextField
                key={field}
                name={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                type={field === "email" ? "email" : "text"}
                fullWidth
                multiline={field === "bio"}
                minRows={field === "bio" ? 3 : undefined}
                maxRows={field === "bio" ? 5 : undefined}
                value={form[field]}
                onChange={handleChange}
                disabled={saving}
                variant="outlined"
                sx={textFieldStyles}
              />
            ))}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsEditing(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={editPostId !== null}
        onClose={() => !editingPost && setEditPostId(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { bgcolor: "#121212", color: "#fff", borderRadius: 2 },
        }}
      >
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent dividers sx={{ borderColor: "#2f2f2f" }}>
          {editError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editError}
            </Alert>
          )}
          <TextField
            label="Update your post"
            multiline
            minRows={3}
            fullWidth
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            variant="outlined"
            sx={{
              bgcolor: "#1e1e1e",
              borderRadius: 1,
              "& label": { color: "rgba(255, 255, 255, 0.7)" },
              "& label.Mui-focused": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
                "&:hover fieldset": { borderColor: "#fff" },
                "&.Mui-focused fieldset": { borderColor: "#fff" },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPostId(null)} disabled={editingPost}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              setEditingPost(true);
              setEditError(null);
              const token = localStorage.getItem("AUTH_TOKEN");
              if (!token) {
                router.push("/login");
                return;
              }
              try {
                await axios.put(
                  `/posts/${editPostId}`,
                  { text: editText },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                setEditPostId(null);
                setEditText("");
                fetchPosts();
              } catch (err: any) {
                setEditError(
                  err?.response?.data?.message || "Failed to update post."
                );
              } finally {
                setEditingPost(false);
              }
            }}
            disabled={editingPost || !editText.trim()}
          >
            {editingPost ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={postOpen}
        onClose={() => !posting && setPostOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { bgcolor: "#121212", color: "#fff", borderRadius: 2 },
        }}
      >
        <DialogTitle>New Post</DialogTitle>
        <DialogContent dividers sx={{ borderColor: "#2f2f2f" }}>
          {postError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {postError}
            </Alert>
          )}
          <TextField
            label="What's happening?"
            multiline
            minRows={3}
            fullWidth
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            variant="outlined"
            sx={{
              bgcolor: "#1e1e1e",
              borderRadius: 1,
              "& label": { color: "rgba(255, 255, 255, 0.7)" },
              "& label.Mui-focused": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
                "&:hover fieldset": { borderColor: "#fff" },
                "&.Mui-focused fieldset": { borderColor: "#fff" },
              },
            }}
          />
          <Box mt={2} textAlign="right">
            <ImageSharp />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPostOpen(false)} disabled={posting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              setPosting(true);
              setPostError(null);
              const token = localStorage.getItem("AUTH_TOKEN");
              if (!token) {
                router.push("/login");
                return;
              }
              try {
                await axios.post(
                  "/posts",
                  { text: postText },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                setPostText("");
                setPostOpen(false);
              } catch (err: any) {
                setPostError(err?.response?.data?.message || "Failed to post.");
              } finally {
                setPosting(false);
                fetchPosts();
              }
            }}
            disabled={posting || !postText.trim()}
          >
            {posting ? <CircularProgress size={24} /> : "Post"}
          </Button>
        </DialogActions>
      </Dialog>
      <Container maxWidth="sm" sx={{ mt: 3, mb: 4 }}>
        <Button
          variant="contained"
          sx={{ bgcolor: "#1da1f2" }}
          onClick={() => setPostOpen(true)}
        >
          Post
        </Button>
        <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
          Your Posts
        </Typography>

        {postsLoading && (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {postsError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {postsError}
          </Typography>
        )}

        {!postsLoading && posts.length === 0 && (
          <Typography sx={{ color: "gray" }}>
            You have not posted anything yet.
          </Typography>
        )}

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onEdit={(p) => {
              setEditPostId(p.id);
              setEditText(p.text);
            }}
            onDelete={handleDeletePost}
          />
        ))}
      </Container>
    </>
  );
}

const PostCard: React.FC<{
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}> = ({ post, onEdit, onDelete }) => (
  <Box
    sx={{
      bgcolor: "#1e1e1e",
      p: 2,
      borderRadius: 2,
      mb: 2,
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      gap: 1,
    }}
  >
    <Typography>{post.text}</Typography>

    <Box display="flex" justifyContent="flex-end">
      <Stack direction="row" spacing={1}>
        <IconButton
          size="small"
          onClick={() => onEdit(post)}
          sx={{ color: "#1da1f2" }}
        >
          <Edit fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete(post.id)}
          sx={{ color: "red" }}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Stack>
    </Box>

    <Divider sx={{ bgcolor: "#2f2f2f", my: 1 }} />

    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ color: "gray" }}
    >
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        sx={{ cursor: "pointer" }}
      >
        <ChatBubbleOutline fontSize="small" />
        <Typography variant="caption">0</Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        sx={{ cursor: "pointer" }}
      >
        <Repeat fontSize="small" />
        <Typography variant="caption">0</Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        sx={{ cursor: "pointer" }}
      >
        <FavoriteBorder fontSize="small" />
        <Typography variant="caption">0</Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        sx={{ cursor: "pointer" }}
      >
        <Share fontSize="small" />
      </Stack>
    </Stack>
  </Box>
);
