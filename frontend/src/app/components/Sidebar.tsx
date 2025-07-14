import {
  AcUnit,
  Home,
  Person,
  Settings,
  TravelExplore,
  Notifications,
  MailOutline,
  BookmarkBorder,
} from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";

export default function Sidebar({ onPostOpen }: { onPostOpen: () => void }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100%"
    >
      <Box>
        <ListItem
          sx={{
            justifyContent: "flex-start",
            px: 2,
            mb: 2,
            pointerEvents: "none",
          }}
          disableGutters
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <AcUnit sx={{ fontSize: 32, color: "#1da1f2" }} />
          </ListItemIcon>
        </ListItem>

        <List>
          <SidebarItem icon={<Home />} label="Home" />
          <SidebarItem icon={<TravelExplore />} label="Explore" />
          <SidebarItem icon={<Notifications />} label="Notifications" />
          <SidebarItem icon={<MailOutline />} label="Messages" />
          <SidebarItem icon={<BookmarkBorder />} label="Bookmarks" />
          <SidebarItem icon={<Person />} label="Profile" />
          <SidebarItem icon={<Settings />} label="Settings" />
          <Button
            fullWidth
            variant="contained"
            onClick={onPostOpen}
            sx={{
              bgcolor: "#fff",
              color: "#000",
              fontWeight: "bold",
              borderRadius: 9999,
              textTransform: "none",
              fontSize: 16,
              py: 1.2,
              "&:hover": {
                bgcolor: "#e6e6e6",
              },
            }}
          >
            Post
          </Button>
        </List>
      </Box>
    </Box>
  );
}

function SidebarItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <ListItemButton sx={{ borderRadius: 3, px: 2, py: 1, mb: 1 }}>
      <ListItemIcon sx={{ color: "#fff", minWidth: 36 }}>{icon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography sx={{ color: "#fff", fontWeight: 500 }}>
            {label}
          </Typography>
        }
      />
    </ListItemButton>
  );
}
