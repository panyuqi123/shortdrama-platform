import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../lib/auth";
import AuthModal from "../components/AuthModal";

export const metadata: Metadata = {
  title: "ReelShort - 海外短剧平台",
  description: "Watch the best short dramas from Asia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
