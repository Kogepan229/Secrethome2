import type { Metadata } from "next";
import { Noto_Sans_JP, Oswald } from "next/font/google";
import "@/global.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  display: "swap",
});

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
      <body className={notoSansJP.className}>{children}</body>
    </html>
  );
}
