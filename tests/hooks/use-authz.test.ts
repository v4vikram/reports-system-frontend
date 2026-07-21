import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useHasPermission, useHasRole } from "@/features/auth/hooks/use-authz";

afterEach(() => {
  useAuthStore.setState({ user: null, status: "idle" });
});

describe("useHasPermission", () => {
  it("returns false for every key before /me has resolved (user is null)", () => {
    const { result } = renderHook(() => useHasPermission());
    expect(result.current("clients:read")).toBe(false);
  });

  it("returns true only for keys in the user's effective permissions", () => {
    useAuthStore.setState({
      status: "authenticated",
      user: {
        id: "u1",
        name: "Test",
        email: "t@test.local",
        roles: [{ id: "r1", name: "EMPLOYEE" }],
        permissions: ["clients:read", "reports:read"],
        portalClientId: null,
      },
    });

    const { result } = renderHook(() => useHasPermission());
    expect(result.current("clients:read")).toBe(true);
    expect(result.current("clients:read-all")).toBe(false);
  });
});

describe("useHasRole", () => {
  it("returns false when the user has no roles (or isn't loaded)", () => {
    const { result } = renderHook(() => useHasRole());
    expect(result.current("ADMIN")).toBe(false);
  });

  it("returns true only for a role the user actually holds", () => {
    useAuthStore.setState({
      status: "authenticated",
      user: {
        id: "u1",
        name: "Test",
        email: "t@test.local",
        roles: [{ id: "r1", name: "CLIENT" }],
        permissions: [],
        portalClientId: null,
      },
    });

    const { result } = renderHook(() => useHasRole());
    expect(result.current("CLIENT")).toBe(true);
    expect(result.current("ADMIN")).toBe(false);
  });
});
