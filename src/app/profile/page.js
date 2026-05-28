"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-8">กรุณาเข้าสู่ระบบก่อนครับ</p>
          <a
            href="/login"
            className="bg-gray-900 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-700 transition inline-block"
          >
            เข้าสู่ระบบ
          </a>
        </div>
      </main>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, currentPassword, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setErrorMsg(data.error);
      return;
    }

    // อัปเดต session ให้แสดงชื่อใหม่
    await update({ name: data.name });
    setSuccessMsg("อัปเดตข้อมูลเรียบร้อยแล้วครับ");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  const inputClass =
    "w-full border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-200 text-sm";

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      {/* NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur border-b border-gray-200"
            : "bg-gray-950"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="/"
            className={`text-xl font-black tracking-tight transition-colors duration-300 ${scrolled ? "text-gray-900" : "text-white"}`}
          >
            MYSHOP
          </a>
          <nav className="hidden md:flex gap-8">
            {["สินค้า", "คอลเลกชัน", "เกี่ยวกับ"].map((item, i) => (
              <a
                key={i}
                href={i === 0 ? "/products" : "#"}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:opacity-60 ${scrolled ? "text-gray-900" : "text-white"}`}
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            {session && (
              <>
                <a
                  href="/orders"
                  className={`text-sm font-medium hidden md:block hover:opacity-60 transition-opacity ${scrolled ? "text-gray-700" : "text-white/90"}`}
                >
                  ออเดอร์ของฉัน
                </a>
                <button
                  onClick={() => signOut()}
                  className={`text-sm font-medium hidden md:block hover:opacity-60 transition-opacity ${scrolled ? "text-gray-700" : "text-white/90"}`}
                >
                  ออกจากระบบ
                </button>
              </>
            )}
            <a href="/cart" className="relative">
              <svg
                className={`w-5 h-5 transition-colors duration-300 ${scrolled ? "text-gray-900" : "text-white"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </a>
          </div>
        </div>
      </header>

      {/* PAGE HEADER */}
      <section className="bg-gray-950 pt-32 pb-16 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gray-400 text-xs font-semibold tracking-[0.25em] uppercase mb-4"
        >
          My Account
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white font-black text-5xl md:text-7xl tracking-tight"
        >
          โปรไฟล์
          <span
            className="text-transparent ml-4"
            style={{ WebkitTextStroke: "2px white" }}
          >
            ของฉัน
          </span>
        </motion.h1>
      </section>

      {/* CONTENT */}
      <div className="max-w-lg mx-auto px-6 py-16">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          {/* ข้อมูลบัญชี */}
          <div className="border border-gray-200 p-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">
              ข้อมูลบัญชี
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">
                  ชื่อ
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={session?.user?.email || ""}
                  disabled
                  className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed`}
                />
                <p className="text-xs text-gray-400 mt-1">
                  ไม่สามารถเปลี่ยนอีเมลได้
                </p>
              </div>
            </div>
          </div>

          {/* เปลี่ยนรหัสผ่าน */}
          <div className="border border-gray-200 p-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">
              เปลี่ยนรหัสผ่าน
            </p>
            <p className="text-xs text-gray-400 mb-6">
              ถ้าไม่ต้องการเปลี่ยน ทิ้งว่างไว้ได้เลยครับ
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">
                  รหัสผ่านปัจจุบัน
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="รหัสผ่านเดิมของคุณ"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">
                  รหัสผ่านใหม่
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">
                  ยืนยันรหัสผ่านใหม่
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="พิมพ์รหัสผ่านใหม่อีกครั้ง"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Messages */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm"
            >
              {errorMsg}
            </motion.div>
          )}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-green-200 bg-green-50 text-green-600 px-4 py-3 text-sm"
            >
              {successMsg}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-700 transition disabled:opacity-50"
          >
            {loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </button>
        </motion.form>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 px-6 py-10">
        <div className="max-w-7xl mx-auto flex justify-center">
          <p className="text-gray-400 text-sm">
            © 2026 MyShop. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
