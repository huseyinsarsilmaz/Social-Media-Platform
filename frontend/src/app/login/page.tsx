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
import axios from "../../../lib/axios";
import { useRouter } from "next/navigation";
import { ErrorOutline } from "@mui/icons-material";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(
    null
  );

  const handleChange = useCallback(
    (field: keyof typeof form, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setFieldErrors(null);
      setLoading(true);

      try {
        const res = await axios.post("/auth/login", form);
        const { status, message } = res.data;

        if (status) {
          router.push("/home");
        } else {
          setError(message || "Login failed. Please try again.");
        }
      } catch (err: any) {
        if (err?.response?.data?.message === "Invalid Request format") {
          setFieldErrors(err.response.data.data);
        }
        setError(
          err?.response?.data?.message || "Login failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [form, router]
  );

  const errorBlock = useMemo(() => {
    if (!error) return null;

    if (fieldErrors) {
      return Object.entries(fieldErrors).map(([_, message], index) => (
        <ErrorAlert key={index} message={message} />
      ));
    }

    return <ErrorAlert message={error} />;
  }, [error, fieldErrors]);

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

        {errorBlock}

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
}) => (
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
