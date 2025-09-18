"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Typography, CircularProgress, Button } from "@mui/material";

import useAuthToken from "../common/hooks/useAuthToken";
import useUserPosts from "./hooks/useUserPosts";

import ProfileHeader from "./components/ProfileHeader";
import EditProfileDialog from "./components/EditProfileDialog";
import EditPostDialog from "../common/components/EditPostDialog";
import PostList from "../common/components/PostList";
import ThreeColumnLayout from "../layouts/ThreeColumnLayout";
import Sidebar from "../common/components/Sidebar";
import Trending from "../common/components/Trending";
import NewPostDialog from "../common/components/NewPostDialog";
import {
  handleFormChange,
  handleImageUpload,
  handleProfileSave,
} from "./handlers/ProfileHandlers";
import {
  handleDeletePost,
  handleEditPost,
} from "../common/handlers/commonHandlers";
import useUserProfile from "./hooks/useUserProfile";

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const usernameParam = params?.username as string | undefined;

  const { token, ownUsername } = useAuthToken();

  const {
    user,
    followings,
    followers,
    loading: userLoading,
    error: userError,
    setUser,
    reload: reloadProfile,
  } = useUserProfile(token, usernameParam ?? null);

  const {
    posts,
    loading: postsLoading,
    error: postsError,
    reload: reloadPosts,
  } = useUserPosts(token, user);

  const [form, setForm] = useState({
    email: "",
    username: "",
    name: "",
    bio: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [uploading, setUploading] = useState({ profile: false, cover: false });

  const [postOpen, setPostOpen] = useState(false);
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editingPost, setEditingPost] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && user) {
      setForm({
        email: user.email,
        username: user.username,
        name: user.name,
        bio: user.bio || "",
      });
      setSaveError(null);
    }
  }, [isEditing, user]);

  if (userLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (userError) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error" mb={2}>
          {userError}
        </Typography>
        <Button variant="contained" onClick={() => router.push("/login")}>
          Go to Login
        </Button>
      </Container>
    );
  }

  if (!user) return null;

  return (
    <ThreeColumnLayout
      left={
        <Sidebar onPostOpen={() => setPostOpen(true)} username={ownUsername} />
      }
      center={
        token && (
          <>
            <ProfileHeader
              user={user}
              followings={followings}
              followers={followers}
              onEditClick={() => setIsEditing(true)}
              isOwnUser={ownUsername === usernameParam}
              isFollowing={user.following}
              token={token}
              reload={reloadProfile}
            />

            <EditProfileDialog
              open={isEditing}
              onClose={() => setIsEditing(false)}
              user={user}
              form={form}
              onFormChange={(e) => handleFormChange(e, setForm)}
              onSave={() =>
                handleProfileSave(
                  token,
                  form,
                  setSaving,
                  setSaveError,
                  setUser,
                  setIsEditing
                )
              }
              saving={saving}
              saveError={saveError}
              handleImageUpload={(file, type) =>
                handleImageUpload(token, file, type, setUploading, setUser)
              }
              profileUploading={uploading.profile}
              coverUploading={uploading.cover}
            />

            <EditPostDialog
              open={editPostId !== null}
              onClose={() => setEditPostId(null)}
              editText={editText}
              setEditText={setEditText}
              editingPost={editingPost}
              editError={editError}
              onSave={() =>
                handleEditPost(
                  token,
                  editPostId,
                  editText,
                  setEditingPost,
                  setEditError,
                  setEditPostId,
                  setEditText,
                  reloadPosts
                )
              }
            />

            {ownUsername === usernameParam && (
              <NewPostDialog
                open={postOpen}
                profilePicture={user.profilePicture}
                onClose={() => setPostOpen(false)}
                onPostSuccess={reloadPosts}
              />
            )}

            <PostList
              posts={posts}
              ownUsername={user.username}
              loading={postsLoading}
              error={postsError}
              onEdit={(post) => {
                setEditPostId(post.id);
                setEditText(post.text);
              }}
              onDelete={(id) => handleDeletePost(token, id, reloadPosts)}
              onRepost={reloadPosts}
            />
          </>
        )
      }
      right={<Trending />}
    />
  );
}
