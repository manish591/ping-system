"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export default function Dashboard() {
  return (
    <div className="py-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xl">
          <span className="text-gray-500">Total Users:</span>
          <span>10</span>
        </div>
        <div>
          <Button>Ping Everyone</Button>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>manish591</CardTitle>
            <CardDescription>fhdlhlf4454fjck</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button>Ping</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>manish591</CardTitle>
            <CardDescription>fhdlhlf4454fjck</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button>Ping</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>manish591</CardTitle>
            <CardDescription>fhdlhlf4454fjck</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button>Ping</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>manish591</CardTitle>
            <CardDescription>fhdlhlf4454fjck</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button>Ping</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}