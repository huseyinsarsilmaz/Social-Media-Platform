import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  editText: string;
  setEditText: (text: string) => void;
  editingPost: boolean;
  editError: string | null;
  onSave: () => void;
}

const textFieldStyles = {
  bgcolor: "#1e1e1e",
  borderRadius: 1,
  "& label": { color: "rgba(255, 255, 255, 0.7)" },
  "& label.Mui-focused": { color: "#fff" },
  "& .MuiInputBase-input": { color: "#fff" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
    "&:hover fieldset": { borderColor: "#fff" },
    "&.Mui-focused fieldset": { borderColor: "#fff" },
  },
};

export default function EditPostDialog({
  open,
  onClose,
  editText,
  setEditText,
  editingPost,
  editError,
  onSave,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={() => !editingPost && onClose()}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { bgcolor: "#121212", color: "#fff", borderRadius: 2 },
      }}
    >
      <DialogTitle>Edit Post</DialogTitle>
      <DialogContent dividers sx={{ borderColor: "#2f2f2f" }}>
        <EditPostError message={editError} />
        <EditPostTextField
          value={editText}
          onChange={setEditText}
          disabled={editingPost}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={editingPost}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={editingPost || !editText.trim()}
        >
          {editingPost ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function EditPostError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
    </Alert>
  );
}

function EditPostTextField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
}) {
  return (
    <TextField
      label="Update your post"
      multiline
      minRows={3}
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      sx={textFieldStyles}
      disabled={disabled}
    />
  );
}
