"use client";

import { useState } from "react";
import Image from "next/image";

export default function AuthForm({ type }) {
  const isLogin = type === "signin";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(form);

//     // TODO: connect backend API later
//   };


const handleSubmit = async (e) => {
  e.preventDefault();

  const url = isLogin
    ? "http://localhost:5000/api/auth/signin"
    : "http://localhost:5000/api/auth/signup";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error");
      return;
    }

    if (isLogin) {
      localStorage.setItem("token", data.token);
      // alert("Login successful");

      // redirect
      window.location.href = "/";
    } else {
      alert("Signup successful");
      window.location.href = "/signin";
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};


  return (
    <div className="flex min-h-screen items-center justify-center">
     
      
      <Image
        src="/loginimage.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
       <div className="absolute inset-0 bg-black/50"></div>
       
      
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-2xl border border-white/20 p-8 shadow-xl  bg-white/10 backdrop-blur-lg"
      >
        <h2 className="mb-6 text-center text-white text-2xl font-bold">
          {isLogin ? "Sign In" : "Sign Up"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            className="mb-4 w-full rounded-lg border border-white/20 p-3 text-gray-200"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded-lg border border-white/20 p-3 text-gray-200"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full rounded-lg border border-white/20 p-3 text-gray-200"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-500 p-3 text-white hover:bg-blue-600 cursor-pointer"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="mt-4 text-center text-gray-200 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <a
            href={isLogin ? "/signup" : "/signin"}
            className="ml-1 text-blue-500"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </a>
        </p>
      </form>
    </div>
  );
}