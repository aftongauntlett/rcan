import { describe, expect, it } from "vitest";

import { resolveInitialOption, type DropdownOption } from "./dropdown";

describe("resolveInitialOption", () => {
  const options: DropdownOption[] = [
    { value: "partnership", label: "Congregation partnership" },
    { value: "volunteer", label: "Volunteer interest" },
    { value: "referral", label: "Referral question", disabled: true },
  ];

  it("returns the matching default option when it is enabled", () => {
    const result = resolveInitialOption(options, "volunteer");

    expect(result.value).toBe("volunteer");
  });

  it("falls back to the first enabled option when default is missing", () => {
    const result = resolveInitialOption(options, "does-not-exist");

    expect(result.value).toBe("partnership");
  });

  it("throws when all options are disabled", () => {
    expect(() =>
      resolveInitialOption([
        { value: "a", label: "A", disabled: true },
        { value: "b", label: "B", disabled: true },
      ]),
    ).toThrow("CustomDropdown requires at least one enabled option.");
  });
});
