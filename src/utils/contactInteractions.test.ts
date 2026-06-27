import { describe, expect, it } from "vitest";

import { resolveCopyValue, shouldResetSubmitState } from "./contactInteractions";

describe("resolveCopyValue", () => {
  it("prefers visible row text when present", () => {
    expect(resolveCopyValue("  visible value  ", "fallback")).toBe("visible value");
  });

  it("falls back to dataset value when row text is empty", () => {
    expect(resolveCopyValue("   ", "fallback value")).toBe("fallback value");
  });
});

describe("shouldResetSubmitState", () => {
  it("returns true when success message exists", () => {
    expect(shouldResetSubmitState("Sent", "")).toBe(true);
  });

  it("returns true when error message exists", () => {
    expect(shouldResetSubmitState("", "Error")).toBe(true);
  });

  it("returns false when no message exists", () => {
    expect(shouldResetSubmitState("", "  ")).toBe(false);
  });
});
