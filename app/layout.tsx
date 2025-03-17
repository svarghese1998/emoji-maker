import './globals.css';
import { Inter } from 'next/font/google';
import { EmojiProvider } from './context/EmojiContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EmojiCraft - Create Custom Emojis',
  description: 'Generate unique emojis using AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <EmojiProvider>
          {children}
        </EmojiProvider>
      </body>
    </html>
  );
}
