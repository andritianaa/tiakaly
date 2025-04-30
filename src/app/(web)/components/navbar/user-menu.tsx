"use client";

import { Bookmark, LogOut, Settings, Shield } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/hooks/use-user';
import { logOut } from '@/lib/utils';

export type NavUserProps = {
  avatarOnly?: boolean;
};

export function UserMenu(props: NavUserProps) {
  const { user, isLoading } = useUser();

  if (isLoading && !user) {
    return <Skeleton className="h-12 w-full" />;
  }
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-8 rounded-lg  cursor-pointer">
            <AvatarImage
              src={user.image}
              alt={user.username}
              className="rounded-full"
            />
            <AvatarFallback className="rounded-lg">TK</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.image}
                  alt={user.username}
                  className="rounded-full"
                />
                <AvatarFallback className="rounded-lg">NX</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.username}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user.permissions.includes("ADMIN") && (
            <DropdownMenuGroup>
              <Link href="/admin" className="cursor-pointer">
                <DropdownMenuItem>
                  <Shield />
                  Admin
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/bookmarks" className="cursor-pointer">
              <DropdownMenuItem>
                <Bookmark />
                Mes enregistrements
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <Link href="/settings" className="cursor-pointer">
              <DropdownMenuItem>
                <Settings />
                Paramètres
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logOut}
            className="text-red-500 cursor-pointer"
          >
            <LogOut />
            Deconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
