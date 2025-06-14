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
import axios from "../../lib/axios";
import { useRouter } from "next/navigation";
import { CheckCircleSharp, ErrorOutline } from "@mui/icons-material";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    name: "",
    emailVerification: "",
  });

  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
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

  const handleSendCode = async () => {
    setSendingCode(true);
    setError(null);
    setFieldErrors(null);

    try {
      await axios.post("/users/verification/email", { email: form.email });
      setCodeSent(true);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to send code.";
      const fields = err?.response?.data?.data;

      if (message === "Invalid Request format" && fields) {
        setFieldErrors(fields);
      }

      setError(message);
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
      if (err?.response?.data?.message === "Invalid Request format") {
        setFieldErrors(err?.response?.data?.data);
      }

      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const renderedErrors = useMemo(() => {
    if (!error) return null;

    if (fieldErrors) {
      return Object.entries(fieldErrors).map(([field, message], idx) => (
        <ErrorAlert key={idx} message={message} />
      ));
    }

    return <ErrorAlert message={error} />;
  }, [error, fieldErrors]);

  return (
    <Container maxWidth="sm" sx={{ bgcolor: "#0a0a0a" }}>
      <Stack
        spacing={2}
        mt={8}
        alignItems="center"
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography component="h1" variant="h5" sx={{ color: "#fff" }}>
          Register
        </Typography>

        {renderedErrors}

        <FormTextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(val) => handleChange("email", val)}
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
              onChange={(val) => handleChange("emailVerification", val)}
            />
            <FormTextField
              label="Username"
              type="text"
              value={form.username}
              onChange={(val) => handleChange("username", val)}
            />
            <FormTextField
              label="Name"
              type="text"
              value={form.name}
              onChange={(val) => handleChange("name", val)}
            />

            <FormTextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(val) => handleChange("password", val)}
            />

            <Button type="submit" fullWidth variant="contained" color="primary">
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

type FormTextFieldProps = {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

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
