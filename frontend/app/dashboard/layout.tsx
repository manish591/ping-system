import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({ 
  children 
}: Readonly<{ children: React.ReactNode }>) {
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