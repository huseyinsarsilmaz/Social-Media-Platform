"use client";

import { useState, useMemo, FormEvent } from "react";
import {
  Container,
  Stack,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { CheckCircleSharp } from "@mui/icons-material";
import { useRouter } from "next/navigation";

import { sendVerificationCode, registerUser } from "./registerActions";
import RegisterTextField from "./components/RegisterTextField";
import ErrorAlert from "./components/ErrorAlert";

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
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSendCode = async () => {
    setSendingCode(true);
    setError(null);
    setFieldErrors(null);

    try {
      await sendVerificationCode(form.email);
      setCodeSent(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to send code.";
      const fields = err?.response?.data?.data;
      if (msg === "Invalid Request format" && fields) setFieldErrors(fields);
      setError(msg);
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors(null);
    setLoading(true);

    try {
      await registerUser(form);
      router.push("/home");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Registration failed.";
      const fields = err?.response?.data?.data;
      if (msg === "Invalid Request format" && fields) setFieldErrors(fields);
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

        <RegisterTextField
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
            <RegisterTextField
              label="Verification Code"
              type="text"
              value={form.emailVerification}
              onChange={handleChange("emailVerification")}
            />
            <RegisterTextField
              label="Username"
              type="text"
              value={form.username}
              onChange={handleChange("username")}
            />
            <RegisterTextField
              label="Name"
              type="text"
              value={form.name}
              onChange={handleChange("name")}
            />
            <RegisterTextField
              label="Bio"
              type="text"
              value={form.bio}
              onChange={handleChange("bio")}
            />
            <RegisterTextField
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
