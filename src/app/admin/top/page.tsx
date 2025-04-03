import { PlusCircle } from "lucide-react";
import Link from "next/link";

import { getTops } from "@/actions/top.actions";
import { TopTable } from "@/components/top/top-table";
import { Button } from "@/components/ui/button";

export default async function TopPage() {
  const { data: tops, error } = await getTops();

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Top Lists</h1>
        <Button asChild>
          <Link href="/admin/top/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer
          </Link>
        </Button>
      </div>

      {error ? (
        <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
          {error}
        </div>
      ) : (
        <TopTable tops={tops || []} />
      )}
    </div>
  );
}
