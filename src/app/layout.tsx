import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "POS システム",
  description: "Tech0 POS システム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">POS システム</h1>
              <div className="flex space-x-4">
                <a href="/" className="hover:text-blue-200">商品一覧</a>
                {/* 必要に応じて他のナビゲーションリンクを追加 */}
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
