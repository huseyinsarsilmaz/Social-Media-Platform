import { TextField } from "@mui/material";

interface LoginTextFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function LoginTextField({
  label,
  type,
  value,
  onChange,
  required,
}: LoginTextFieldProps) {
  return (
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
}
