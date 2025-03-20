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

      <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-50">
        Page indisponnible
      </h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {`Désolé, cette page n'est pas encore prête`}
      </p>
      <Button asChild className="group mt-8">
        <Link href={"/"}>
          {`Retourner à l'accueil`}
          <RiArrowRightLine
            className="ml-1.5 size-5 text-gray-900 dark:text-gray-50"
            aria-hidden="true"
          />
        </Link>
      </Button>
    </div>
  );
}
