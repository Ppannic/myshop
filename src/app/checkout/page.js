"use client";

import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import generatePayload from "promptpay-qr";

const PROMPTPAY_NUMBER = "0812345678";

export default function CheckoutPage() {
  const { cart, total, clearCart, count } = useCart();
  const { data: session } = useSession();
  const [qrUrl, setQrUrl] = useState("");
  const [slip, setSlip] = useState(null);
  const [slipPreview, setSlipPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (total > 0) {
      const payload = generatePayload(PROMPTPAY_NUMBER, { amount: total });
      QRCode.toDataURL(payload, { width: 300 }, (err, url) => {
        if (!err) setQrUrl(url);
      });
    }
  }, [total]);

  function handleShippingChange(e) {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  }

  function handleSlipChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSlip(file);
      setSlipPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit() {
    if (!shipping.fullName || !shipping.phone || !shipping.address) {
      return alert("กรุณากรอกข้อมูลที่อยู่จัดส่งให้ครบครับ");
    }
    if (!slip) return alert("กรุณาแนบสลิปก่อนครับ");
    if (!session) return alert("กรุณาเข้าสู่ระบบก่อนครับ");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", slip);
    const uploadRes = await fetch("/api/upload-slip", {
      method: "POST",
      body: formData,
    });
    if (!uploadRes.ok) {
      alert("อัปโหลดสลิปไม่สำเร็จ กรุณาลองใหม่");
      setUploading(false);
      return;
    }
    const { url: slipImage } = await uploadRes.json();

    const orderRes = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        total,
        slipImage,
        fullName: shipping.fullName,
        phone: shipping.phone,
        address: shipping.address,
      }),
    });

    if (!orderRes.ok) {
      alert("บันทึกออเดอร์ไม่สำเร็จ กรุณาติดต่อแอดมิน");
      setUploading(false);
      return;
    }

    clearCart();
    setDone(true);
    setUploading(false);
  }

  if (done) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-7xl mb-8">🎉</p>
          <p className="text-gray-400 text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            Order Confirmed
          </p>
          <h2 className="text-white font-black text-4xl md:text-6xl tracking-tight mb-6">
            ขอบคุณ
            <span className="text-transparent ml-4" style={{ WebkitTextStroke: "2px white" }}>
              มากครับ
            </span>
          </h2>
          <p className="text-gray-400 mb-10">
            เราได้รับออเดอร์ของคุณแล้ว จะรีบจัดส่งให้เร็วที่สุดครับ
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/orders"
              className="bg-white text-gray-900 px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-100 transition inline-block">
              ดูออเดอร์
            </a>
            <a href="/"
              className="border border-white text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white/10 transition inline-block">
              กลับหน้าแรก
            </a>
          </div>
        </motion.div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-8 tracking-wide">ไม่มีสินค้าในตะกร้า</p>
          <a href="/products"
            className="bg-gray-900 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-700 transition inline-block">
            เลือกสินค้า
          </a>
        </div>
      </main>
    );
  }

  const inputClass = "w-full border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-200 text-sm";

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">

      {/* NAVBAR */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur border-b border-gray-200" : "bg-gray-950"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className={`text-xl font-black tracking-tight transition-colors duration-300 ${scrolled ? "text-gray-900" : "text-white"}`}>
            MYSHOP
          </a>
          <div className="flex items-center gap-5">
            {session ? (
              <>
                <span className={`text-sm hidden md:block transition-colors duration-300 ${scrolled ? "text-gray-500" : "text-white/80"}`}>
                  {session.user.name}
                </span>
                <button onClick={() => signOut()}
                  className={`text-sm font-medium hidden md:block hover:opacity-60 transition-opacity ${scrolled ? "text-gray-700" : "text-white/90"}`}>
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <a href="/login"
                className={`text-sm font-medium hover:opacity-60 transition-opacity ${scrolled ? "text-gray-700" : "text-white/90"}`}>
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
          Checkout
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white font-black text-5xl md:text-7xl tracking-tight"
        >
          ชำระ
          <span className="text-transparent ml-4" style={{ WebkitTextStroke: "2px white" }}>
            เงิน
          </span>
        </motion.h1>
      </section>

      {/* CONTENT */}
      <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-6">

        {/* สรุปรายการ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border border-gray-200 p-8"
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">สรุปรายการ</p>
          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 overflow-hidden shrink-0">
                  {item.image?.startsWith("http") ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      {item.image || "📦"}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-gray-400 text-xs">x{item.quantity}</p>
                </div>
                <p className="font-bold text-sm">฿{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-6 pt-6 flex justify-between items-center">
            <span className="text-sm font-bold tracking-wide uppercase">รวมทั้งหมด</span>
            <span className="text-2xl font-black">฿{total.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* ที่อยู่จัดส่ง */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="border border-gray-200 p-8"
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">ที่อยู่จัดส่ง</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">
                ชื่อ-นามสกุลผู้รับ
              </label>
              <input
                name="fullName"
                value={shipping.fullName}
                onChange={handleShippingChange}
                placeholder="เช่น สมชาย ใจดี"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">
                เบอร์โทรศัพท์
              </label>
              <input
                name="phone"
                value={shipping.phone}
                onChange={handleShippingChange}
                placeholder="เช่น 0812345678"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 block">
                ที่อยู่จัดส่ง
              </label>
              <textarea
                name="address"
                value={shipping.address}
                onChange={handleShippingChange}
                placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </motion.div>

        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border border-gray-200 p-8 text-center"
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">สแกน QR เพื่อชำระเงิน</p>
          <p className="text-gray-400 text-sm mb-8">ผ่าน PromptPay / พร้อมเพย์</p>
          {qrUrl && <img src={qrUrl} alt="QR Code" className="mx-auto mb-6" width={220} />}
          <p className="text-3xl font-black">฿{total.toLocaleString()}</p>
        </motion.div>

        {/* อัปโหลดสลิป */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border border-gray-200 p-8"
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">แนบสลิปการโอนเงิน</p>
          <label className="block w-full border-2 border-dashed border-gray-200 cursor-pointer hover:border-gray-900 transition-colors duration-300">
            <input type="file" accept="image/*" onChange={handleSlipChange} className="hidden" />
            {slipPreview ? (
              <img src={slipPreview} alt="slip" className="w-full max-h-64 object-contain" />
            ) : (
              <div className="py-16 flex flex-col items-center gap-3">
                <p className="text-4xl">📎</p>
                <p className="text-gray-400 text-sm tracking-wide">กดเพื่อเลือกรูปสลิป</p>
              </div>
            )}
          </label>

          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="w-full mt-6 bg-gray-900 text-white py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-700 transition disabled:opacity-50"
          >
            {uploading ? "กำลังส่ง..." : "ยืนยันการชำระเงิน"}
          </button>

          <a href="/cart"
            className="block w-full mt-3 py-4 text-sm font-medium tracking-wide text-center border border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900 transition">
            กลับตะกร้า
          </a>
        </motion.div>

      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 px-6 py-10">
        <div className="max-w-7xl mx-auto flex justify-center">
          <p className="text-gray-400 text-sm">© 2026 MyShop. All rights reserved.</p>
        </div>
      </footer>

    </main>
  );
}