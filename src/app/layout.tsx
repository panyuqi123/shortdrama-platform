import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../lib/auth";
import AuthModal from "../components/AuthModal";

export const metadata: Metadata = {
  title: "ReelShort - 海外短剧",
  description: "海量精品短剧，随时随地畅享",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23FF2D55'/><path d='M10 8l14 8-14 8V8z' fill='white'/></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
