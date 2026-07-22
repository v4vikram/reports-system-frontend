"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CoverageTableCard } from "./coverage-table-card";
import { useCoverageTables } from "../hooks/use-coverage-tables";
import { useCreateCoverageTable } from "../hooks/use-create-coverage-table";

interface CoverageTablesListProps {
  sectionId: string;
  canEdit: boolean;
  canDelete: boolean;
}

export function CoverageTablesList({ sectionId, canEdit, canDelete }: CoverageTablesListProps) {
  const { data: tables, isLoading } = useCoverageTables(sectionId, { enabled: true });
  const createTable = useCreateCoverageTable(sectionId);

  function addTable() {
    createTable.mutate({ category: null, order: tables?.length ?? 0 });
  }

  if (isLoading) {
    return (
      <div className="grid gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {(tables?.length ?? 0) === 0 ? (
        <p className="text-sm text-muted-foreground">No tables in this section yet.</p>
      ) : (
        tables?.map((table) => (
          <CoverageTableCard key={table.id} table={table} canEdit={canEdit} canDelete={canDelete} />
        ))
      )}
      {canEdit && (
        <Button variant="outline" size="sm" className="w-fit" disabled={createTable.isPending} onClick={addTable}>
          <PlusIcon /> Add Table
        </Button>
      )}
    </div>
  );
}
