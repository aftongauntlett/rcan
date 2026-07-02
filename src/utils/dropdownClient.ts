interface DropdownInstance {
  root: HTMLElement;
  trigger: HTMLButtonElement;
  menu: HTMLElement;
  input: HTMLInputElement;
  label: HTMLElement;
  chevron: HTMLElement | null;
  options: HTMLButtonElement[];
}

type DropdownWindow = Window & {
  __rcanDropdownBootstrapped?: boolean;
};

let openInstance: DropdownInstance | null = null;

const getEnabledOptions = (instance: DropdownInstance): HTMLButtonElement[] =>
  instance.options.filter((option) => !option.disabled && option.getAttribute("aria-disabled") !== "true");

const getSelectedOption = (instance: DropdownInstance): HTMLButtonElement | null => {
  const checkedOption = instance.options.find((option) => option.getAttribute("aria-checked") === "true");
  if (checkedOption && !checkedOption.disabled) {
    return checkedOption;
  }

  const [firstEnabledOption] = getEnabledOptions(instance);
  return firstEnabledOption ?? null;
};

const setChevronState = (instance: DropdownInstance, isOpen: boolean): void => {
  instance.chevron?.classList.toggle("rotate-90", !isOpen);
  instance.chevron?.classList.toggle("-rotate-90", isOpen);
};

const setOptionSelectedStyles = (option: HTMLButtonElement, isSelected: boolean): void => {
  option.classList.toggle("bg-surface-subtle", isSelected);
  option.classList.toggle("text-brand-primary", isSelected);
  option.classList.toggle("text-text-default", !isSelected);

  const checkIcon = option.querySelector<HTMLElement>("[data-dropdown-check]");
  if (checkIcon) {
    checkIcon.classList.toggle("opacity-100", isSelected);
    checkIcon.classList.toggle("opacity-0", !isSelected);
  }
};

const setSelectedOption = (instance: DropdownInstance, selected: HTMLButtonElement): void => {
  instance.options.forEach((option) => {
    const isSelected = option === selected;
    option.setAttribute("aria-checked", isSelected ? "true" : "false");
    setOptionSelectedStyles(option, isSelected);
  });

  instance.input.value = selected.dataset.value ?? "";
  instance.label.textContent = selected.dataset.label ?? "";

  instance.input.dispatchEvent(new Event("input", { bubbles: true }));
  instance.input.dispatchEvent(new Event("change", { bubbles: true }));
};

const closeDropdown = (instance: DropdownInstance, focusTrigger: boolean): void => {
  instance.root.dataset.dropdownOpen = "false";
  instance.trigger.setAttribute("aria-expanded", "false");
  instance.menu.hidden = true;
  setChevronState(instance, false);

  if (focusTrigger) {
    instance.trigger.focus();
  }

  if (openInstance?.root === instance.root) {
    openInstance = null;
  }
};

const openDropdown = (instance: DropdownInstance, focusSelected: boolean): void => {
  if (openInstance && openInstance.root !== instance.root) {
    closeDropdown(openInstance, false);
  }

  instance.root.dataset.dropdownOpen = "true";
  instance.trigger.setAttribute("aria-expanded", "true");
  instance.menu.hidden = false;
  setChevronState(instance, true);
  openInstance = instance;

  if (focusSelected) {
    getSelectedOption(instance)?.focus();
  }
};

const moveOptionFocus = (instance: DropdownInstance, direction: 1 | -1): void => {
  const enabledOptions = getEnabledOptions(instance);
  if (enabledOptions.length === 0) {
    return;
  }

  const activeElement = document.activeElement;
  const currentIndex = activeElement instanceof HTMLButtonElement ? enabledOptions.indexOf(activeElement) : -1;
  const selectedOption = getSelectedOption(instance);
  const selectedIndex = selectedOption ? enabledOptions.indexOf(selectedOption) : -1;
  const startIndex = currentIndex >= 0 ? currentIndex : selectedIndex;
  const nextIndex = (startIndex + direction + enabledOptions.length) % enabledOptions.length;

  enabledOptions[nextIndex]?.focus();
};

const getOptionFromEventTarget = (target: EventTarget | null): HTMLButtonElement | null => {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const optionButton = target.closest<HTMLButtonElement>("[data-dropdown-option]");
  return optionButton && !optionButton.disabled ? optionButton : null;
};

const getDropdownInstance = (root: HTMLElement): DropdownInstance | null => {
  const trigger = root.querySelector<HTMLButtonElement>("[data-dropdown-trigger]");
  const menu = root.querySelector<HTMLElement>("[data-dropdown-menu]");
  const input = root.querySelector<HTMLInputElement>("[data-dropdown-input]");
  const label = root.querySelector<HTMLElement>("[data-dropdown-label]");
  const chevron = root.querySelector<HTMLElement>("[data-dropdown-chevron]");
  const options = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-dropdown-option]"));

  if (!trigger || !menu || !input || !label || options.length === 0) {
    return null;
  }

  return { root, trigger, menu, input, label, chevron, options };
};

const initDropdown = (root: HTMLElement): void => {
  if (root.dataset.dropdownInitialized === "true") {
    return;
  }

  const instance = getDropdownInstance(root);
  if (!instance) {
    return;
  }

  root.dataset.dropdownInitialized = "true";

  const matchingOption = instance.options.find(
    (option) => option.dataset.value === instance.input.value && !option.disabled,
  );
  const selectedOption = matchingOption ?? getEnabledOptions(instance)[0] ?? null;
  if (selectedOption) {
    setSelectedOption(instance, selectedOption);
  }

  closeDropdown(instance, false);

  instance.trigger.addEventListener("click", () => {
    if (instance.trigger.getAttribute("aria-expanded") === "true") {
      closeDropdown(instance, false);
    } else {
      openDropdown(instance, false);
    }
  });

  instance.trigger.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openDropdown(instance, true);
      moveOptionFocus(instance, 1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      openDropdown(instance, true);
      moveOptionFocus(instance, -1);
    }

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (instance.trigger.getAttribute("aria-expanded") === "true") {
        closeDropdown(instance, false);
      } else {
        openDropdown(instance, true);
      }
    }

    if (event.key === "Escape") {
      closeDropdown(instance, false);
    }
  });

  instance.menu.addEventListener("click", (event) => {
    const optionButton = getOptionFromEventTarget(event.target);
    if (!optionButton) {
      return;
    }

    setSelectedOption(instance, optionButton);
    closeDropdown(instance, true);
  });

  instance.menu.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveOptionFocus(instance, 1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveOptionFocus(instance, -1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      getEnabledOptions(instance)[0]?.focus();
    }

    if (event.key === "End") {
      event.preventDefault();
      const enabledOptions = getEnabledOptions(instance);
      enabledOptions[enabledOptions.length - 1]?.focus();
    }

    if (event.key === "Enter" || event.key === " ") {
      const optionButton = getOptionFromEventTarget(event.target);
      if (optionButton) {
        event.preventDefault();
        setSelectedOption(instance, optionButton);
        closeDropdown(instance, true);
      }
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeDropdown(instance, true);
    }
  });

  root.addEventListener("focusout", (event) => {
    const nextFocusedElement = event.relatedTarget;

    if (nextFocusedElement instanceof Node && root.contains(nextFocusedElement)) {
      return;
    }

    closeDropdown(instance, false);
  });
};

const handleDocumentPointerDown = (event: PointerEvent): void => {
  if (!openInstance) {
    return;
  }

  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }

  if (!openInstance.root.contains(target)) {
    closeDropdown(openInstance, false);
  }
};

export const initCustomDropdowns = (root: ParentNode = document): void => {
  if (openInstance && !document.body.contains(openInstance.root)) {
    openInstance = null;
  }

  root.querySelectorAll<HTMLElement>("[data-custom-dropdown]").forEach((dropdownRoot) => {
    initDropdown(dropdownRoot);
  });
};

export const selectCustomDropdownValue = (root: HTMLElement, value: string): boolean => {
  const instance = getDropdownInstance(root);
  if (!instance) {
    return false;
  }

  const matchedOption = instance.options.find((option) => option.dataset.value === value && !option.disabled);
  if (!matchedOption) {
    return false;
  }

  setSelectedOption(instance, matchedOption);
  return true;
};

export const bootstrapCustomDropdowns = (): void => {
  const dropdownWindow = window as DropdownWindow;

  if (!dropdownWindow.__rcanDropdownBootstrapped) {
    document.addEventListener("DOMContentLoaded", () => initCustomDropdowns());
    document.addEventListener("astro:page-load", () => initCustomDropdowns());
    document.addEventListener("pointerdown", handleDocumentPointerDown);
    dropdownWindow.__rcanDropdownBootstrapped = true;
  }

  initCustomDropdowns();
};
