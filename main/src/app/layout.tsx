import type { Metadata } from "next";
import "@/global.css";

export const metadata: Metadata = {
  title: "Secrethome",
  description: "Secrethome",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
