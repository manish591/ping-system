import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="h-full text-center flex items-center justify-center flex-col">
      <h1 className="text-4xl font-bold">Ping Notifications System</h1>
      <div className="mt-6">
        <Link href="/auth/login">
          <Button>Get started</Button>
        </Link>
      </div>
    </main>
  );
}
