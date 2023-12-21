import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import '@dotlottie/react-player/dist/index.css';
import { ClientWrapper } from '@/app/wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'myATM',
  description: 'The ATM for everyone!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
