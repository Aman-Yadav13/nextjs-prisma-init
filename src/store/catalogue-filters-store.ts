"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CatalogueFiltersState {
  search: string;
  cloudPlatform: string;
  type: string;
  region: string;
  accountId: string;
  pamEnabled: string;
  ispmEnabled: string;
  sorting: Array<{ id: string; desc: boolean }>;
  columnVisibility: Record<string, boolean>;
}

interface CatalogueFiltersStore extends CatalogueFiltersState {
  setSearch: (search: string) => void;
  setCloudPlatform: (platform: string) => void;
  setType: (type: string) => void;
  setRegion: (region: string) => void;
  setAccountId: (accountId: string) => void;
  setPamEnabled: (enabled: string) => void;
  setIspmEnabled: (enabled: string) => void;
  setSorting: (sorting: Array<{ id: string; desc: boolean }>) => void;
  setColumnVisibility: (visibility: Record<string, boolean>) => void;
  clearFilters: () => void;
}

const initialState: CatalogueFiltersState = {
  search: "",
  cloudPlatform: "all",
  type: "all",
  region: "all",
  accountId: "all",
  pamEnabled: "all",
  ispmEnabled: "all",
  sorting: [],
  columnVisibility: {},
};

export const useCatalogueFiltersStore = create<CatalogueFiltersStore>()(
  persist(
    (set) => ({
      ...initialState,
      setSearch: (search) => set({ search }),
      setCloudPlatform: (cloudPlatform) => set({ cloudPlatform }),
      setType: (type) => set({ type }),
      setRegion: (region) => set({ region }),
      setAccountId: (accountId) => set({ accountId }),
      setPamEnabled: (pamEnabled) => set({ pamEnabled }),
      setIspmEnabled: (ispmEnabled) => set({ ispmEnabled }),
      setSorting: (sorting) => set({ sorting }),
      setColumnVisibility: (columnVisibility) => set({ columnVisibility }),
      clearFilters: () => set(initialState),
    }),
    {
      name: "catalogue-filters",
    }
  )
);