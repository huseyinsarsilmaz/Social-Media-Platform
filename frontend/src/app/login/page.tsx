"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Stack,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "../../lib/axios";

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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setFieldErrors(null);
      setLoading(true);

      try {
        const res = await axios.post("/auth/login", form);
        const { status, message, data } = res.data;

        if (status) {
          localStorage.setItem("AUTH_TOKEN", data.token);
          router.push("/profile");
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
    },
    [form, router]
  );

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

        <CustomTextField
          label="Username"
          type="text"
          value={form.username}
          onChange={handleChange("username")}
        />

        <CustomTextField
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

interface TextFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const CustomTextField: React.FC<TextFieldProps> = ({
  label,
  type,
  value,
  onChange,
  required = true,
}) => (
  <TextField
    label={label}
    type={type}
    fullWidth
    required={required}
    value={value}
    onChange={onChange}
    sx={{
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
);

const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={1}
    sx={{
      width: "100%",
      bgcolor: "#1a1a1a",
      border: "1px solid #ff0000",
      p: 1,
      borderRadius: 1,
    }}
  >
    <ErrorOutline sx={{ color: "red", fontSize: 20 }} />
    <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
      {message}
    </Typography>
  </Stack>
);
