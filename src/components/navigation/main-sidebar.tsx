"use client";

import { Frame, Instagram, Map, MapPinned, Medal, PieChart } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { Logo } from '@/components/logo';
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';

import { NavFooter } from './nav-footer';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

const data = {
  navMain: [
    {
      title: "Endroits",
      url: "/admin/places",
      icon: MapPinned,
      isActive: true,
      items: [
        {
          title: "Liste",
          url: "/admin/places",
        },
        {
          title: "Ajouter",
          url: "/admin/places/new",
        },
        {
          title: "Carte",
          url: "/admin/places/map",
        },
      ],
    },
    {
      title: "Post insta",
      url: "/admin/post-insta",
      icon: Instagram,
      items: [
        {
          title: "Liste",
          url: "/admin/post-insta",
        },
        {
          title: "Ajouter",
          url: "/admin/post-insta/create",
        },
      ],
    },
    {
      title: "Top",
      url: "/admin/top",
      icon: Medal,
      items: [
        {
          title: "Liste",
          url: "/admin/top",
        },
        {
          title: "Ajouter",
          url: "/admin/top/create",
        },
      ],
    },
    // {
    //   title: "Projet",
    //   url: "/kanban",
    //   icon: SquareKanban,
    //   items: [
    //     {
    //       title: "Kanban",
    //       url: "/admin/kanban",
    //     },
    //     {
    //       title: "Liste",
    //       url: "/admin/kanban/list",
    //     },
    //   ],
    // },
  ],

  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible={"icon"} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary">
                  <Logo className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Tiakaly</span>
                  <span className="truncate text-xs">Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavSecondary projects={data.projects} /> */}
        <NavFooter className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
