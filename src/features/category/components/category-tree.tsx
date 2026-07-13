"use client";

import { ChevronRightIcon, FolderIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuthStore } from "@/features/auth";
import { PERMISSIONS } from "../constants";
import type { Category, CategoryTreeNode } from "../types";

interface CategoryTreeProps {
  nodes: CategoryTreeNode[];
  categories: Category[];
  onAddChild: (parent: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTree({ nodes, categories, onAddChild, onEdit, onDelete }: CategoryTreeProps) {
  if (nodes.length === 0) {
    return <p className="text-sm text-muted-foreground">No categories yet.</p>;
  }

  return (
    <ul className="grid gap-1">
      {nodes.map((node) => (
        <CategoryTreeItem
          key={node.id}
          node={node}
          categories={categories}
          onAddChild={onAddChild}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

function CategoryTreeItem({
  node,
  categories,
  onAddChild,
  onEdit,
  onDelete,
}: {
  node: CategoryTreeNode;
  categories: Category[];
  onAddChild: (parent: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}) {
  const [open, setOpen] = useState(true);
  const canManage = useAuthStore((state) => state.hasPermission(PERMISSIONS.CATEGORIES_MANAGE));
  const hasChildren = node.children.length > 0;

  return (
    <li>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="group flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-muted">
          <CollapsibleTrigger
            render={
              <Button variant="ghost" size="icon-xs" disabled={!hasChildren}>
                <ChevronRightIcon
                  className={`transition-transform ${open ? "rotate-90" : ""} ${
                    hasChildren ? "" : "opacity-0"
                  }`}
                />
              </Button>
            }
          />
          <FolderIcon className="size-4 text-muted-foreground" />
          <span className="flex-1 truncate text-sm">{node.name}</span>
          {!node.isActive && <span className="text-xs text-muted-foreground">(inactive)</span>}
          {canManage && (
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
              <Button variant="ghost" size="icon-xs" onClick={() => onAddChild(node)} title="Add subcategory">
                <PlusIcon />
              </Button>
              <Button variant="ghost" size="icon-xs" onClick={() => onEdit(node)} title="Edit">
                <PencilIcon />
              </Button>
              <Button variant="ghost" size="icon-xs" onClick={() => onDelete(node)} title="Delete">
                <Trash2Icon />
              </Button>
            </div>
          )}
        </div>
        {hasChildren && (
          <CollapsibleContent>
            <ul className="ml-5 grid gap-1 border-l pl-2">
              {node.children.map((child) => (
                <CategoryTreeItem
                  key={child.id}
                  node={child}
                  categories={categories}
                  onAddChild={onAddChild}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </ul>
          </CollapsibleContent>
        )}
      </Collapsible>
    </li>
  );
}
