import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/components/ScrollToTop";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "MyShop",
  description: "ร้านค้าออนไลน์",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={geist.className}>
        <Providers>{children}</Providers>
        <ScrollToTop />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111",
              color: "#fff",
              fontSize: "13px",
              fontWeight: "600",
              letterSpacing: "0.05em",
              borderRadius: "0px",
              padding: "16px 20px",
            },
          }}
        />
      </body>
    </html>
  );
}
