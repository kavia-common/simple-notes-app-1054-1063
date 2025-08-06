"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) router.replace("/notes");
      else router.replace("/login");
    }
    // eslint-disable-next-line
  }, [user, isLoading]);

  return (
    <div style={{ display: "grid", placeContent: "center", minHeight: "100vh" }}>
      Loading...
    </div>
  );
}
