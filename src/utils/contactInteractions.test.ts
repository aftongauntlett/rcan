import { describe, expect, it } from "vitest";

import {
  CONGREGATION_PARTNERSHIP_TOPIC,
  getCongregationFieldState,
  resolveCopyValue,
  shouldResetSubmitState,
} from "./contactInteractions";

describe("getCongregationFieldState", () => {
  it("shows and requires field for congregation partnership topic", () => {
    const result = getCongregationFieldState(CONGREGATION_PARTNERSHIP_TOPIC);

    expect(result).toEqual({
      showField: true,
      required: true,
      shouldClearInput: false,
    });
  });

  it("hides, unrequires, and clears field for non-partnership topic", () => {
    const result = getCongregationFieldState("General question");

    expect(result).toEqual({
      showField: false,
      required: false,
      shouldClearInput: true,
    });
  });
});

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
