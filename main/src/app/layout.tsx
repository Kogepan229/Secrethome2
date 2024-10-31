import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "@/global.css";

const _oswaldFont = Oswald({
  weight: "700", // bold
  subsets: ["latin"],
  display: "swap",
});

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
