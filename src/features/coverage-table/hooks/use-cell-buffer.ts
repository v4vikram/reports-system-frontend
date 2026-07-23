"use client";

import { useEffect, useRef, useState } from "react";

// Inline-editable grid cells need local state so typing doesn't round-trip
// to the server on every keystroke — commit happens on blur instead. But
// every row mutation invalidates the whole `coverage-tables` query (see
// use-update-coverage-row.ts), which refetches every table currently
// mounted, including ones the user isn't touching. Naively syncing local
// state from the prop on every render would let Row B's save stomp Row A's
// still-unsaved keystrokes back to A's last-saved value the moment B's
// invalidation resolves. Only resyncing while NOT focused avoids that.
export function useCellBuffer(serverValue: string, onCommit: (value: string) => void) {
  const [value, setValue] = useState(serverValue);
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setValue(serverValue);
  }, [serverValue]);

  return {
    value,
    onChange: (next: string) => setValue(next),
    onFocus: () => {
      focused.current = true;
    },
    onBlur: () => {
      focused.current = false;
      if (value !== serverValue) onCommit(value);
    },
  };
}
