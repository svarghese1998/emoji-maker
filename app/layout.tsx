import './globals.css';
import { Inter } from 'next/font/google';
import { EmojiProvider } from './context/EmojiContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI-moji - Create AI-Generated Emojis',
  description: 'Generate unique and custom emojis using AI. Create, share, and download your personalized emojis.',
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
