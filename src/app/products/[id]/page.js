"use client";

import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart, count } = useCart();
  const { data: session } = useSession();
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => setProduct(d));
  }, [id]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function handleAddToCart() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (!product) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── NAVBAR ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur border-b border-gray-200" : "bg-gray-950"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className={`text-xl font-black tracking-tight transition-colors duration-300 ${scrolled ? "text-gray-900" : "text-white"}`}>
            MYSHOP
          </a>

          <div className="flex items-center gap-4 md:gap-6">
            <a href="/products" className={`text-sm font-medium hover:opacity-60 transition-opacity hidden md:block ${scrolled ? "text-gray-900" : "text-white"}`}>
              ← กลับหน้าสินค้า
            </a>

            {/* Desktop auth */}
            {session ? (
              <>
                <a href="/orders" className={`text-sm font-medium hidden md:block hover:opacity-60 ${scrolled ? "text-gray-700" : "text-white/90"}`}>ออเดอร์ของฉัน</a>
                <button onClick={() => signOut()} className={`text-sm font-medium hidden md:block ${scrolled ? "text-red-400 hover:text-red-600" : "text-white/70 hover:text-white"}`}>ออกจากระบบ</button>
              </>
            ) : (
              <a href="/login" className={`text-sm font-medium hidden md:block hover:opacity-60 ${scrolled ? "text-gray-700" : "text-white/90"}`}>เข้าสู่ระบบ</a>
            )}

            {/* Cart */}
            <a href="/cart" className="relative">
              <svg className={`w-5 h-5 transition-colors duration-300 ${scrolled ? "text-gray-900" : "text-white"}`}
                fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </a>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-1" aria-label="เมนู">
              <span className={`block w-5 h-0.5 transition-all duration-300 ${scrolled ? "bg-gray-900" : "bg-white"} ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 transition-all duration-300 ${scrolled ? "bg-gray-900" : "bg-white"} ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 transition-all duration-300 ${scrolled ? "bg-gray-900" : "bg-white"} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
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
              <a href="/products" onClick={() => setMenuOpen(false)}
                className="text-white text-2xl font-black tracking-tight hover:opacity-60 transition-opacity">
                ← กลับหน้าสินค้า
              </a>
              <a href="/products" onClick={() => setMenuOpen(false)}
                className="text-white text-2xl font-black tracking-tight hover:opacity-60 transition-opacity">
                สินค้าทั้งหมด
              </a>

              <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
                {session ? (
                  <>
                    <p className="text-gray-400 text-sm">สวัสดี, {session.user.name}</p>
                    <a href="/profile" onClick={() => setMenuOpen(false)} className="text-white text-lg font-semibold hover:opacity-60">โปรไฟล์</a>
                    <a href="/orders" onClick={() => setMenuOpen(false)} className="text-white text-lg font-semibold hover:opacity-60">ออเดอร์ของฉัน</a>
                    <button onClick={() => { signOut(); setMenuOpen(false); }} className="text-red-400 text-lg font-semibold text-left hover:opacity-60">ออกจากระบบ</button>
                  </>
                ) : (
                  <>
                    <a href="/login" onClick={() => setMenuOpen(false)} className="text-white text-lg font-semibold hover:opacity-60">เข้าสู่ระบบ</a>
                    <a href="/register" onClick={() => setMenuOpen(false)} className="bg-white text-gray-900 px-6 py-3 text-sm font-bold tracking-widest uppercase text-center">สมัครสมาชิก</a>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-16 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

          {/* รูปสินค้า */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-square bg-gray-100 overflow-hidden"
          >
            {product.image?.startsWith("http") ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl md:text-9xl">
                {product.image || "📦"}
              </div>
            )}
          </motion.div>

          {/* รายละเอียด */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5 md:gap-6 pt-0 md:pt-4"
          >
            {product.featured && (
              <span className="text-xs font-bold tracking-widest uppercase text-yellow-500">
                ⭐ สินค้าแนะนำ
              </span>
            )}

            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
              {product.name}
            </h1>

            <p className="text-2xl md:text-3xl font-bold">
              ฿{product.price.toLocaleString()}
            </p>

            <p className="text-gray-500 leading-relaxed text-sm md:text-base">
              {product.description}
            </p>

            <div className="border-t border-gray-100 pt-5 md:pt-6">
              {product.stock === 0 ? (
                <p className="text-red-500 font-semibold text-sm mb-4">สินค้าหมดแล้ว</p>
              ) : product.stock <= 3 ? (
                <p className="text-orange-500 font-semibold text-sm mb-4">เหลือเพียง {product.stock} ชิ้น!</p>
              ) : (
                <p className="text-green-600 font-semibold text-sm mb-4">มีสินค้า · {product.stock} ชิ้น</p>
              )}

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                  added
                    ? "bg-green-600 text-white"
                    : product.stock === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-700 active:scale-95"
                }`}
              >
                {added ? "✓ เพิ่มแล้ว!" : product.stock === 0 ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
              </button>

              <a href="/cart"
                className="block w-full mt-3 py-4 text-sm font-bold tracking-widest uppercase text-center border border-gray-900 hover:bg-gray-50 transition"
              >
                ดูตะกร้า
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-200 px-6 py-10">
        <div className="max-w-7xl mx-auto flex justify-center">
          <p className="text-gray-400 text-sm">© 2026 MyShop. All rights reserved.</p>
        </div>
      </footer>

    </main>
  );
}