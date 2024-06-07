"use client"

import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import Image from "next/image";
import Link from "next/link";
import { Result } from "@zxing/library";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[url('/welcome_bg.jpg')]">
      <div className="flex flex-col items-center justify-center h-full bg-black w-full bg-opacity-90">
        <div className="flex flex-col space-y-6 text-center items-center  w-2/4">
          <Image src={"/smnhs_logo.png"} alt={""} width={200} height={200}></Image>
          <h1 className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            font.className,
          )}>
            🖥️ EduInsight
          </h1>
          <p className="text-white text-lg">
            Computer Lab Monitoring System for Enhanced Learning <br /> in San Miguel National Highschool
          </p>
          <div className="flex gap-2">
            <Button variant='outline' size='lg'>
              <Link href={"/scan"}>Quick Scan</Link>
            </Button>
            <LoginButton asChild>
              <Button variant="secondary" size="lg">
                Sign in
              </Button>
            </LoginButton>
          </div>
        </div>
      </div>

    </main>
  )
}
