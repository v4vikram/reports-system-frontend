"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHasPermission } from "@/features/auth";
import {
  buildCategoryTree,
  CategoryFormDialog,
  CategoryTree,
  DeleteCategoryDialog,
  PERMISSIONS,
  useCategories,
  type Category,
} from "@/features/category";

export default function CategoriesPage() {
  const hasPermission = useHasPermission();
  const canView = hasPermission(PERMISSIONS.CATEGORIES_READ);
  const canManage = hasPermission(PERMISSIONS.CATEGORIES_MANAGE);
  const { data: categories, isLoading } = useCategories({ enabled: canView });

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [defaultParentId, setDefaultParentId] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  function openCreate() {
    setEditingCategory(undefined);
    setDefaultParentId(null);
    setFormOpen(true);
  }

  function openAddChild(parent: Category) {
    setEditingCategory(undefined);
    setDefaultParentId(parent.id);
    setFormOpen(true);
  }

  function openEdit(category: Category) {
    setEditingCategory(category);
    setFormOpen(true);
  }

  const tree = categories ? buildCategoryTree(categories) : [];

  if (!canView) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>You don&apos;t have permission to view this page.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Organize content into nested categories.</CardDescription>
          </div>
          {canManage && (
            <Button size="sm" onClick={openCreate}>
              <PlusIcon /> New category
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-2/5" />
            </div>
          ) : (
            <CategoryTree
              nodes={tree}
              categories={categories ?? []}
              onAddChild={openAddChild}
              onEdit={openEdit}
              onDelete={setDeletingCategory}
            />
          )}
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        categories={categories ?? []}
        category={editingCategory}
        defaultParentId={defaultParentId}
      />

      <DeleteCategoryDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        category={deletingCategory}
      />
    </div>
  );
}
