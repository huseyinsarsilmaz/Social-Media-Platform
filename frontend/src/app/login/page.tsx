"use client";

import { useState, useMemo, FormEvent } from "react";
import {
  Stack,
  Button,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";

import { loginUser } from "./loginActions";
import LoginTextField from "./components/LoginTextField";
import ErrorAlert from "./components/ErrorAlert";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(
    null
  );

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors(null);
    setLoading(true);

    try {
      const { status, message, data } = await loginUser(
        form.username,
        form.password
      );

      if (status) {
        localStorage.setItem("AUTH_TOKEN", data.token);
        router.push("/home");
      } else {
        setError(message || "Login failed. Please try again.");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      const fields = err?.response?.data?.data;

      if (msg === "Invalid Request format") {
        setFieldErrors(fields);
      }
      setError(msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const errorBlock = useMemo(() => {
    if (!error) return null;
    if (fieldErrors) {
      return Object.entries(fieldErrors).map(([_, msg], idx) => (
        <ErrorAlert key={idx} message={msg} />
      ));
    }
    return <ErrorAlert message={error} />;
  }, [error, fieldErrors]);

  return (
    <Container maxWidth="sm" sx={{ bgcolor: "#0a0a0a", py: 6 }}>
      <Stack
        spacing={2}
        alignItems="center"
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography variant="h5" sx={{ color: "#fff" }}>
          Sign In
        </Typography>

        {errorBlock}

        <LoginTextField
          label="Username"
          type="text"
          value={form.username}
          onChange={handleChange("username")}
        />

        <LoginTextField
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange("password")}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 1 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
      </Stack>
    </Container>
  );
}
