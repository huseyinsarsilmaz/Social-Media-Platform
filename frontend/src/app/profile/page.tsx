"use client";

import { useEffect, useState } from "react";
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
  IconButton,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { parseISO, format } from "date-fns";

interface UserSimple {
  id: number;
  email: string;
  username: string;
  name: string;
  surname: string;
  createdAt: string;
  bio: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: UserSimple | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSimple | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    name: "",
    bio: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("AUTH_TOKEN");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await axios.get<ApiResponse>("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status && res.data.data) {
          setUser(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch user data");
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  const handleEditOpen = () => {
    if (!user) return;
    setFormData({
      email: user.email,
      username: user.username,
      name: user.name,
      bio: user.bio || "",
    });
    setEditError(null);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    if (editLoading) return;
    setEditOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setEditLoading(true);
    setEditError(null);

    try {
      const token = localStorage.getItem("AUTH_TOKEN");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await axios.put<ApiResponse>("/users/me", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status && res.data.data) {
        setUser(res.data.data);
        setEditOpen(false);
      } else {
        setEditError(res.data.message || "Failed to update profile");
      }
    } catch (err: any) {
      setEditError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setEditLoading(false);
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

  if (!user) {
    return null;
  }

  return (
    <>
      <Container
        maxWidth="sm"
        sx={{ mt: 2, bgcolor: "#121212", borderRadius: 2 }}
      >
        <Box
          sx={{
            height: 120,
            bgcolor: "#1da1f2",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            position: "relative",
          }}
        >
          <Avatar
            alt={user.name}
            src="/favicon.ico" // placeholder image
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
                {user.name} {user.surname}
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
              Edit profile
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
        open={editOpen}
        onClose={handleEditClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: "#121212",
            color: "#fff",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff" }}>Edit Profile</DialogTitle>

        <DialogContent dividers sx={{ borderColor: "#2f2f2f" }}>
          {editError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editError}
            </Alert>
          )}
          <Stack spacing={2}>
            {(["email", "username", "name", "bio"] as const).map((field) => (
              <TextField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                type={field === "email" ? "email" : "text"}
                fullWidth
                multiline={field === "bio"}
                minRows={field === "bio" ? 3 : undefined}
                maxRows={field === "bio" ? 5 : undefined}
                value={formData[field]}
                onChange={handleChange}
                disabled={editLoading}
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
            ))}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleEditClose} disabled={editLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={editLoading}
          >
            {editLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
