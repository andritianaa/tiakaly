import { PlusCircle } from "lucide-react";
import Link from "next/link";

import { getPostInsta } from "@/actions/post-insta.actions";
import { PostInstaTable } from "@/components/post-insta/post-insta-table";
import { Button } from "@/components/ui/button";

export default async function PostInstaPage() {
  const { data: posts, error } = await getPostInsta();

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Instagram Posts</h1>
        <Button asChild>
          <Link href="/admin/post-insta/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Post
          </Link>
        </Button>
      </div>

      {error ? (
        <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
          {error}
        </div>
      ) : (
        <PostInstaTable posts={posts || []} />
      )}
    </div>
  );
}
