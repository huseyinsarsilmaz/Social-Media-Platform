import {
  deletePost,
  likePost,
  repostPost,
  unlikePost,
  unrepostPost,
  updatePost,
} from "../components/commonActions";

export async function handleDeletePost(
  token: string | null,
  id: number,
  reload: () => Promise<void>
) {
  if (!token || !confirm("Delete this post?")) return;
  try {
    await deletePost(token, id);
    await reload();
  } catch (err: any) {
    alert(err?.response?.data?.message || "Failed to delete post");
  }
}

export async function handleEditPost(
  token: string | null,
  editPostId: number | null,
  editText: string,
  setEditingPost: React.Dispatch<React.SetStateAction<boolean>>,
  setEditError: React.Dispatch<React.SetStateAction<string | null>>,
  setEditPostId: React.Dispatch<React.SetStateAction<number | null>>,
  setEditText: React.Dispatch<React.SetStateAction<string>>,
  reload: () => Promise<void>
) {
  if (!token || !editPostId) return;
  setEditingPost(true);
  setEditError(null);
  try {
    await updatePost(token, editPostId, editText);
    setEditPostId(null);
    setEditText("");
    await reload();
  } catch (err: any) {
    setEditError(err?.response?.data?.message || "Update failed");
  } finally {
    setEditingPost(false);
  }
}

export const handleLikeButtonClick = async (
  liked: boolean,
  token: string | null,
  postId: number,
  setLiked: React.Dispatch<React.SetStateAction<boolean>>,
  reload: () => Promise<void>
) => {
  try {
    if (token) {
      if (liked) {
        await unlikePost(token, postId);
        setLiked(false);
        reload();
      } else {
        await likePost(token, postId);
        setLiked(true);
        reload();
      }
    }
  } catch (err) {
    console.error("Failed to toggle like:", err);
  }
};

export const handleRepostButtonClick = async (
  reposted: boolean,
  token: string | null,
  postId: number,
  setReposted: React.Dispatch<React.SetStateAction<boolean>>,
  setRepostCount: React.Dispatch<React.SetStateAction<number>>,
  reload: () => Promise<void>
) => {
  try {
    if (token) {
      if (reposted) {
        await unrepostPost(token, postId);
        setReposted(false);
        setRepostCount((prev) => prev - 1);
        await reload();
      } else {
        await repostPost(token, postId);
        setReposted(true);
        setRepostCount((prev) => prev + 1);
        await reload();
      }
    }
  } catch (err) {
    console.error("Failed to toggle like:", err);
  }
};
