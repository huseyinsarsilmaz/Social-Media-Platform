"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Container,
  Stack,
  Typography,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { CheckCircleSharp, ErrorOutline } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "../../lib/axios";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    name: "",
    bio: "",
    emailVerification: "",
  });

  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(
    null
  );

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSendCode = async () => {
    setSendingCode(true);
    setError(null);
    setFieldErrors(null);

    try {
      await axios.post("/users/verification/email", { email: form.email });
      setCodeSent(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to send code.";
      const fields = err?.response?.data?.data;

      if (msg === "Invalid Request format" && fields) {
        setFieldErrors(fields);
      }

      setError(msg);
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors(null);
    setLoading(true);

    try {
      await axios.post("/auth/register", form);
      router.push("/home");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Registration failed.";
      const fields = err?.response?.data?.data;

      if (msg === "Invalid Request format" && fields) {
        setFieldErrors(fields);
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderedErrors = useMemo(() => {
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
          Register
        </Typography>

        {renderedErrors}

        <FormTextField
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
        />

        <Button
          onClick={handleSendCode}
          variant="outlined"
          color="secondary"
          fullWidth
          disabled={sendingCode || codeSent}
        >
          {sendingCode ? (
            <CircularProgress size={20} />
          ) : codeSent ? (
            <>
              <CheckCircleSharp sx={{ color: "green", fontSize: 20, mr: 1 }} />
              <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Code sent
              </Typography>
            </>
          ) : (
            "Send Code"
          )}
        </Button>

        {codeSent && (
          <>
            <FormTextField
              label="Verification Code"
              type="text"
              value={form.emailVerification}
              onChange={handleChange("emailVerification")}
            />
            <FormTextField
              label="Username"
              type="text"
              value={form.username}
              onChange={handleChange("username")}
            />
            <FormTextField
              label="Name"
              type="text"
              value={form.name}
              onChange={handleChange("name")}
            />
            <FormTextField
              label="Bio"
              type="text"
              value={form.bio}
              onChange={handleChange("bio")}
            />
            <FormTextField
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
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>
          </>
        )}
      </Stack>
    </Container>
  );
}

const FormTextField: React.FC<{
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}> = ({ label, type, value, onChange, required = true }) => (
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
