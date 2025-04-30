"use client";

import '../i18n';

import { ThemeProvider } from 'next-themes';
import { PropsWithChildren, useEffect, useState } from 'react';

import { PWAInstallPrompt } from '@/components/pwa-install-prompt';
import { Toaster } from '@/components/ui/toaster';

export type ProvidersProps = PropsWithChildren;

export const Providers = (props: ProvidersProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return early if not mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{props.children}</>;
  }
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      {/*
      TODO : Uncomment this when you want to use PWA features
      <PWARegister /> */}

      <Toaster />
      {props.children}
      <PWAInstallPrompt />
    </ThemeProvider>
  );
};
