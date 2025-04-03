"use client";

import { PlusCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CreatePostInstaForm } from "./create-post-insta-form";

interface PostInstaDialogProps {
  onPostCreated?: (post: any) => void;
}

export function PostInstaDialog({ onPostCreated }: PostInstaDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = (data: any) => {
    if (onPostCreated) {
      onPostCreated(data);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Instagram Post</DialogTitle>
          <DialogDescription>
            Add a new Instagram post to use in your Top list.
          </DialogDescription>
        </DialogHeader>
        <CreatePostInstaForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
