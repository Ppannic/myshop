"use client";

import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { cart, removeFromCart, total, count } = useCart();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      {/* ── NAVBAR ── */}
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

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span
                  className={`text-sm hidden md:block transition-colors duration-300 ${scrolled ? "text-gray-500" : "text-white/80"}`}
                >
                  {session.user.name}
                </span>
                <a
                  href="/orders"
                  className={`text-sm font-medium hidden md:block hover:opacity-60 ${scrolled ? "text-gray-700" : "text-white/90"}`}
                >
                  ออเดอร์ของฉัน
                </a>
                <button
                  onClick={() => signOut()}
                  className={`text-sm font-medium hidden md:block hover:opacity-60 transition-opacity ${scrolled ? "text-red-400 hover:text-red-600" : "text-white/70 hover:text-white"}`}
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className={`text-sm font-medium hidden md:block hover:opacity-60 transition-opacity ${scrolled ? "text-gray-700" : "text-white/90"}`}
                >
                  เข้าสู่ระบบ
                </a>
                <a
                  href="/register"
                  className={`text-sm font-bold px-4 py-2 transition-all duration-300 hidden md:block ${
                    scrolled
                      ? "bg-gray-900 text-white hover:bg-gray-700"
                      : "bg-white text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  สมัครสมาชิก
                </a>
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

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-1"
              aria-label="เมนู"
            >
              <span
                className={`block w-5 h-0.5 transition-all duration-300 ${scrolled ? "bg-gray-900" : "bg-white"} ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 transition-all duration-300 ${scrolled ? "bg-gray-900" : "bg-white"} ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 transition-all duration-300 ${scrolled ? "bg-gray-900" : "bg-white"} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-gray-950 flex flex-col pt-24 px-8 pb-10 md:hidden"
          >
            <nav className="flex flex-col gap-6 flex-1">
              {[
                { label: "สินค้า", href: "/products" },
                { label: "คอลเลกชัน", href: "#" },
                { label: "เกี่ยวกับ", href: "#" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-white text-2xl font-black tracking-tight hover:opacity-60 transition-opacity"
                >
                  {item.label}
                </a>
              ))}
              <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
                {session ? (
                  <>
                    <p className="text-gray-400 text-sm">
                      สวัสดี, {session.user.name}
                    </p>
                    <a
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="text-white text-lg font-semibold hover:opacity-60"
                    >
                      โปรไฟล์
                    </a>
                    <a
                      href="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="text-white text-lg font-semibold hover:opacity-60"
                    >
                      ออเดอร์ของฉัน
                    </a>
                    <button
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                      }}
                      className="text-red-400 text-lg font-semibold text-left hover:opacity-60"
                    >
                      ออกจากระบบ
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="text-white text-lg font-semibold hover:opacity-60"
                    >
                      เข้าสู่ระบบ
                    </a>
                    <a
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="bg-white text-gray-900 px-6 py-3 text-sm font-bold tracking-widest uppercase text-center"
                    >
                      สมัครสมาชิก
                    </a>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PAGE HEADER ── */}
      <section className="bg-gray-950 pt-28 pb-10 md:pt-32 md:pb-16 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gray-400 text-xs font-semibold tracking-[0.25em] uppercase mb-4"
        >
          Shopping Cart
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white font-black text-4xl md:text-7xl tracking-tight"
        >
          ตะกร้า
          <span
            className="text-transparent ml-3 md:ml-4"
            style={{ WebkitTextStroke: "2px white" }}
          >
            สินค้า
          </span>
        </motion.h1>
      </section>

      {/* ── CONTENT ── */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16">
        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-24"
          >
            <p className="text-6xl mb-6">🛒</p>
            <p className="text-gray-400 text-lg mb-8 tracking-wide">
              ตะกร้าของคุณว่างเปล่า
            </p>
            <a
              href="/products"
              className="bg-gray-900 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-700 transition inline-block"
            >
              เลือกสินค้า
            </a>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Cart Items */}
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4 md:gap-6 border-b border-gray-100 pb-5 md:pb-6"
                >
                  {/* รูปสินค้า */}
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 overflow-hidden shrink-0">
                    {item.image?.startsWith("http") ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl">
                        {item.image || "📦"}
                      </div>
                    )}
                  </div>

                  {/* ข้อมูล */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 tracking-wide text-sm md:text-base truncate">
                      {item.name}
                    </h4>
                    <p className="text-gray-400 text-xs md:text-sm mt-1">
                      จำนวน: {item.quantity}
                    </p>
                  </div>

                  {/* ราคา + ลบ */}
                  <div className="text-right shrink-0">
                    <p className="font-bold text-base md:text-lg">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition mt-1 tracking-wide"
                    >
                      ลบออก
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="border border-gray-200 p-6 md:p-8 mt-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm tracking-wide">
                  จำนวนสินค้า
                </span>
                <span className="text-sm">{count} ชิ้น</span>
              </div>
              <div className="flex justify-between items-center mb-6 md:mb-8 pt-4 border-t border-gray-100">
                <span className="font-bold tracking-wide uppercase text-sm">
                  รวมทั้งหมด
                </span>
                <span className="text-xl md:text-2xl font-black">
                  ฿{total.toLocaleString()}
                </span>
              </div>
              <a
                href="/checkout"
                className="w-full bg-gray-900 text-white py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-700 transition block text-center"
              >
                ชำระเงิน
              </a>
              <a
                href="/products"
                className="w-full border border-gray-200 text-gray-500 py-4 text-sm font-medium tracking-wide hover:border-gray-900 hover:text-gray-900 transition block text-center mt-3"
              >
                เลือกสินค้าเพิ่ม
              </a>
            </motion.div>
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
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
