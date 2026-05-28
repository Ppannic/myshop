"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/session");
    const session = await res.json();

    if (session?.user?.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/";
    }
  }

  const inputClass =
    "w-full border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-200 text-sm";

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      {/* NAVBAR */}
      <header className="bg-gray-950 px-6 h-16 flex items-center">
        <a href="/" className="text-xl font-black tracking-tight text-white">
          MYSHOP
        </a>
      </header>

      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-400 mb-3">
              Welcome Back
            </p>
            <h1 className="text-4xl font-black tracking-tight text-gray-900">
              เข้าสู่
              <span
                className="text-transparent ml-3"
                style={{ WebkitTextStroke: "2px #111" }}
              >
                ระบบ
              </span>
            </h1>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">
                อีเมล
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">
                รหัสผ่าน
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="รหัสผ่านของคุณ"
                required
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-700 transition-colors duration-300 disabled:opacity-50 mt-2"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            ยังไม่มีบัญชี?{" "}
            <a
              href="/register"
              className="text-gray-900 font-bold hover:opacity-60 transition-opacity"
            >
              สมัครสมาชิก
            </a>
          </p>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-center">
          <p className="text-gray-400 text-sm">
            © 2026 MyShop. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
