"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine, RiWifiOffLine } from "@remixicon/react";

export default function OfflinePage() {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    // Vérifier si la connexion est rétablie
    window.location.href = "/";
  };

  // Animation pour l'icône
  useEffect(() => {
    const interval = setInterval(() => {
      const icon = document.getElementById("offline-icon");
      if (icon) {
        icon.classList.add("scale-110");
        setTimeout(() => {
          icon.classList.remove("scale-110");
        }, 500);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center justify-center px-4 text-center">
        <Link href="/" className="mb-8">
          <Logo withName />
        </Link>

        <div
          id="offline-icon"
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform duration-300"
        >
          <RiWifiOffLine className="size-10" />
        </div>

        <h1 className="text-2xl font-semibold text-slate-700">
          Vous êtes hors ligne
        </h1>

        <p className="mt-3 max-w-md text-sm text-gray-600">
          Nous ne pouvons pas accéder à internet. Veuillez vérifier votre
          connexion réseau et réessayer.
        </p>

        <Button
          onClick={handleRetry}
          disabled={isRetrying}
          className="group mt-8"
        >
          {isRetrying ? (
            <>
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Connexion...
            </>
          ) : (
            <>
              Réessayer
              <RiArrowRightLine
                className="ml-1.5 size-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </>
          )}
        </Button>

        <p className="mt-6 text-xs text-gray-500">
          Si le problème persiste, vous pouvez essayer de{" "}
          <button
            onClick={() => window.location.reload()}
            className="text-slate-600 underline underline-offset-2"
          >
            rafraîchir la page
          </button>
        </p>
      </div>
    </div>
  );
}
