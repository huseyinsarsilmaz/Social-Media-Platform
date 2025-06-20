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
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { parseISO, format } from "date-fns";
import { useRouter } from "next/navigation";

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

  const getTokenOrRedirect = () => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) {
      router.push("/login");
    }
    return token;
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
            bgcolor: "#1da1f2",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            position: "relative",
          }}
        >
          <Avatar
            alt={user.name || user.username}
            src="/favicon.ico"
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
    </>
  );
}
