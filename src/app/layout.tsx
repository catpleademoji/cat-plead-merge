import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "cat plead merge",
  description: "A suika-like game featuring cat emojis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
