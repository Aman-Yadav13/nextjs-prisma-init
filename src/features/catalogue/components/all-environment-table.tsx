"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useCatalogueFiltersStore } from "@/store/catalogue-filters-store";

interface Environment {
  slug: string;
  cloud_platform: string;
  region: string;
  account_id: string;
  customer_name: string;
  environment: string;
  type: string | null;
  web_url: string | null;
  ispm_enabled: boolean;
  pam_enabled: boolean;
}

export function EnvironmentTable({ data }: { data: Environment[] }) {
  const router = useRouter();
  const {
    search,
    cloudPlatform,
    type,
    region,
    accountId,
    pamEnabled,
    ispmEnabled,
    sorting,
    columnVisibility,
    setSearch,
    setCloudPlatform,
    setType,
    setRegion,
    setAccountId,
    setPamEnabled,
    setIspmEnabled,
    setSorting,
    setColumnVisibility,
    clearFilters,
  } = useCatalogueFiltersStore();

  const [localSorting, setLocalSorting] = React.useState<SortingState>(sorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  React.useEffect(() => {
    const filters = [];
    if (search) filters.push({ id: "slug", value: search });
    if (cloudPlatform !== "all")
      filters.push({ id: "cloud_platform", value: cloudPlatform });
    if (type !== "all") filters.push({ id: "type", value: type });
    if (region !== "all") filters.push({ id: "region", value: region });
    if (accountId !== "all")
      filters.push({ id: "account_id", value: accountId });
    if (pamEnabled !== "all")
      filters.push({ id: "pam_enabled", value: pamEnabled });
    if (ispmEnabled !== "all")
      filters.push({ id: "ispm_enabled", value: ispmEnabled });
    setColumnFilters(filters);
  }, [search, cloudPlatform, type, region, accountId, pamEnabled, ispmEnabled]);

  const columns: ColumnDef<Environment>[] = [
    {
      accessorKey: "slug",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Environment
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium w-48">{row.getValue("slug")}</div>
      ),
    },
    {
      accessorKey: "cloud_platform",
      header: "Platform",
      cell: ({ row }) => (
        <div className="uppercase w-24">{row.getValue("cloud_platform")}</div>
      ),
      filterFn: (row, id, value) => {
        return value === "all" || row.getValue(id) === value;
      },
    },
    {
      accessorKey: "region",
      header: "Region",
      cell: ({ row }) => <div className="w-32">{row.getValue("region")}</div>,
      filterFn: (row, id, value) => {
        return value === "all" || row.getValue(id) === value;
      },
    },
    {
      accessorKey: "account_id",
      header: "Account ID",
      cell: ({ row }) => {
        const id = row.getValue("account_id") as string;
        return (
          <div className="w-32 truncate" title={id}>
            {id.length > 10 ? `${id.slice(0, 10)}...` : id}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value === "all" || row.getValue(id) === value;
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="w-24">{row.getValue("type") || "N/A"}</div>
      ),
      filterFn: (row, id, value) => {
        return value === "all" || row.getValue(id) === value;
      },
    },
    {
      accessorKey: "pam_enabled",
      header: "PAM",
      cell: ({ row }) => (
        <div className="w-16">
          {row.getValue("pam_enabled") ? (
            <span className="text-green-600">✓</span>
          ) : (
            <span className="text-gray-400">✗</span>
          )}
        </div>
      ),
      filterFn: (row, id, value) => {
        return value === "all" || row.getValue(id) === (value === "true");
      },
    },
    {
      accessorKey: "ispm_enabled",
      header: "ISPM",
      cell: ({ row }) => (
        <div className="w-16">
          {row.getValue("ispm_enabled") ? (
            <span className="text-green-600">✓</span>
          ) : (
            <span className="text-gray-400">✗</span>
          )}
        </div>
      ),
      filterFn: (row, id, value) => {
        return value === "all" || row.getValue(id) === (value === "true");
      },
    },
    {
      accessorKey: "web_url",
      header: "GitLab",
      cell: ({ row }) => {
        const url = row.getValue("web_url") as string | null;
        return url ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              window.open(url, "_blank");
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(localSorting) : updater;
      setLocalSorting(newSorting);
      setSorting(newSorting);
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: (updater) => {
      const newVisibility =
        typeof updater === "function" ? updater(columnVisibility) : updater;
      setColumnVisibility(newVisibility);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: localSorting,
      columnFilters,
      columnVisibility,
    },
  });

  const uniqueTypes = Array.from(
    new Set(data.map((d) => d.type).filter(Boolean)),
  );
  const uniqueAccountIds = Array.from(new Set(data.map((d) => d.account_id)));
  const uniqueRegions = Array.from(new Set(data.map((d) => d.region)));

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Filters</h3>
            <p className="text-sm text-muted-foreground">
              {table.getFilteredRowModel().rows.length} of {data.length}{" "}
              environment(s)
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                table.resetColumnFilters();
                clearFilters();
              }}
              className="h-8"
            >
              Clear Filters
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id.replace(/_/g, " ")}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Search
            </label>
            <Input
              placeholder="Search environments..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-9 w-64"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Cloud Platform
            </label>
            <Select value={cloudPlatform} onValueChange={setCloudPlatform}>
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder="Cloud Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="aws">AWS</SelectItem>
                <SelectItem value="azure">Azure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Type
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type as string}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Region
            </label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="h-9 w-40">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {uniqueRegions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Account ID
            </label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger className="h-9 w-40">
                <SelectValue placeholder="Account ID" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {uniqueAccountIds.map((accountId) => (
                  <SelectItem key={accountId} value={accountId}>
                    {accountId.length > 12
                      ? `${accountId.slice(0, 12)}...`
                      : accountId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              PAM
            </label>
            <Select value={pamEnabled} onValueChange={setPamEnabled}>
              <SelectTrigger className="h-9 w-32">
                <SelectValue placeholder="PAM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Enabled</SelectItem>
                <SelectItem value="false">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              ISPM
            </label>
            <Select value={ispmEnabled} onValueChange={setIspmEnabled}>
              <SelectTrigger className="h-9 w-32">
                <SelectValue placeholder="ISPM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Enabled</SelectItem>
                <SelectItem value="false">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() =>
                    router.push(`/u/catalogue/env/${row.original.slug}`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
