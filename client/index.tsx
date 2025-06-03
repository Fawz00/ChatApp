import { Button } from "@/components/ui/button";
import React from "react";
import { HeroSection } from "./HeroSection";
import { SignInFormSection } from "./SignInFormSection";

export default function LoginPage(): JSX.Element {
  return (
    <div className="flex w-full min-h-screen bg-white overflow-hidden">
      <div className="relative flex w-full">
        {/* Left side with hero content */}
        <div className="relative w-1/2 flex flex-col">
          {/* Background elements */}
          <img
            className="absolute w-full h-full top-0 left-0 object-cover z-0"
            alt="Rectangle"
            src=""
          />

          <img
            className="absolute w-full h-auto top-0 left-0 object-cover z-10"
            alt="Desain tanpa judul"
            src=""
          />

          {/* Hero section with welcome text */}
          <div className="relative z-20 flex flex-col px-28 mt-80">
            <h1 className="text-8xl font-normal [background:linear-gradient(90deg,rgba(17,26,115,1)_50%,rgba(223,55,161,1)_100%)] [-webkit-background-clip:text] bg-clip-text text-transparent [font-family:'Inter-Regular',Helvetica] tracking-normal leading-normal whitespace-nowrap">
              Hey There!
            </h1>

            <h2 className="text-3xl font-medium [font-family:'Inter-Medium',Helvetica] text-black mt-4 ml-32">
              welcome back
            </h2>

            <p className="text-2xl font-normal [font-family:'Inter-Regular',Helvetica] text-black mt-2">
              Youre are just one step away to your feed
            </p>
          </div>

          {/* Sign up section */}
          <div className="relative z-20 flex flex-col items-center mt-auto mb-32">
            <p className="text-2xl font-normal [font-family:'Inter-Regular',Helvetica] text-black opacity-50 mb-4">
              Don&apos;t have an account?
            </p>

            <Button className="w-60 h-[69px] rounded-[15px] bg-[color:var(--color-background-brand-default)] text-[color:var(--color-text-brand-on-brand)] border-[color:var(--color-border-brand-default)]">
              Sign Up
            </Button>
          </div>

          {/* Import the HeroSection component */}
          <HeroSection />
        </div>

        {/* Right side with sign in form */}
        <div className="relative w-1/2">
          <div className="absolute w-full h-full top-0 left-0 rounded-[50px] [background:linear-gradient(180deg,rgba(17,26,115,1)_30%,rgba(223,55,161,1)_70%)] opacity-25" />

          {/* Import the SignInFormSection component */}
          <SignInFormSection />
        </div>
      </div>
    </div>
  );
}
