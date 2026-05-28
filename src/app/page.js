"use client";

import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { useEffect, useState, useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
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

export default function HomePage() {
  const { data: session } = useSession();
  const { addToCart, count } = useCart();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const featured = d.filter((p) => p.featured === true);
        setProducts(featured.length > 0 ? featured : d.slice(0, 4));
        setProductsLoading(false);
      });
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ล็อค scroll เมื่อเมนูเปิด
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
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="/"
            className={`text-xl font-black tracking-tight transition-colors duration-300 ${scrolled ? "text-gray-900" : "text-white"}`}
          >
            MYSHOP
          </a>

          {/* Desktop nav */}
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
            {/* Desktop links */}
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

            {/* Cart */}
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

            {/* Hamburger (mobile only) */}
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

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative h-screen overflow-hidden bg-gray-950 flex items-center"
      >
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-6 pt-16">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.3em" }}
            animate={{ opacity: 1, letterSpacing: "0.2em" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-gray-400 text-xs font-semibold tracking-[0.25em] uppercase mb-6"
          >
            New Collection 2026
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-white font-black leading-none mb-8"
            style={{ fontSize: "clamp(2.5rem, 8vw, 8rem)" }}
          >
            WEAR YOUR
            <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px white" }}
            >
              STORY
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-gray-400 text-base md:text-lg max-w-md mb-10"
          >
            คอลเลกชันใหม่ล่าสุด ดีไซน์เรียบหรู สวมใส่สบายทุกโอกาส
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex gap-3 flex-wrap"
          >
            <a
              href="/products"
              className="bg-white text-gray-900 px-6 py-3.5 md:px-8 md:py-4 font-bold text-sm tracking-wider uppercase hover:bg-gray-100 transition-all duration-300 active:scale-95"
            >
              ช้อปเลย
            </a>
            <a
              href="/products"
              className="border border-white/30 text-white px-6 py-3.5 md:px-8 md:py-4 font-medium text-sm tracking-wider uppercase hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              ดูคอลเลกชัน
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-xs tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="bg-gray-900 text-white py-4 overflow-hidden">
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

      {/* ── FEATURED PRODUCTS ── */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <FadeUp>
          <div className="flex justify-between items-end mb-10 md:mb-14">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase mb-3">
                สินค้าแนะนำ
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                BEST SELLERS
              </h2>
            </div>
            <a
              href="/products"
              className="text-sm font-semibold tracking-wide underline underline-offset-4 hover:opacity-60 transition hidden md:block"
            >
              ดูทั้งหมด →
            </a>
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {productsLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, i) => (
                <FadeUp key={product.id} delay={i * 0.1}>
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
                          {product.image || "👕"}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

                      {/* ปุ่มเพิ่มลงตะกร้า: มือถือแสดงตลอด, เดสก์ท็อป hover */}
                      <div className="absolute bottom-0 left-0 right-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="w-full bg-white text-gray-900 py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-colors duration-300"
                        >
                          เพิ่มลงตะกร้า
                        </button>
                      </div>

                      {i === 0 && (
                        <span className="absolute top-3 left-3 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 tracking-wider uppercase">
                          New
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs md:text-sm font-semibold tracking-wide mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500">
                      ฿{product.price.toLocaleString()}
                    </p>
                  </a>
                </FadeUp>
              ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <a
            href="/products"
            className="border border-gray-900 text-gray-900 px-8 py-3 text-sm font-bold tracking-wider uppercase hover:bg-gray-900 hover:text-white transition inline-block"
          >
            ดูสินค้าทั้งหมด
          </a>
        </div>
      </section>

      {/* ── BRAND SECTION ── */}
      <FadeUp>
        <section className="bg-gray-950 text-white py-24 md:py-32 px-6 text-center">
          <p className="text-gray-500 text-xs tracking-[0.3em] uppercase mb-6">
            Our Philosophy
          </p>
          <h2
            className="font-black leading-none mb-8 max-w-4xl mx-auto"
            style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}
          >
            QUALITY OVER
            <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "1.5px white" }}
            >
              EVERYTHING
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            ทุกชิ้นผ่านการคัดสรรอย่างพิถีพิถัน
            เพื่อให้คุณได้สวมใส่สิ่งที่ดีที่สุด
          </p>
        </section>
      </FadeUp>

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
