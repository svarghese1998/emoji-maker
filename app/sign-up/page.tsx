import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch">
      {/* Left side - Welcome message */}
      <div className="bg-[#FF4500] text-white p-8 flex flex-col justify-center items-center md:w-1/2">
        <div className="max-w-md text-center">
          <Image 
            src="/ai-moji-logo.svg" 
            alt="AI-moji Logo" 
            width={80} 
            height={80} 
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold mb-4">Welcome to AI-moji</h1>
          <p className="text-xl mb-6">
            Create, customize, and share unique AI-generated emojis
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎨</span>
              <span>Generate custom emojis with AI</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💾</span>
              <span>Save your favorite creations</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌟</span>
              <span>Like and share with others</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Sign Up form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto w-full max-w-md",
              card: "shadow-none",
            }
          }}
          signInUrl="/sign-in"
          redirectUrl="/"
        />
      </div>
    </div>
  );
} 