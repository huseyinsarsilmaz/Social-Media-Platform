import {
  Alert,
  Avatar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import ImageSharp from "@mui/icons-material/ImageSharp";
import { UserSimple } from "@/interface/interfaces";

interface Props {
  open: boolean;
  onClose: () => void;
  user: UserSimple;
  form: { email: string; username: string; name: string; bio: string };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  saving: boolean;
  saveError: string | null;
  handleImageUpload: (file: File, type: "profile" | "cover") => void;
  profileUploading: boolean;
  coverUploading: boolean;
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

export default function EditProfileDialog({
  open,
  onClose,
  user,
  form,
  onFormChange,
  onSave,
  saving,
  saveError,
  handleImageUpload,
  profileUploading,
  coverUploading,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={() => !saving && onClose()}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { bgcolor: "#121212", color: "#fff", borderRadius: 2 },
      }}
    >
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent dividers sx={{ borderColor: "#2f2f2f" }}>
        {saveError && <SaveError message={saveError} />}
        <CoverAndAvatar
          user={user}
          handleImageUpload={handleImageUpload}
          profileUploading={profileUploading}
          coverUploading={coverUploading}
        />
        <FormFields form={form} onChange={onFormChange} saving={saving} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSave} disabled={saving}>
          {saving ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function SaveError({ message }: { message: string }) {
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
    </Alert>
  );
}

function CoverAndAvatar({
  user,
  handleImageUpload,
  profileUploading,
  coverUploading,
}: {
  user: UserSimple;
  handleImageUpload: (file: File, type: "profile" | "cover") => void;
  profileUploading: boolean;
  coverUploading: boolean;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        mb: 6,
        pb: 4,
        borderRadius: 2,
        overflow: "visible",
        backgroundColor: "#1da1f2",
        height: 120,
        backgroundImage: user.coverPicture
          ? `url(http://localhost:8080/api/users/images/${user.coverPicture})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <label htmlFor="upload-cover-picture">
        <input
          type="file"
          id="upload-cover-picture"
          hidden
          accept="image/*"
          onChange={(e) =>
            e.target.files?.[0] && handleImageUpload(e.target.files[0], "cover")
          }
        />
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "#1da1f2",
            color: "#fff",
            "&:hover": { bgcolor: "#1a8cd8" },
          }}
          component="span"
          disabled={coverUploading}
        >
          <ImageSharp fontSize="small" />
        </IconButton>
      </label>

      <Box sx={{ position: "absolute", bottom: -40, left: 16 }}>
        <Avatar
          src={
            user?.profilePicture
              ? `http://localhost:8080/api/users/images/${user.profilePicture}`
              : "/favicon.ico"
          }
          sx={{ width: 80, height: 80, border: "3px solid #121212" }}
        />
        <label htmlFor="upload-profile-picture">
          <input
            type="file"
            id="upload-profile-picture"
            hidden
            accept="image/*"
            onChange={(e) =>
              e.target.files?.[0] &&
              handleImageUpload(e.target.files[0], "profile")
            }
          />
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              bottom: 40,
              right: 0,
              bgcolor: "#1da1f2",
              color: "#fff",
              "&:hover": { bgcolor: "#1a8cd8" },
            }}
            component="span"
            disabled={profileUploading}
          >
            <ImageSharp fontSize="small" />
          </IconButton>
        </label>
      </Box>
    </Box>
  );
}

function FormFields({
  form,
  onChange,
  saving,
}: {
  form: Props["form"];
  onChange: Props["onFormChange"];
  saving: boolean;
}) {
  return (
    <Stack spacing={2}>
      {(["email", "username", "name", "bio"] as const).map((field) => (
        <TextField
          key={field}
          name={field}
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          type={field === "email" ? "email" : "text"}
          fullWidth
          multiline={field === "bio"}
          minRows={field === "bio" ? 3 : undefined}
          maxRows={field === "bio" ? 5 : undefined}
          value={form[field]}
          onChange={onChange}
          disabled={saving}
          variant="outlined"
          sx={textFieldStyles}
        />
      ))}
    </Stack>
  );
}
