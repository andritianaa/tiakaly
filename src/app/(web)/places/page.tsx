"use client";

import { Suspense } from 'react';

import SearchPageContent from '@/app/(web)/places/content';

export default function PlacesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
