"use client";

import { format } from "date-fns";
import { Eye, Loader2, Pencil, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteTop } from "@/actions/top.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface TopTableProps {
  tops: any[];
}

export function TopTable({ tops: initialTops }: TopTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [tops, setTops] = useState(initialTops);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter tops based on search query
  const filteredTops = tops.filter(
    (top) =>
      top.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      top.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deleteTop(deleteId);

      if (result.error) {
        throw new Error(result.error);
      }

      setTops(tops.filter((top) => top.id !== deleteId));

      toast({
        description: "Top list deleted successfully",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting top:", error);
      toast({
        description: "Failed to delete Top list",
        variant: "error",
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search top lists..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Top 1</TableHead>
              <TableHead>Top 2</TableHead>
              <TableHead>Top 3</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTops.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No top lists found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTops.map((top) => (
                <TableRow key={top.id}>
                  <TableCell className="font-medium">{top.title}</TableCell>
                  <TableCell>
                    {format(new Date(top.createdAt), "PPP")}
                  </TableCell>
                  <TableCell>{top.top1?.title || "—"}</TableCell>
                  <TableCell>{top.top2?.title || "—"}</TableCell>
                  <TableCell>{top.top3?.title || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/top/${top.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/top/${top.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </Link>
                      <Link href={`/admin/top/${top.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/top/${top.id}/edit`)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(top.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the Top
              list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
