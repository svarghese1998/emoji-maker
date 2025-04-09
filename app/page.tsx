import { Header } from './components/layout/header';
import { HeroSection } from './components/home/HeroSection';
import { FeaturesSection } from './components/home/FeaturesSection';
import { EmojiGallery } from './components/features/emoji-gallery';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fff9f0]">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <div className="container mx-auto px-4 py-12">
          <EmojiGallery />
        </div>
      </main>
    </div>
  );
}
