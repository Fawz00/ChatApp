import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export const HeaderSection = (): JSX.Element => {
  // Form field data for mapping
  const formFields = [
    { id: "username", label: "Username", type: "text" },
    { id: "email", label: "Email", type: "email" },
    { id: "password", label: "Password", type: "password" },
  ];

  return (
    <div className="w-full max-w-[600px] mx-auto py-8">
      <Card className="border-0 shadow-none">
        <CardContent className="p-6">
          <div className="mb-8 text-center">
            <h1 className="text-[64px] font-normal text-primary mb-2">
              SIGN UP
            </h1>
          </div>

          <form className="space-y-6">
            {formFields.map((field) => (
              <div className="space-y-2" key={field.id}>
                <Label htmlFor={field.id} className="text-xl font-medium">
                  {field.label}
                </Label>
                <Input
                  id={field.id}
                  type={field.type}
                  className="h-10 text-lg"
                />
              </div>
            ))}

            <div className="pt-4">
              <h2 className="text-5xl font-normal text-center text-primary mb-6">
                SIGN UP
              </h2>

              <div className="flex justify-between mt-4">
                <Button variant="link" className="text-xl font-bold p-0 h-auto">
                  Create an account
                </Button>
                <Button variant="link" className="text-xl font-bold p-0 h-auto">
                  Forget Password?
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeaderSection;
