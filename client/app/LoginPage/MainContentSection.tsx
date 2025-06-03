import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";

export const MainContentSection = (): JSX.Element => {
  // Data for form links
  const formLinks = [
    { text: "Create an account", position: "left" },
    { text: "Forget Password?", position: "right" },
  ];

  return (
    <div className="w-full max-w-[599px]">
      <Card className="border-none shadow-none">
        <CardContent className="p-0">
          {/* Heading */}
          <h1 className="w-full text-center text-[64px] font-normal [background:linear-gradient(90deg,rgba(17,26,115,1)_50%,rgba(121,30,88,1)_100%)] [-webkit-background-clip:text] bg-clip-text text-transparent mb-12">
            SIGN IN
          </h1>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Username field would typically be here */}

            {/* Password field */}
            <div className="relative">
              <Input
                type="password"
                className="h-10 text-xl font-medium"
                placeholder="Password"
                aria-label="Password"
              />
            </div>

            {/* Separator line */}
            <div className="w-full h-px bg-gray-200 my-6"></div>

            {/* Sign In Button */}
            <Button className="w-full h-[69px] rounded-[45px] bg-gradient-to-r from-[rgba(17,26,115,1)] to-[rgba(121,30,88,1)]">
              <span className="text-5xl font-normal text-white">SIGN IN</span>
            </Button>

            {/* Bottom Links */}
            <div className="flex justify-between mt-16">
              {formLinks.map((link, index) => (
                <button key={index} className="text-xl font-bold text-black">
                  {link.text}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainContentSection;
