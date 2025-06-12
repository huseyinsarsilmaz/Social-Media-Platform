"use client";

import { useState, useCallback } from "react";
import {
  Stack,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "../../../lib/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (field: "email" | "password", value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
        await axios.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        router.push("/home");
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Login failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [form, router]
  );

  return (
    <Container maxWidth="sm" sx={{ bgcolor: "#0a0a0a" }}>
      <Stack
        spacing={2}
        mt={4}
        alignItems="center"
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography component="h1" variant="h5" mb={1} sx={{ color: "#fff" }}>
          Sign in
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        )}

        <FormTextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(val) => handleChange("email", val)}
        />

        <FormTextField
          label="Password"
          type="password"
          value={form.password}
          onChange={(val) => handleChange("password", val)}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 1 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
      </Stack>
    </Container>
  );
}

interface FormTextFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const FormTextField: React.FC<FormTextFieldProps> = ({
  label,
  type,
  value,
  onChange,
  required = true,
}) => {
  return (
    <TextField
      label={label}
      type={type}
      fullWidth
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
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
};
