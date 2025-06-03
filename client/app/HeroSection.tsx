import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function HeroSection(): JSX.Element {
  // Data for input fields
  const inputFields = [
    { id: "username", label: "Username" },
    { id: "email", label: "Email" },
    { id: "password", label: "Password" },
  ];

  return (
    <section className="flex flex-col w-full max-w-[600px] py-8">
      <div className="flex flex-col space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="" alt="WEITNAH Logo" className="h-6" />
          <span className="text-xs uppercase tracking-wider text-gray-600">
            WEITNAH
            <div className="text-[8px]">BANDUNG HARMONY MENDAPATKAN JARAK</div>
          </span>
        </div>

        {/* Greeting */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-indigo-900">Hey There!</h1>
          <p className="text-xl">Welcome back</p>
          <p className="text-gray-600">Just one step away to your feed</p>
        </div>

        {/* Form */}
        <div className="space-y-6 pt-4">
          {/* Input fields */}
          {inputFields.map((field) => (
            <div key={field.id} className="space-y-1">
              <Input
                id={field.id}
                placeholder={field.label}
                className="h-10 border-gray-300"
                type={field.id === "password" ? "password" : "text"}
              />
            </div>
          ))}

          {/* Sign up button */}
          <div className="pt-4">
            <Button className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xl">
              SIGN UP
            </Button>
          </div>

          {/* Action links */}
          <div className="flex justify-between pt-2">
            <Button variant="link" className="h-auto text-indigo-700 font-bold">
              Create an account
            </Button>
            <Button variant="link" className="h-auto text-indigo-700 font-bold">
              Forget Password?
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="hidden md:block">
        <Separator className="my-2" />
        <Separator className="my-2" />
        <Separator className="my-2" />
      </div>
    </section>
  );
}
