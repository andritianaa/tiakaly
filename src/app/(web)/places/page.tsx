"use client";

import { Suspense } from 'react';

import SearchPageContent from '@/app/(web)/places/content';

export default function PlacesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
