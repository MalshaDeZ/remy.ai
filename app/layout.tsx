import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Remy AI — Every cook deserves a little chef.",
  description:
    "Turn your favourite cooking videos into recipes, and cook confidently with your personal AI sous-chef.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
