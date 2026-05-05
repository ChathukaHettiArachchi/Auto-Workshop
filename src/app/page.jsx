"use client";

import { useEffect, useState } from "react";
import{useRouter} from "next/navigation";

// Clear Cache Storage outside component
if (typeof window !== "undefined" && "caches" in window) {
  caches.keys().then((cacheNames) => {
    Promise.all(cacheNames.map((name) => caches.delete(name)));
  });
}

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
   <div className="min-h-screen bg-gray-900 text-white p-6">
    
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {user && <p className="text-gray-400">Welcome, {user.email}</p>}
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Appointments */}
      <div onClick={() => router.push("/Appointments")} className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-105 transition cursor-pointer">
        <h2 className="text-xl font-semibold mb-2">Appointments</h2>
        <p className="text-gray-400 text-sm">
          Manage your bookings and schedules
        </p>
      </div>

      {/* Vehicle Details */}
      <div onClick={() => router.push("/vehicle-details")} className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-105 transition cursor-pointer">
        <h2 className="text-xl font-semibold mb-2">Vehicle Details</h2>
        <p className="text-gray-400 text-sm">
          View and manage  vehicle information
        </p>
      </div>

      {/* Store */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-105 transition cursor-pointer">
        <h2 className="text-xl font-semibold mb-2">Store</h2>
        <p className="text-gray-400 text-sm">
          Check your Store availability and manage your inventory
        </p>
      </div>

    </div>
  </div>
  );
}