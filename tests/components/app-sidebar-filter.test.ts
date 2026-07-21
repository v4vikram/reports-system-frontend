import { describe, expect, it } from "vitest";
import { filterVisibleNavItems, type NavItem } from "@/components/layout/app-sidebar";

const Icon = () => null;

const items: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: Icon }, // no anyPermission — always visible
  { title: "Clients", url: "/dashboard/clients", icon: Icon, anyPermission: ["clients:read"] },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: Icon,
    anyPermission: ["reports:read", "reports:read-all"],
  },
];

describe("filterVisibleNavItems", () => {
  it("always includes items with no anyPermission requirement", () => {
    const visible = filterVisibleNavItems(items, () => false);
    expect(visible.map((i) => i.title)).toEqual(["Dashboard"]);
  });

  it("includes an item once the user holds its required permission", () => {
    const visible = filterVisibleNavItems(items, (key) => key === "clients:read");
    expect(visible.map((i) => i.title)).toEqual(["Dashboard", "Clients"]);
  });

  it("uses OR semantics for multi-key anyPermission (holding just one is enough)", () => {
    const visible = filterVisibleNavItems(items, (key) => key === "reports:read-all");
    expect(visible.map((i) => i.title)).toContain("Reports");
  });

  it("a zero-permission user only sees the unconditional items", () => {
    const visible = filterVisibleNavItems(items, () => false);
    expect(visible).toHaveLength(1);
  });
});
