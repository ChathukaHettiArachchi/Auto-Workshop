"use client";

import { useState } from "react";

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
      alert("Login successful");

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#dbe6ea] to-[#7fc3d6]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-gray-400 p-8 shadow-xl hover:shadow-2xl transition-all duration-300  bg-gray-200"
      >
        <h2 className="mb-6 text-center text-black text-2xl font-bold">
          {isLogin ? "Sign In" : "Sign Up"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            className="mb-4 w-full rounded-lg border p-3 text-black"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded-lg border p-3 text-black"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full rounded-lg border p-3 text-black"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-500 p-3 text-white hover:bg-blue-600"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="mt-4 text-center text-black text-sm">
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