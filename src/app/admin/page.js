"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("products");
  const { data: session } = useSession({
    required: true,
  });

  useEffect(() => {
    if (session && session.user.role !== "admin") {
      window.location.href = "/";
    }
  }, [session]);

  async function loadProducts() {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
  }

  async function loadOrders() {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  }

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleEditChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function handleEditImage(e) {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  }

  function openEdit(product) {
    setEditForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
    setEditImagePreview(product.image || "");
    setEditImageFile(null);
    setTab("edit");
  }

  async function handleAdd() {
    if (!form.name || !form.price || !form.stock)
      return alert("กรุณากรอกข้อมูลให้ครบ");
    setLoading(true);
    let imageUrl = "";
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const res = await fetch("/api/upload-slip", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      imageUrl = data.url;
    }
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, image: imageUrl }),
    });
    setForm({ name: "", description: "", price: "", stock: "" });
    setImageFile(null);
    setImagePreview("");
    await loadProducts();
    setLoading(false);
    setTab("products");
  }

  async function handleEdit() {
    if (!editForm.name || !editForm.price || !editForm.stock)
      return alert("กรุณากรอกข้อมูลให้ครบ");
    setLoading(true);
    let imageUrl = editImagePreview;
    if (editImageFile) {
      const formData = new FormData();
      formData.append("file", editImageFile);
      const res = await fetch("/api/upload-slip", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      imageUrl = data.url;
    }
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editForm, image: imageUrl }),
    });
    await loadProducts();
    setLoading(false);
    setTab("products");
  }

  async function handleDelete(id) {
    if (!confirm("ยืนยันการลบสินค้านี้?")) return;
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadProducts();
  }

  async function handleToggleFeatured(id, current) {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, featured: !current }),
    });
    await loadProducts();
  }

  async function handleApprove(id) {
    await fetch("/api/orders/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    await loadOrders();
  }

  async function handleReject(id) {
    await fetch("/api/orders/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    });
    await loadOrders();
  }

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">MyShop</h1>
            <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
            {session && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-white text-sm font-medium">
                  {session.user.name}
                </p>
                <p className="text-gray-500 text-xs mb-3">
                  {session.user.email}
                </p>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-xs text-red-400 hover:text-red-300 transition"
                >
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
          <nav className="p-4 flex flex-col gap-2">
            <button
              onClick={() => setTab("products")}
              className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition ${tab === "products" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800"}`}
            >
              สินค้าทั้งหมด
            </button>
            <button
              onClick={() => setTab("add")}
              className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition ${tab === "add" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800"}`}
            >
              เพิ่มสินค้าใหม่
            </button>
            <button
              onClick={() => setTab("orders")}
              className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition ${tab === "orders" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800"}`}
            >
              ออเดอร์
              {orders.filter((o) => o.status === "pending").length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {orders.filter((o) => o.status === "pending").length}
                </span>
              )}
            </button>
            <a
              href="/"
              className="text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 transition"
            >
              กลับหน้าร้าน
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* ── สินค้าทั้งหมด ── */}
          {tab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold">สินค้าทั้งหมด</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {products.length} รายการ
                  </p>
                </div>
                <button
                  onClick={() => setTab("add")}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                >
                  + เพิ่มสินค้า
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-gray-900 rounded-2xl overflow-hidden border transition ${product.featured ? "border-yellow-500" : "border-gray-800 hover:border-gray-700"}`}
                  >
                    {product.image?.startsWith("http") ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-6xl">
                        {product.image || "📦"}
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-white">
                          {product.name}
                        </h3>
                        {product.featured && (
                          <span className="text-[10px] bg-yellow-500 text-gray-900 font-bold px-2 py-0.5 rounded-full ml-2 shrink-0">
                            ⭐ แนะนำ
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <p className="text-blue-400 font-bold">
                              ฿{product.price.toLocaleString()}
                            </p>
                            <p className="text-gray-500 text-xs">
                              stock: {product.stock}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleToggleFeatured(product.id, product.featured)
                            }
                            className={`text-xs px-3 py-1 rounded-lg transition ${product.featured ? "bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-400" : "text-yellow-400 border border-yellow-400/30 hover:bg-yellow-400/10"}`}
                          >
                            {product.featured ? "⭐ แนะนำอยู่" : "☆ ตั้งแนะนำ"}
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-2 rounded-lg transition"
                          >
                            ✏️ แก้ไข
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="flex-1 text-red-400 hover:text-red-300 text-xs px-3 py-2 rounded-lg hover:bg-red-400/10 transition border border-red-400/20"
                          >
                            🗑️ ลบ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── เพิ่มสินค้า ── */}
          {tab === "add" && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-8">เพิ่มสินค้าใหม่</h2>
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex flex-col gap-5">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    รูปสินค้า
                  </label>
                  <label className="block w-full border-2 border-dashed border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="hidden"
                    />
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="w-full h-56 object-cover"
                      />
                    ) : (
                      <div className="h-56 flex flex-col items-center justify-center gap-2">
                        <p className="text-4xl">📷</p>
                        <p className="text-gray-500 text-sm">
                          คลิกเพื่อเลือกรูปสินค้า
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    ชื่อสินค้า
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="เช่น รองเท้าผ้าใบ Nike"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    คำอธิบาย
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="อธิบายสินค้า..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      ราคา (บาท)
                    </label>
                    <input
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      type="number"
                      placeholder="1290"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      จำนวน Stock
                    </label>
                    <input
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      type="number"
                      placeholder="50"
                      className={inputClass}
                    />
                  </div>
                </div>
                <button
                  onClick={handleAdd}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "กำลังเพิ่มสินค้า..." : "เพิ่มสินค้า"}
                </button>
              </div>
            </div>
          )}

          {/* ── แก้ไขสินค้า ── */}
          {tab === "edit" && (
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setTab("products")}
                  className="text-gray-400 hover:text-white transition"
                >
                  ← กลับ
                </button>
                <h2 className="text-2xl font-bold">แก้ไขสินค้า</h2>
              </div>
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex flex-col gap-5">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    รูปสินค้า
                  </label>
                  <label className="block w-full border-2 border-dashed border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImage}
                      className="hidden"
                    />
                    {editImagePreview ? (
                      <img
                        src={editImagePreview}
                        alt="preview"
                        className="w-full h-56 object-cover"
                      />
                    ) : (
                      <div className="h-56 flex flex-col items-center justify-center gap-2">
                        <p className="text-4xl">📷</p>
                        <p className="text-gray-500 text-sm">
                          คลิกเพื่อเปลี่ยนรูป
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    ชื่อสินค้า
                  </label>
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    คำอธิบาย
                  </label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      ราคา (บาท)
                    </label>
                    <input
                      name="price"
                      value={editForm.price}
                      onChange={handleEditChange}
                      type="number"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      จำนวน Stock
                    </label>
                    <input
                      name="stock"
                      value={editForm.stock}
                      onChange={handleEditChange}
                      type="number"
                      className={inputClass}
                    />
                  </div>
                </div>
                <button
                  onClick={handleEdit}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                </button>
              </div>
            </div>
          )}

          {/* ── ออเดอร์ ── */}
          {tab === "orders" && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold">ออเดอร์ทั้งหมด</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {orders.length} รายการ
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {orders.length === 0 && (
                  <div className="text-center py-20 text-gray-500">
                    ยังไม่มีออเดอร์ครับ
                  </div>
                )}
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-900 rounded-2xl border border-gray-800 p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold text-white">
                          {order.user?.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {order.user?.email}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(order.createdAt).toLocaleString("th-TH")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-400 font-bold text-lg">
                          ฿{order.total.toLocaleString()}
                        </p>
                        {order.fullName && (
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <p className="text-xs text-gray-400 mb-1 font-bold tracking-wider uppercase">
                              ที่อยู่จัดส่ง
                            </p>
                            <p className="text-white text-sm">
                              {order.fullName}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {order.phone}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              {order.address}
                            </p>
                          </div>
                        )}
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            order.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : order.status === "approved"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {order.status === "pending"
                            ? "⏳ รอตรวจสอบ"
                            : order.status === "approved"
                              ? "✅ อนุมัติแล้ว"
                              : "❌ ปฏิเสธ"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-800 overflow-hidden rounded-lg shrink-0">
                            {item.product?.image?.startsWith("http") ? (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">
                                📦
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-300">
                            {item.product?.name} x{item.quantity}
                          </p>
                          <p className="text-sm text-gray-400 ml-auto">
                            ฿{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                    {order.slipImage && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-400 mb-2">
                          สลิปการโอน:
                        </p>
                        <img
                          src={order.slipImage}
                          alt="slip"
                          className="w-40 rounded-xl border border-gray-700 cursor-pointer hover:opacity-80 transition"
                          onClick={() => window.open(order.slipImage, "_blank")}
                        />
                      </div>
                    )}
                    {order.status === "pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(order.id)}
                          className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-xl text-sm font-semibold transition"
                        >
                          ✅ อนุมัติ
                        </button>
                        <button
                          onClick={() => handleReject(order.id)}
                          className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 py-2 rounded-xl text-sm font-semibold transition border border-red-600/30"
                        >
                          ❌ ปฏิเสธ
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
