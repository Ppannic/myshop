"use client";

import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ProductCardSkeleton } from "@/components/Skeleton";

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function ProductsPage() {
  const { addToCart, count } = useCart();
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [sort]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  async function fetchProducts() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  function handleSearch(e) {
    e.preventDefault();
    fetchProducts();
  }

  function handleReset() {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setFilterOpen(false);
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d));
  }

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
                <a
                  href="/profile"
                  className={`text-sm font-medium hidden md:block hover:opacity-60 transition-opacity ${scrolled ? "text-gray-700" : "text-white/90"}`}
                >
                  โปรไฟล์
                </a>
                <a
                  href="/orders"
                  className={`text-sm font-medium hidden md:block hover:opacity-60 transition-opacity ${scrolled ? "text-gray-700" : "text-white/90"}`}
                >
                  ออเดอร์ของฉัน
                </a>
                <button
                  onClick={() => signOut()}
                  className={`text-sm font-medium hidden md:block transition-colors duration-300 ${scrolled ? "text-red-400 hover:text-red-600" : "text-white/70 hover:text-white"}`}
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className={`text-sm font-medium hidden md:block hover:opacity-60 ${scrolled ? "text-gray-700" : "text-white/90"}`}
                >
                  เข้าสู่ระบบ
                </a>
                <a
                  href="/register"
                  className={`text-sm font-bold px-4 py-2 hidden md:block transition-all duration-300 ${scrolled ? "bg-gray-900 text-white hover:bg-gray-700" : "bg-white text-gray-900 hover:bg-gray-100"}`}
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
      <section className="bg-gray-950 pt-28 pb-12 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gray-400 text-xs font-semibold tracking-[0.25em] uppercase mb-4"
        >
          All Products
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white font-black text-4xl md:text-7xl tracking-tight"
        >
          สินค้า
          <span
            className="text-transparent ml-3 md:ml-4"
            style={{ WebkitTextStroke: "2px white" }}
          >
            ทั้งหมด
          </span>
        </motion.h1>
      </section>

      {/* ── MARQUEE ── */}
      <div className="bg-gray-900 text-white py-3 overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap text-xs font-semibold tracking-[0.2em] uppercase text-gray-400"
        >
          {Array(8)
            .fill([
              "NEW COLLECTION",
              "FREE SHIPPING",
              "PREMIUM QUALITY",
              "BEST SELLER",
            ])
            .flat()
            .map((t, i) => (
              <span key={i}>
                {t} <span className="text-white/20 mx-4">·</span>
              </span>
            ))}
        </motion.div>
      </div>

      {/* ── SEARCH & FILTER ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-2">
        {/* Desktop filter */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาสินค้า..."
              className="flex-1 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-700 transition"
            >
              ค้นหา
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="ราคาต่ำสุด"
              className="w-32 border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors"
            />
            <span className="text-gray-400 text-sm">—</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="ราคาสูงสุด"
              className="w-32 border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 bg-white"
          >
            <option value="newest">ใหม่ล่าสุด</option>
            <option value="oldest">เก่าสุด</option>
            <option value="price_asc">ราคา: ต่ำ → สูง</option>
            <option value="price_desc">ราคา: สูง → ต่ำ</option>
          </select>
          <button
            type="button"
            onClick={handleReset}
            className="border border-gray-200 px-4 py-3 text-xs font-bold tracking-widest uppercase text-gray-500 hover:border-gray-900 hover:text-gray-900 transition"
          >
            รีเซ็ต
          </button>
        </form>

        {/* Mobile filter bar */}
        <div className="md:hidden flex gap-2">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาสินค้า..."
              className="flex-1 border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 transition-colors"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2.5 text-xs font-bold tracking-widest uppercase"
            >
              ค้นหา
            </button>
          </form>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="border border-gray-200 px-3 py-2.5 text-xs font-bold text-gray-600 hover:border-gray-900 transition flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4h18M7 12h10M11 20h2"
              />
            </svg>
            ตัวกรอง
          </button>
        </div>

        {/* Mobile filter dropdown */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-3 pt-3 pb-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="ราคาต่ำสุด"
                    className="flex-1 border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900"
                  />
                  <span className="text-gray-400 self-center">—</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="ราคาสูงสุด"
                    className="flex-1 border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900"
                  />
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 bg-white"
                >
                  <option value="newest">ใหม่ล่าสุด</option>
                  <option value="oldest">เก่าสุด</option>
                  <option value="price_asc">ราคา: ต่ำ → สูง</option>
                  <option value="price_desc">ราคา: สูง → ต่ำ</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      fetchProducts();
                      setFilterOpen(false);
                    }}
                    className="flex-1 bg-gray-900 text-white py-2.5 text-xs font-bold tracking-widest uppercase"
                  >
                    กรอง
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 border border-gray-200 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-widest"
                  >
                    รีเซ็ต
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-gray-400 mt-3 tracking-wide">
          {loading ? "กำลังโหลด..." : `แสดง ${products.length} รายการ`}
        </p>
      </section>

      {/* ── PRODUCTS GRID ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg mb-6">
              ไม่พบสินค้าที่ค้นหาครับ
            </p>
            <button
              onClick={handleReset}
              className="bg-gray-900 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-700 transition"
            >
              ดูสินค้าทั้งหมด
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {products.map((product, i) => (
              <FadeUp key={product.id} delay={i * 0.05}>
                <a
                  href={`/products/${product.id}`}
                  className="group cursor-pointer block"
                >
                  <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-3">
                    {product.image?.startsWith("http") ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl md:text-7xl bg-gray-50">
                        {product.image || "📦"}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

                    {/* ปุ่ม: มือถือเห็นตลอด, เดสก์ท็อป hover */}
                    <div className="absolute bottom-0 left-0 right-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="w-full bg-white text-gray-900 py-2.5 md:py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-colors duration-300"
                      >
                        เพิ่มลงตะกร้า
                      </button>
                    </div>

                    {product.stock <= 3 && product.stock > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase">
                        เหลือน้อย
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute top-2 left-2 bg-gray-500 text-white text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase">
                        หมด
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs md:text-sm font-semibold tracking-wide mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-1 line-clamp-1">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs md:text-sm font-bold">
                      ฿{product.price.toLocaleString()}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-400">
                      เหลือ {product.stock} ชิ้น
                    </p>
                  </div>
                </a>
              </FadeUp>
            ))}
          </div>
        )}
      </section>

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
