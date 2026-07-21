import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import { useAuthStore } from "@/features/auth/store/auth-store";

afterEach(() => {
  useAuthStore.setState({ user: null, status: "idle" });
});

describe("PermissionGate", () => {
  it("shows a loading skeleton (not the denied card) while auth hasn't resolved yet", () => {
    useAuthStore.setState({ status: "loading" });

    render(
      <PermissionGate title="Clients" canView={false}>
        <p>secret content</p>
      </PermissionGate>
    );

    expect(screen.queryByText("secret content")).not.toBeInTheDocument();
    expect(screen.queryByText(/don't have permission/i)).not.toBeInTheDocument();
  });

  it("shows the denied card once resolved, if the user can't view", () => {
    useAuthStore.setState({ status: "authenticated" });

    render(
      <PermissionGate title="Clients" canView={false}>
        <p>secret content</p>
      </PermissionGate>
    );

    expect(screen.getByText("Clients")).toBeInTheDocument();
    expect(screen.getByText(/don't have permission/i)).toBeInTheDocument();
    expect(screen.queryByText("secret content")).not.toBeInTheDocument();
  });

  it("renders the children once resolved and the user can view", () => {
    useAuthStore.setState({ status: "authenticated" });

    render(
      <PermissionGate title="Clients" canView={true}>
        <p>secret content</p>
      </PermissionGate>
    );

    expect(screen.getByText("secret content")).toBeInTheDocument();
    expect(screen.queryByText(/don't have permission/i)).not.toBeInTheDocument();
  });

  it("also renders content once resolved as unauthenticated (edge case: canView somehow true)", () => {
    // Not a realistic path in practice (an unauthenticated user shouldn't have
    // canView=true), but proves "resolved" means either terminal status, not
    // just "authenticated" — matching the exact check every retrofitted page relies on.
    useAuthStore.setState({ status: "unauthenticated" });

    render(
      <PermissionGate title="Clients" canView={true}>
        <p>secret content</p>
      </PermissionGate>
    );

    expect(screen.getByText("secret content")).toBeInTheDocument();
  });
});
