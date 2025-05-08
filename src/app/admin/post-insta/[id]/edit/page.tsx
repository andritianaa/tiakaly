"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

// Importez les actions mais ne les appelez pas directement dans le corps du composant
import { UpdatePostInstaForm } from "@/components/post-insta/update-post-insta-form";
import { useToast } from "@/hooks/use-toast";
import { fetcher } from "@/lib/utils";

export default function EditPlacePage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const id = params.id as string;

  const { data } = useSWR(`/api/post-insta/${id}`, fetcher);

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-8">Modifier un post instagram</h1>

      <div className="max-w-2xl">
        <UpdatePostInstaForm id={id} initialData={data} />
      </div>
    </div>
  );
}
