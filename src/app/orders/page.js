"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { OrderSkeleton } from "@/components/Skeleton";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const { count } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/orders?mine=true")
        .then((r) => r.json())
        .then((d) => {
          setOrders(d);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-8">กรุณาเข้าสู่ระบบก่อนครับ</p>
          <a href="/login"
            className="bg-gray-900 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-700 transition inline-block">
            เข้าสู่ระบบ
          </a>
        </div>
      </main>
    );
  }

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

          <nav className="hidden md:flex gap-8">
            {["สินค้า", "คอลเลกชัน", "เกี่ยวกับ"].map((item, i) => (
              <a key={i} href={i === 0 ? "/products" : "#"}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:opacity-60 ${scrolled ? "text-gray-900" : "text-white"}`}>
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <a href="/orders" className={`text-sm font-medium hidden md:block hover:opacity-60 transition-opacity ${scrolled ? "text-gray-700" : "text-white/90"}`}>
                  ออเดอร์ของฉัน
                </a>
                <button onClick={() => signOut()}
                  className={`text-sm font-medium hidden md:block transition-colors duration-300 ${scrolled ? "text-red-400 hover:text-red-600" : "text-white/70 hover:text-white"}`}>
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <a href="/login" className={`text-sm font-medium hidden md:block hover:opacity-60 transition-opacity ${scrolled ? "text-gray-700" : "text-white/90"}`}>
                เข้าสู่ระบบ
              </a>
            )}

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
              {[{ label: "สินค้า", href: "/products" }, { label: "คอลเลกชัน", href: "#" }, { label: "เกี่ยวกับ", href: "#" }].map((item) => (
                <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
                  className="text-white text-2xl font-black tracking-tight hover:opacity-60 transition-opacity">
                  {item.label}
                </a>
              ))}
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

      {/* ── PAGE HEADER ── */}
      <section className="bg-gray-950 pt-28 pb-10 md:pt-32 md:pb-16 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gray-400 text-xs font-semibold tracking-[0.25em] uppercase mb-4"
        >
          My Orders
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white font-black text-4xl md:text-7xl tracking-tight"
        >
          ออเดอร์
          <span className="text-transparent ml-3 md:ml-4" style={{ WebkitTextStroke: "2px white" }}>
            ของฉัน
          </span>
        </motion.h1>
      </section>

      {/* ── CONTENT ── */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16">
        {loading ? (
          <div className="flex flex-col gap-6">
            {Array(3).fill(0).map((_, i) => <OrderSkeleton key={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <p className="text-gray-400 text-lg mb-8 tracking-wide">ยังไม่มีออเดอร์ครับ</p>
            <a href="/products"
              className="bg-gray-900 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-700 transition inline-block">
              เลือกสินค้า
            </a>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="border border-gray-200 p-5 md:p-8"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-5 md:mb-6 gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">ออเดอร์</p>
                    <p className="font-mono text-xs text-gray-500 truncate">{order.id.slice(0, 16)}...</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString("th-TH")}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1.5 shrink-0 ${
                    order.status === "pending"
                      ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                      : order.status === "approved"
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "bg-red-50 text-red-500 border border-red-200"
                  }`}>
                    {order.status === "pending" ? "⏳ รอตรวจสอบ"
                      : order.status === "approved" ? "✅ อนุมัติแล้ว"
                      : "❌ ถูกปฏิเสธ"}
                  </span>
                </div>

                {/* รายการสินค้า */}
                <div className="flex flex-col gap-3 mb-5 md:mb-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 md:gap-4">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 overflow-hidden shrink-0">
                        {item.product?.image?.startsWith("http") ? (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl md:text-2xl">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{item.product?.name}</p>
                        <p className="text-xs text-gray-400">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold shrink-0">฿{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500 tracking-wide">รวมทั้งหมด</span>
                  <span className="text-lg font-black">฿{order.total.toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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