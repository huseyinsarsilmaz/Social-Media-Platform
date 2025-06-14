"use client";

import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { Container, Stack, Typography, CircularProgress, Button } from "@mui/material";
import { useRouter } from "next/navigation";

interface UserSimple {
  id: number;
  email: string;
  name: string;
  surname: string;
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
    return null; // or something else if needed
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, color: "#fff" }}>
      <Stack spacing={2}>
        <Typography variant="h4">Profile</Typography>
        <Typography>
          <strong>Name:</strong> {user.name} {user.surname}
        </Typography>
        <Typography>
          <strong>Email:</strong> {user.email}
        </Typography>
      </Stack>
    </Container>
  );
}
