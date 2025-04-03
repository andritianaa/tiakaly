import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

import { getTopById } from '@/actions/top.actions';
import { CreateTopForm } from '@/components/top/create-top-form';
import { Button } from '@/components/ui/button';

export default function EditTopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params Promise with use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  // Use the use() hook to handle the Promise returned by getTopById
  const topData = use(getTopById(id));

  // Transform the data to match the expected format for initialData
  const formattedData = {
    id: topData.id,
    title: topData.title,
    description: topData.description,
    top1Id: topData.top1Id,
    top1Reason: topData.top1Reason,
    top2Id: topData.top2Id,
    top2Reason: topData.top2Reason,
    top3Id: topData.top3Id,
    top3Reason: topData.top3Reason,
    mainMediaId: topData.mainMediaId,
    mainMedia: topData.mainMedia || undefined, // Ajoutez une vérification pour éviter des erreurs
    top1: topData.top1
      ? {
          id: topData.top1.id,
          title: topData.top1.title,
          url: topData.top1.url,
          date: topData.top1.date.toString(), // Convert Date to string
        }
      : undefined,
    top2: topData.top2
      ? {
          id: topData.top2.id,
          title: topData.top2.title,
          url: topData.top2.url,
          date: topData.top2.date.toString(), // Convert Date to string
        }
      : undefined,
    top3: topData.top3
      ? {
          id: topData.top3.id,
          title: topData.top3.title,
          url: topData.top3.url,
          date: topData.top3.date.toString(), // Convert Date to string
        }
      : undefined,
  };

  return (
    <div className="container p-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/admin/top">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Top Lists
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-8">Edit Top List</h1>
      <div className="max-w-3xl">
        <CreateTopForm initialData={formattedData} />
      </div>
    </div>
  );
}
