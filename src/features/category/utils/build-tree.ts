import type { Category, CategoryTreeNode } from "../types";

export function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const nodesById = new Map<string, CategoryTreeNode>(
    categories.map((category) => [category.id, { ...category, children: [] }])
  );
  const roots: CategoryTreeNode[] = [];

  for (const category of categories) {
    const node = nodesById.get(category.id)!;
    if (category.parentId) {
      nodesById.get(category.parentId)?.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

// Descendants of `excludeId` (plus itself) can't be a valid new parent —
// picking one would be a cycle the backend rejects anyway; filtering them
// out of the picker is just UX, the backend's assertNoCycle is the real guard.
export function excludeSubtree(categories: Category[], excludeId: string): Category[] {
  const excluded = new Set<string>([excludeId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const category of categories) {
      if (category.parentId && excluded.has(category.parentId) && !excluded.has(category.id)) {
        excluded.add(category.id);
        changed = true;
      }
    }
  }
  return categories.filter((category) => !excluded.has(category.id));
}
