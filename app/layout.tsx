import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CyberWorld Auth',
  description: 'Authentication for CyberWorld ecosystem',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] text-[#00ff00] font-mono">
        {children}
      </body>
    </html>
  );
}