"use client";

import * as React from "react";

import { ChevronRight, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession, signOut } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { NavData } from "@/data";
import { useRouter } from "next/navigation";

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: userData, status } = useSession();

  const handleRoute = (url: string) => {
    router.push(url);
  };

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="NavData-[state=open]:bg-sidebar-accent NavData-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary font-semibold text-xl text-primary-foreground">
                      S
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <p className="font-semibold text-xl">Saviynt</p>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {NavData.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        onClick={() => handleRoute(item.url)}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="group-NavData-[state=open]/collapsible:rotate-90 ml-auto transition-transform duration-200" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {/* <SidebarMenuSub>
                        {item.items?.map((subItem: any) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a
                                onClick={() => handleRoute(subItem.url)}
                                className="cursor-pointer"
                              >
                                <div className="group flex w-full items-center justify-between">
                                  <span>{subItem.title}</span>
                                </div>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub> */}
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="NavData-[state=open]:bg-sidebar-accent NavData-[state=open]:text-sidebar-accent-foreground"
                  >
                    {status === "loading" ? (
                      <Skeleton className="h-8 w-8 rounded-lg bg-gray-200" />
                    ) : status === "unauthenticated" ? null : (
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={userData?.user?.image || "/default_avatar.png"}
                          alt={userData?.user?.name?.[0]}
                        />
                        <AvatarFallback className="rounded-lg">
                          {userData?.user?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userData?.user?.name}
                      </span>
                      <span className="truncate text-xs">
                        {userData?.user?.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      {status === "loading" ? (
                        <Skeleton className="h-8 w-8 rounded-lg bg-gray-200" />
                      ) : status === "unauthenticated" ? null : (
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={userData?.user?.image || "/default_avatar.png"}
                            alt={userData?.user?.name?.[0]}
                          />
                          <AvatarFallback className="rounded-lg">
                            {userData?.user?.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {userData?.user?.name}
                        </span>
                        <span className="truncate text-xs">
                          {userData?.user?.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/login" })}
                  >
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      {children}
    </>
  );
}
