"use client";

import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Permission } from "../types";

interface PermissionPickerProps {
  permissions: Permission[] | undefined;
  // Selection tracked by permission `key` (stable + unique), so the same
  // component works for create (empty start) and edit (preselected) alike.
  selectedKeys: Set<string>;
  onChange: (next: Set<string>) => void;
}

// Preferred resource order; anything else falls to the end alphabetically.
const RESOURCE_ORDER = ["users", "clients", "categories", "reports"];
const RESOURCE_LABELS: Record<string, string> = {
  users: "Users",
  clients: "Clients",
  categories: "Categories",
  reports: "Reports",
};

interface Group {
  resource: string;
  label: string;
  items: Permission[];
}

function groupByResource(permissions: Permission[]): Group[] {
  const map = new Map<string, Permission[]>();
  for (const permission of permissions) {
    const resource = permission.key.split(":")[0];
    const list = map.get(resource) ?? [];
    list.push(permission);
    map.set(resource, list);
  }

  return [...map.keys()]
    .sort((a, b) => {
      const ia = RESOURCE_ORDER.indexOf(a);
      const ib = RESOURCE_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
    })
    .map((resource) => ({
      resource,
      label: RESOURCE_LABELS[resource] ?? resource.charAt(0).toUpperCase() + resource.slice(1),
      items: map.get(resource)!,
    }));
}

export function PermissionPicker({ permissions, selectedKeys, onChange }: PermissionPickerProps) {
  const groups = useMemo(() => groupByResource(permissions ?? []), [permissions]);

  function setMany(keys: string[], checked: boolean) {
    const next = new Set(selectedKeys);
    for (const key of keys) {
      if (checked) next.add(key);
      else next.delete(key);
    }
    onChange(next);
  }

  if (groups.length === 0) {
    return <p className="text-sm text-muted-foreground">No permissions exist yet.</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {groups.map((group) => {
        const keys = group.items.map((item) => item.key);
        const allChecked = keys.every((key) => selectedKeys.has(key));
        return (
          <div key={group.resource} className="rounded-md border p-3">
            <label className="mb-2 flex items-center justify-between gap-2 border-b pb-2">
              <span className="text-sm font-semibold">{group.label}</span>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                All
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={(checked) => setMany(keys, checked === true)}
                />
              </span>
            </label>
            <div className="grid gap-2">
              {group.items.map((permission) => (
                <label key={permission.id} className="flex items-start gap-2">
                  <Checkbox
                    checked={selectedKeys.has(permission.key)}
                    onCheckedChange={(checked) => setMany([permission.key], checked === true)}
                  />
                  <span className="grid gap-0.5">
                    <span className="font-mono text-xs font-medium">{permission.key}</span>
                    {permission.description && (
                      <span className="text-xs text-muted-foreground">{permission.description}</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
