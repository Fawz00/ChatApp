import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Lock, Mail } from "lucide-react";
import React from "react";

export default function CallToActionSection(): JSX.Element {
  return (
    <section className="w-full max-w-[600px] mx-auto py-8">
      <Card className="bg-[#f5e6f5] border-none shadow-sm">
        <CardContent className="pt-8 px-8 pb-6 space-y-6">
          {/* Sign In Header */}
          <h1 className="text-center text-[64px] font-normal bg-gradient-to-r from-[#111a73] to-[#791e58] bg-clip-text text-transparent">
            SIGN IN
          </h1>

          {/* Email Field */}
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              className="h-10 bg-transparent border-b border-t-0 border-x-0 rounded-none px-0.5 focus-visible:ring-0 focus-visible:border-b-black"
            />
            <Mail className="absolute right-0 top-2 w-6 h-6 text-black" />
          </div>

          <Separator className="my-2" />

          {/* Password Field */}
          <div className="relative">
            <Input
              type="password"
              placeholder="Password"
              className="h-10 bg-transparent border-b border-t-0 border-x-0 rounded-none px-0.5 focus-visible:ring-0 focus-visible:border-b-black"
            />
            <Lock className="absolute right-0 top-2 w-6 h-6 text-black" />
          </div>

          {/* Sign In Button */}
          <Button className="w-full h-[69px] rounded-[45px] text-5xl font-normal mt-8 bg-gradient-to-r from-[#111a73] to-[#791e58] hover:from-[#0d1666] hover:to-[#6a1a4e]">
            SIGN IN
          </Button>

          {/* Footer Links */}
          <div className="flex justify-between pt-4">
            <Button
              variant="link"
              className="p-0 h-auto text-xl font-bold text-black"
            >
              Create an account
            </Button>
            <Button
              variant="link"
              className="p-0 h-auto text-xl font-bold text-black"
            >
              Forget Password?
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
