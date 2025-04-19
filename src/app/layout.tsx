import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TodoKit🐬",
  description: "一款极简风格的 TODO 清单应用，让您专注于任务本身而非复杂的界面🐬",
    icons: {
        icon: [
            {
                url: "https://pic1.imgdb.cn/item/68039fac58cb8da5c8b69425.png",
            }
        ],
    }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <div className="bg-pattern"></div>
        {children}
      </body>
    </html>
  );
}
