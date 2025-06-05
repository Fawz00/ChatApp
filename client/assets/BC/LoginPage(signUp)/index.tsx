import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Lock, Mail, User } from "lucide-react";
import React from "react";

export default function LoginPage(): JSX.Element {
  // Data for form fields
  const signupFields = [
    { id: "username", label: "Username", icon: <User className="h-6 w-6" /> },
    { id: "email", label: "Email", icon: <Mail className="h-6 w-6" /> },
    { id: "password", label: "Password", icon: <Lock className="h-6 w-6" /> },
  ];

  return (
    <main className="bg-white flex justify-center w-full min-h-screen">
      <div className="bg-white overflow-hidden w-full max-w-[1440px] relative">
        <div className="flex flex-row">
          {/* Left Side - Sign Up Form */}
          <Card className="relative w-full max-w-[720px] rounded-[50px] border border-solid border-black overflow-hidden">
            <div className="absolute inset-0 rounded-[50px] [background:linear-gradient(180deg,rgba(17,26,115,1)_30%,rgba(223,55,161,1)_70%)] opacity-25"></div>

            <CardContent className="relative z-10 flex flex-col items-center justify-center p-16 h-full">
              <div className="w-full max-w-[599px]">
                <h1 className="text-center text-[64px] [background:linear-gradient(90deg,rgba(17,26,115,1)_50%,rgba(121,30,88,1)_100%)] [-webkit-background-clip:text] bg-clip-text text-transparent font-normal mb-16">
                  SIGN UP
                </h1>

                <div className="space-y-8 w-full max-w-[533px] mx-auto">
                  {signupFields.map((field) => (
                    <div key={field.id} className="relative">
                      <div className="flex items-center">
                        <label className="font-medium text-xl text-black">
                          {field.label}
                        </label>
                      </div>
                      <div className="relative mt-1">
                        <Input
                          id={field.id}
                          type={field.id === "password" ? "password" : "text"}
                          className="border-0 border-b border-black rounded-none pb-2 pl-0 pr-10 focus-visible:ring-0"
                        />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                          {field.icon}
                        </div>
                      </div>
                      <Separator className="mt-1" />
                    </div>
                  ))}

                  <Button className="w-full h-[69px] mt-8 text-5xl font-normal text-white rounded-full [background:linear-gradient(90deg,rgba(17,26,115,1)_50%,rgba(121,30,88,1)_100%)]">
                    SIGN UP
                  </Button>

                  <div className="flex justify-center mt-4">
                    <p className="font-bold text-xl text-black">
                      Already have an account?
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Welcome Back */}
          <Card className="relative w-full max-w-[720px] border-0 bg-white">
            <CardContent className="p-0 h-full">
              <div className="relative h-full">
                {/* Background image */}
                <div className="h-[540px] w-full bg-cover bg-center">
                  <img
                    src=""
                    alt="Welcome background"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col items-center justify-center text-center px-8 py-16">
                  <div className="flex items-center justify-center mb-4">
                    <img src="" alt="Logo" className="h-16" />
                  </div>

                  <h1 className="text-8xl [background:linear-gradient(90deg,rgba(17,26,115,1)_50%,rgba(223,55,161,1)_100%)] [-webkit-background-clip:text] bg-clip-text text-transparent font-normal">
                    Hey There!
                  </h1>

                  <h2 className="text-[32px] font-medium text-black mt-4">
                    welcome back
                  </h2>

                  <p className="text-2xl text-black mt-2">
                    Youre are just one step away to your feed
                  </p>

                  <div className="mt-16">
                    <p className="text-2xl text-black opacity-50 mb-4">
                      Don't have an account?
                    </p>

                    <Button className="w-60 h-[69px] rounded-[15px] bg-[#2C2C2C] text-white border border-solid">
                      Sign Up
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
