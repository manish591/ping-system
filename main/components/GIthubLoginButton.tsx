"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function GithubLoginButton() {
  return (
    <Button 
      className="w-full" 
      onClick={function() {
        signIn("github", { callbackUrl: "/dashboard" })
      }}>
        Continue with Github
    </Button>
  )
}