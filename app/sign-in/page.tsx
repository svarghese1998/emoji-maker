import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch">
      {/* Left side - Welcome back message */}
      <div className="bg-[#FF4500] text-white p-8 flex flex-col justify-center items-center md:w-1/2">
        <div className="max-w-md text-center">
          <Image 
            src="/ai-moji-logo.svg" 
            alt="AI-moji Logo" 
            width={80} 
            height={80} 
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-xl mb-6">
            Sign in to continue creating and sharing amazing AI-generated emojis
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <span>Access your saved emojis</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">❤️</span>
              <span>View your liked creations</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <span>Continue your creative journey</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Sign In form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto w-full max-w-md",
              card: "shadow-none",
            }
          }}
          signUpUrl="/sign-up"
          redirectUrl="/"
        />
      </div>
    </div>
  );
} 