import { deletePost, updatePost } from "../components/commonActions";

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
