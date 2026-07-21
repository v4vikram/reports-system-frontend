import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// RTL's auto-cleanup-after-each-test only self-registers under Jest globals;
// under Vitest it has to be wired up explicitly, or renders from one test
// leak into the next (same jsdom document, never unmounted).
afterEach(() => {
  cleanup();
});
