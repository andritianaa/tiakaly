"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the default behavior
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      // Show the install button
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    (deferredPrompt as any).prompt();

    // Wait for the user to respond to the prompt
    (deferredPrompt as any).userChoice.then(
      (choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        // Clear the deferred prompt variable
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      }
    );
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-background p-4 rounded-lg shadow-lg border z-50 md:left-auto md:right-4 md:w-80">
      <h3 className="font-semibold mb-2">{"Installer l'application"}</h3>
      <p className="text-sm mb-4">
        Installez Tiakaly sur votre appareil pour un accès rapide.
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setShowInstallPrompt(false)}>
          Plus tard
        </Button>
        <Button onClick={handleInstallClick}>Installer</Button>
      </div>
    </div>
  );
}
