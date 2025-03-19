import { Logo } from "@/components/logo";

import type React from "react";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 relative">
      <Logo withName className="absolute top-8 left-8" />
      <div className="xl:col-span-1 mx-auto flex w-full flex-col justify-center space-y-6 p-8 sm:w-[460px] ">
        <div className="flex flex-col space-y-2 max-lg:pt-16">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>

      <div className="xl:col-span-2 flex w-full h-full relative">
        <video
          src="/auth-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover lg:rounded-tl-[100px] select-none pointer-events-none"
        ></video>
        <Logo
          withName
          color="white"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 max-lg:h-24"
          nameClassName=" text-[6rem] max-lg:text-[4rem]"
        />
      </div>
    </div>
  );
}
