import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { cookies } from "next/headers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KajloCommerce",
  description: "KajloCommerce, find your desired products!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = cookies().get("theme");
  const isDark = theme?.value === "dark" ? true : false ?? false;

  return (
    <html lang="en" className={isDark ? "dark" : "light"}>
      <body className={`${inter.className}  dark:bg-dark`}>
        <main className="max-w-6xl mx-auto">
          <Navbar isDark={isDark} />
          {children}
        </main>
      </body>
    </html>
  );
}
