import { useState, useEffect, useCallback } from "react";
import { fetchUserFollowings, fetchUserFollowers } from "../profileActions";
import { ApiResponse, UserSimple } from "@/interface/interfaces";
import { fetchUser } from "@/app/common/components/commonActions";

export default function useUserProfile(
  token: string | null,
  username: string | null
) {
  const [user, setUser] = useState<UserSimple | null>(null);
  const [followings, setFollowings] = useState<UserSimple[]>([]);
  const [followers, setFollowers] = useState<UserSimple[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfileData = useCallback(async () => {
    if (!token || !username) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetchUser(token, username);
      const fetchedUser = (res.data as ApiResponse).data;
      setUser(fetchedUser);

      const followingRes = await fetchUserFollowings(token, fetchedUser.id, 0);
      setFollowings((followingRes.data as ApiResponse).data.content || []);

      const followersRes = await fetchUserFollowers(token, fetchedUser.id, 0);
      setFollowers((followersRes.data as ApiResponse).data.content || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [token, username]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  return {
    user,
    followings,
    followers,
    loading,
    error,
    reload: loadProfileData,
    setUser,
  };
}
