import Link from "next/link";

import { Navbar } from "@/app/(web)/components/navbar";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "@remixicon/react";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Navbar />
      <Link href={"/"}>
        <Logo withName />
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-slate-700">
        Page indisponnible
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        {`Désolé, cette page n'est pas disponnible.`}
      </p>
      <Button asChild className="group mt-8">
        <Link href={"/"}>
          {`Retourner à l'accueil`}
          <RiArrowRightLine className="ml-1.5 size-5" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}
