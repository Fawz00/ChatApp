import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, Mail } from "lucide-react";
import React from "react";

export const FooterSection = (): JSX.Element => {
  return (
    <div className="w-full max-w-[599px]">
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <h1 className="text-[64px] font-normal bg-gradient-to-r from-[#111A73] to-[#791E58] bg-clip-text text-transparent mb-8">
            SIGN IN
          </h1>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <label className="font-medium text-xl">Email</label>
              </div>
              <Input type="email" className="rounded-md h-10 border-gray-300" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-gray-500" />
                <label className="font-medium text-xl">Password</label>
              </div>
              <Input
                type="password"
                className="rounded-md h-10 border-gray-300"
              />
            </div>

            <Button className="w-full h-[69px] rounded-[45px] bg-gradient-to-r from-[#111A73] to-[#791E58] mt-6">
              <span className="text-5xl font-normal">SIGN IN</span>
            </Button>

            <div className="flex justify-between pt-4">
              <button className="font-bold text-xl text-black">
                Create an account
              </button>
              <button className="font-bold text-xl text-black">
                Forget Password?
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FooterSection;
