import { Header } from './components/layout/header';
import { EmojiGenerator } from './components/features/emoji-generator';
import { EmojiGallery } from './components/features/emoji-gallery';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fff9f0]">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <EmojiGenerator />
        <EmojiGallery />
      </main>
    </div>
  );
}
