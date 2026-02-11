"use client";

import * as React from "react";
import { ChevronRight, ChevronsUpDown, LogOut, LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

interface NavItem {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
}

const SidebarTree = ({
  items,
  handleRoute,
}: {
  items: NavItem[];
  handleRoute: (url: string) => void;
}) => {
  if (!items?.length) return null;

  return (
    <SidebarMenuSub>
      {items.map((item) => (
        <SidebarMenuSubItem key={item.title}>
          {item.items?.length ? (
            <Collapsible className="group/collapsible">
              <CollapsibleTrigger asChild>
                <SidebarMenuSubButton
                  className="cursor-pointer w-full"
                  onClick={() => item.url && handleRoute(item.url)}
                >
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuSubButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarTree items={item.items} handleRoute={handleRoute} />
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarMenuSubButton
              onClick={() => item.url && handleRoute(item.url)}
              className="cursor-pointer"
            >
              <span>{item.title}</span>
            </SidebarMenuSubButton>
          )}
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  );
};

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
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
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
              {NavData.navMain.map((item: NavItem) => (
                <SidebarMenuItem key={item.title}>
                  {item.items?.length ? (
                    <Collapsible
                      defaultOpen={item.isActive}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className="cursor-pointer w-full"
                          onClick={() => item.url && handleRoute(item.url)}
                        >
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarTree
                          items={item.items}
                          handleRoute={handleRoute}
                        />
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => item.url && handleRoute(item.url)}
                      className="cursor-pointer"
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg">
                    {status === "loading" ? (
                      <Skeleton className="h-8 w-8 rounded-lg bg-gray-200" />
                    ) : (
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={userData?.user?.image || ""} />
                        <AvatarFallback>
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
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                >
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
