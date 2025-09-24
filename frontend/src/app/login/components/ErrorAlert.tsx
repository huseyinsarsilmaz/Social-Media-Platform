import { ErrorOutline } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";

interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
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
}
