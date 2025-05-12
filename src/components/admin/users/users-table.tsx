"use client";
import { CalendarIcon, Info, MoreHorizontal, Shield, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { User as UserType } from "@/types/schema";

interface UsersTableProps {
  users: UserType[];
  isLoading: boolean;
  onViewUserDetails: (user: UserType) => void;
}

export function UsersTable({
  users,
  isLoading,
  onViewUserDetails,
}: UsersTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
            <p className="mt-4 text-muted-foreground">Loading user data...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="w-[200px]">Fullname</TableHead>
                  <TableHead className="w-[150px]">Roles</TableHead>
                  <TableHead className="w-[180px]">Verfied user</TableHead>
                  <TableHead className="w-[200px]">Registration</TableHead>
                  <TableHead className="text-right w-[100px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="flex items-center gap-2 cursor-pointer">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={user.image || "/placeholder.svg"}
                              />
                              <AvatarFallback>
                                {user.username?.slice(0, 2).toUpperCase() ||
                                  user.email.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {user.username || "No username"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="flex justify-between space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={user.image || "/placeholder.svg"}
                              />
                              <AvatarFallback>
                                {user.username?.slice(0, 2).toUpperCase() ||
                                  user.email.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">
                                {user.username || "No username"}
                              </h4>
                              {user.fullname && (
                                <p className="text-sm">{user.fullname}</p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                              <div className="flex items-center pt-2">
                                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                                <span className="text-xs text-muted-foreground">
                                  User ID: {user.id.substring(0, 8)}...
                                </span>
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell>
                      {user.fullname ? (
                        <p className="text-xs">{user.fullname}</p>
                      ) : (
                        <p className="text-xs">No fullname</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.permissions && user.permissions.length > 0 ? (
                          user.permissions.map((role) => (
                            <Badge
                              key={role}
                              variant="secondary"
                              className="text-xs"
                            >
                              {role}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            No roles
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.isEmailVerified ? (
                          <Badge className="text-xs">Verified</Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            Not Verified
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.createdAt ? (
                        <p className="text-xs">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      ) : (
                        <p className="text-xs">No date</p>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => onViewUserDetails(user)}
                          >
                            <Info className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Edit Permissions</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-24 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              No users found matching your filters.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
