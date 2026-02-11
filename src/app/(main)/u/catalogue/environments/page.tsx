"use client";

import { useEffect } from "react";
import { useEnvironmentStore } from "@/store/environment-store";
import { EnvironmentTable } from "@/features/catalogue/components/all-environment-table";

const CataloguePage = () => {
  const { environments, isLoading, error, fetchEnvironments } =
    useEnvironmentStore();

  useEffect(() => {
    fetchEnvironments();
  }, [fetchEnvironments]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading environments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Environment Catalogue
        </h1>
        <p className="text-muted-foreground">
          Manage and view all customer cloud environments
        </p>
      </div>
      <EnvironmentTable data={environments} />
    </div>
  );
};

export default CataloguePage;
