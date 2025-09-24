import { useState, useEffect, useCallback } from "react";
import { ApiResponse, UserSimple, JwtPayload } from "@/interface/interfaces";
import { jwtDecode } from "jwt-decode";
import { fetchUser } from "@/app/common/commonActions";

export default function useUser(token: string | null) {
  const [user, setUser] = useState<UserSimple | null>(null);
  const [ownUsername, setOwnUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    if (!token) return;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setOwnUsername(decoded.sub);
      const res = await fetchUser(token, decoded.sub);
      setUser(res.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch user");
    }
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return { user, ownUsername, error, reload: loadUser, setUser };
}
