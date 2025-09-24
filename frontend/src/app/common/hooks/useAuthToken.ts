import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  [key: string]: unknown;
}

export default function useAuthToken() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [ownUsername, setOwnUsername] = useState<string | null>(null);

  useEffect(() => {
    const authToken = localStorage.getItem("AUTH_TOKEN");
    if (!authToken) {
      router.push("/login");
      return;
    }
    setToken(authToken);

    try {
      const decoded = jwtDecode<DecodedToken>(authToken);
      setOwnUsername(decoded.sub);
    } catch {
      router.push("/login");
    }
  }, [router]);

  return { token, ownUsername };
}
