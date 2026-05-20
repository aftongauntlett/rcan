export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export const resolveInitialOption = (
  options: readonly DropdownOption[],
  defaultValue?: string,
): DropdownOption => {
  const enabledOptions = options.filter((option) => !option.disabled);

  if (enabledOptions.length === 0) {
    throw new Error("CustomDropdown requires at least one enabled option.");
  }

  if (defaultValue) {
    const matchedOption = enabledOptions.find((option) => option.value === defaultValue);
    if (matchedOption) {
      return matchedOption;
    }
  }

  return enabledOptions[0];
};
