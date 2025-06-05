import { Button } from "@/components/ui/button";
import React from "react";
import { FooterSection } from "./FooterSection";
import { HeaderSection } from "./HeaderSection";
import { MainContentSection } from "./MainContentSection";

export default function LoginPage(): JSX.Element {
  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden flex flex-col">
      <HeaderSection />

      <div className="flex flex-1">
        {/* Left side content */}
        <div className="relative w-1/2 flex flex-col">
          {/* Decorative image elements */}
          <div className="relative">
            <img className="w-[770px] h-[398px]" alt="Rectangle" src="" />
            <img
              className="absolute top-0 left-0 w-[921px] h-[398px] object-cover"
              alt="Desain tanpa judul"
              src=""
            />
          </div>

          {/* Welcome text */}
          <div className="mt-16 ml-28">
            <h1 className="text-8xl font-normal tracking-normal leading-normal whitespace-nowrap bg-gradient-to-r from-[rgba(17,26,115,1)] to-[rgba(223,55,161,1)] bg-clip-text text-transparent [font-family:'Inter-Regular',Helvetica]">
              Hey There!
            </h1>

            <h2 className="mt-6 ml-32 text-[32px] font-medium text-black tracking-normal leading-normal [font-family:'Inter-Medium',Helvetica]">
              welcome back
            </h2>

            <p className="mt-2 text-2xl font-normal text-black tracking-normal leading-normal [font-family:'Inter-Regular',Helvetica]">
              Youre are just one step away to your feed
            </p>
          </div>

          {/* Sign up section */}
          <div className="mt-auto mb-32 ml-28">
            <p className="opacity-50 text-2xl font-normal text-black tracking-normal leading-normal [font-family:'Inter-Regular',Helvetica]">
              Don&apos;t have an account?
            </p>

            <Button className="mt-6 w-60 h-[69px] rounded-[15px] bg-[color:var(--color-background-brand-default)] text-[color:var(--color-text-brand-on-brand)] border-[color:var(--color-border-brand-default)]">
              Sign Up
            </Button>
          </div>
        </div>

        {/* Right side with main content and footer */}
        <div className="w-1/2 flex flex-col">
          <MainContentSection />
          <FooterSection />
        </div>
      </div>
    </div>
  );
}
