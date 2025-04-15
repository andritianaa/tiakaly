"use client";

import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';

import { CreatePostFacebookForm, CreatePostInstaForm } from './create-post-insta-form';

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
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un post instagram</DialogTitle>
          <DialogDescription>
            Ajouter un nouveau post Instagram à utiliser dans votre liste Top.
          </DialogDescription>
        </DialogHeader>
        <CreatePostInstaForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}

export function PostFbDialog({ onPostCreated }: PostInstaDialogProps) {
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
          Ajouter facebook
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un post facebook</DialogTitle>
          <DialogDescription>
            Ajouter un nouveau post Facebook à utiliser dans votre liste Top.
          </DialogDescription>
        </DialogHeader>
        <CreatePostFacebookForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
