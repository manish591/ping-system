import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function DashboardLayout({ 
  children 
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();
  
  if(!session?.user) {
    return redirect("/auth/login");
  }

  return (
    <div className="h-full max-w-screen-lg mx-auto">
      <nav className="py-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl">ping_system</h1>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </nav>
      {children}
    </div>
  )
}