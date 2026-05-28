import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendOrderApprovedEmail({ to, name, orderId, total }) {
  await transporter.sendMail({
    from: `"MyShop" <${process.env.GMAIL_USER}>`,
    to,
    subject: "✅ ออเดอร์ของคุณได้รับการอนุมัติแล้ว!",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
        <div style="background: #111; padding: 32px; text-align: center;">
          <h1 style="color: white; font-size: 24px; margin: 0; letter-spacing: 4px;">MYSHOP</h1>
        </div>
        <div style="padding: 40px 32px;">
          <p style="font-size: 13px; color: #999; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;">Order Approved</p>
          <h2 style="font-size: 28px; font-weight: 900; margin: 0 0 24px;">สวัสดีครับ ${name} 👋</h2>
          <p style="color: #555; line-height: 1.7;">ออเดอร์ของคุณได้รับการอนุมัติเรียบร้อยแล้วครับ เราจะรีบจัดส่งให้เร็วที่สุด</p>

          <div style="border: 1px solid #eee; padding: 24px; margin: 32px 0;">
            <p style="font-size: 11px; color: #999; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8px;">รหัสออเดอร์</p>
            <p style="font-family: monospace; font-size: 13px; color: #111; margin: 0 0 16px;">${orderId}</p>
            <p style="font-size: 11px; color: #999; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8px;">ยอดรวม</p>
            <p style="font-size: 24px; font-weight: 900; margin: 0;">฿${total.toLocaleString()}</p>
          </div>

          <a href="${process.env.NEXTAUTH_URL}/orders"
            style="display: block; background: #111; color: white; text-align: center; padding: 16px; font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; text-decoration: none;">
            ดูออเดอร์ของฉัน
          </a>
        </div>
        <div style="border-top: 1px solid #eee; padding: 24px 32px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">© 2026 MyShop. All rights reserved.</p>
        </div>
      </div>
    `,
  });
}