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
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import LinkIcon from "@mui/icons-material/Link";
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

        if (res.data.status) {
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
          {/* <Stack direction="row" spacing={0.5} alignItems="center">
            <LinkIcon fontSize="small" />
            <Typography>https://example.com</Typography>
          </Stack> */}
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
  );
}
