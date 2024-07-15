import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GithubLoginButton from "@/components/GIthubLoginButton";

export default async function Login() {
  const session = await getServerSession();

  if(session?.user) {
    return redirect("/dashboard");
  }

  return (
    <div className="h-full flex items-center justify-center">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Connect your Github account to get started
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-4">
          <GithubLoginButton />
        </CardFooter>
      </Card>
    </div>
  )
}