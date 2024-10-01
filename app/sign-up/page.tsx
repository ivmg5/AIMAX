import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import SignUpButton from "../components/signup-button";

function SignupPage() {
  return (
    <div className="flex justify-center items-center h-full bg-custom-yellow">
      <Card className="w-[350px] bg-custom-orange rounded-3xl">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-white text-4xl font-light italic">
            AIMAX
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpButton />
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupPage;
