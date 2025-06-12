"use client";

import { useState, useCallback } from "react";
import {
  Container,
  Stack,
  TextField,
  Typography,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "../../../lib/axios";
import { useRouter } from "next/navigation";
import { CheckCircleSharp } from "@mui/icons-material";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    phoneNumber: "",
    emailVerification: "",
  });
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (field: keyof typeof form, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSendCode = async () => {
    setSendingCode(true);
    setError(null);

    try {
      await axios.post("/users/verification/email", { email: form.email });
      setCodeSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send code.");
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axios.post("/auth/register", form);
      router.push("/home");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

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
              label="Name"
              type="text"
              value={form.name}
              onChange={(val) => handleChange("name", val)}
            />

            <FormTextField
              label="Surname"
              type="text"
              value={form.surname}
              onChange={(val) => handleChange("surname", val)}
            />

            <FormTextField
              label="Phone Number"
              type="tel"
              value={form.phoneNumber}
              onChange={(val) => handleChange("phoneNumber", val)}
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
