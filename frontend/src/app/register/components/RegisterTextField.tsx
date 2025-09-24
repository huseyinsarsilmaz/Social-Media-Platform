import { TextField } from "@mui/material";

interface RegisterTextFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function RegisterTextField({
  label,
  type,
  value,
  onChange,
  required,
}: RegisterTextFieldProps) {
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
