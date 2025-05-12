"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { UserPermissions } from "@/components/admin/users/user-permissions";
import { UserProfile } from "@/components/admin/users/user-profile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { fetcher } from "@/lib/utils";

import type { UserDetailsResponse } from "@/types/admin-users";

interface UserDetailsDialogProps {
  userId: string | undefined;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onUserUpdated: () => void;
}

export function UserDetailsDialog({
  userId,
  isOpen,
  setIsOpen,
  onUserUpdated,
}: UserDetailsDialogProps) {
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user details when dialog opens
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId || !isOpen) return;

      setIsLoading(true);
      try {
        const data = (await fetcher(
          `/api/admin/users/${userId}/details`
        )) as UserDetailsResponse;
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast({
          title: "Error",
          description: "Failed to load user details. Please try again.",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, isOpen, toast]);

  if (!userId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">User Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading user details...</span>
          </div>
        ) : userData ? (
          <Tabs
            defaultValue="profile"
            className="flex-1 overflow-hidden flex flex-col"
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              {/* <TabsTrigger value="activities">Activities</TabsTrigger> */}
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[70vh]">
                <UserProfile user={userData} onUserUpdated={onUserUpdated} />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="bookmarks" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[70vh]">
                <p>Liste des bookmarks</p>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="permissions" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[70vh]">
                <UserPermissions
                  user={userData}
                  onUserUpdated={onUserUpdated}
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              Failed to load user details.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
