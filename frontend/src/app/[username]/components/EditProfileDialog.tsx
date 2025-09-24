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

const EditProfileDialog = ({
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
}: Props) => {
  const fieldLabels = {
    email: "Email",
    username: "Username",
    name: "Name",
    bio: "Bio",
  };

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
        {saveError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveError}
          </Alert>
        )}
        <CoverAndAvatar
          user={user}
          onUpload={handleImageUpload}
          uploading={{ profile: profileUploading, cover: coverUploading }}
        />
        <Stack spacing={2}>
          {(Object.keys(fieldLabels) as Array<keyof typeof fieldLabels>).map(
            (key) => (
              <TextField
                key={key}
                name={key}
                label={fieldLabels[key]}
                type={key === "email" ? "email" : "text"}
                fullWidth
                multiline={key === "bio"}
                minRows={key === "bio" ? 3 : undefined}
                maxRows={key === "bio" ? 5 : undefined}
                value={form[key]}
                onChange={onFormChange}
                disabled={saving}
                variant="outlined"
                sx={textFieldStyles}
              />
            )
          )}
        </Stack>
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
};

const CoverAndAvatar = ({
  user,
  onUpload,
  uploading,
}: {
  user: UserSimple;
  onUpload: (file: File, type: "profile" | "cover") => void;
  uploading: { profile: boolean; cover: boolean };
}) => {
  const renderUploadButton = (
    id: string,
    disabled: boolean,
    onChange: (file: File) => void,
    sx: object
  ) => (
    <label htmlFor={id}>
      <input
        type="file"
        id={id}
        hidden
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
      />
      <IconButton component="span" sx={sx} disabled={disabled}>
        <ImageSharp fontSize="small" />
      </IconButton>
    </label>
  );

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
      {renderUploadButton(
        "upload-cover-picture",
        uploading.cover,
        (file) => onUpload(file, "cover"),
        {
          position: "absolute",
          top: 8,
          right: 8,
          bgcolor: "#1da1f2",
          color: "#fff",
          "&:hover": { bgcolor: "#1a8cd8" },
        }
      )}
      <Box sx={{ position: "absolute", bottom: -40, left: 16 }}>
        <Avatar
          src={
            user.profilePicture
              ? `http://localhost:8080/api/users/images/${user.profilePicture}`
              : "/favicon.ico"
          }
          sx={{ width: 80, height: 80, border: "3px solid #121212" }}
        />
        {renderUploadButton(
          "upload-profile-picture",
          uploading.profile,
          (file) => onUpload(file, "profile"),
          {
            position: "absolute",
            bottom: 40,
            right: 0,
            bgcolor: "#1da1f2",
            color: "#fff",
            "&:hover": { bgcolor: "#1a8cd8" },
          }
        )}
      </Box>
    </Box>
  );
};

export default EditProfileDialog;
