"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCategory } from "../hooks/use-create-category";
import { useUpdateCategory } from "../hooks/use-update-category";
import type { Category } from "../types";
import { excludeSubtree } from "../utils/build-tree";
import { createCategorySchema, type CreateCategoryFormValues } from "../validation";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  /** Editing target. Omit to create a new category instead. */
  category?: Category;
  /** Preselects the parent when creating (e.g. "add subcategory" from the tree). Ignored while editing. */
  defaultParentId?: string | null;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  categories,
  category,
  defaultParentId = null,
}: CategoryFormDialogProps) {
  const isEditing = !!category;
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isPending = createCategory.isPending || updateCategory.isPending;

  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: category?.name ?? "",
      parentId: category ? category.parentId : defaultParentId,
      description: category?.description ?? null,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: category?.name ?? "",
        parentId: category ? category.parentId : defaultParentId,
        description: category?.description ?? null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, category, defaultParentId]);

  const parentOptions = isEditing ? excludeSubtree(categories, category.id) : categories;

  function onSubmit(values: CreateCategoryFormValues) {
    const mutation = isEditing
      ? updateCategory.mutateAsync({ id: category.id, input: values })
      : createCategory.mutateAsync(values);

    mutation.then(() => onOpenChange(false));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit category" : "New category"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this category's name, parent, or description."
              : "Create a top-level category or a subcategory under an existing one."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        {/* Base UI's SelectValue only auto-resolves a label once
                            the item list has mounted at least once; supplying
                            children explicitly avoids showing the raw stored id
                            (e.g. when editing with a parent already set). */}
                        <SelectValue>
                          {(value: string | null) =>
                            value
                              ? (parentOptions.find((o) => o.id === value)?.name ?? value)
                              : "No parent (top-level)"
                          }
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={null}>No parent (top-level)</SelectItem>
                      {parentOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving…" : isEditing ? "Save changes" : "Create category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
