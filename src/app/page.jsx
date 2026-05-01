"use client";

import { useEffect, useState } from "react";

// Clear Cache Storage outside component
if (typeof window !== "undefined" && "caches" in window) {
  caches.keys().then((cacheNames) => {
    Promise.all(cacheNames.map((name) => caches.delete(name)));
  });
}

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearBrowserData = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      clearBrowserData();
      window.location.href = "/signin";
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        clearBrowserData();
        window.location.href = "/signin";
        return;
      }

      setUser(payload);
    } catch {
      clearBrowserData();
      window.location.href = "/signin";
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    clearBrowserData();
    window.location.href = "/signin";
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1>You're Successfully Logged In</h1>
      {user && <p>Welcome, {user.email}</p>}
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}