interface StyledDropdownElements {
  root: HTMLElement;
  trigger: HTMLButtonElement;
  listbox: HTMLElement;
  valueText: HTMLElement;
  nativeSelect: HTMLSelectElement;
  announcer: HTMLElement;
}

const getOptionItems = (listbox: HTMLElement): HTMLElement[] =>
  Array.from(listbox.querySelectorAll<HTMLElement>("[data-dropdown-option]"));

const getEnabledOptions = (listbox: HTMLElement): HTMLElement[] =>
  getOptionItems(listbox).filter((o) => o.dataset.disabled !== "true");

const getValue = (option: HTMLElement): string => option.dataset.value ?? "";
const getLabel = (option: HTMLElement): string =>
  option.dataset.label ?? option.textContent?.trim() ?? "";

const markSelection = (listbox: HTMLElement, selectedValue: string): void => {
  getOptionItems(listbox).forEach((option) => {
    const isSelected = getValue(option) === selectedValue;
    option.setAttribute("aria-selected", isSelected ? "true" : "false");
    option.classList.toggle("is-selected", isSelected);
  });
};

const setActiveDescendant = (
  trigger: HTMLButtonElement,
  activeOption: HTMLElement | null,
): void => {
  const listbox = trigger.parentElement?.querySelector<HTMLElement>("[data-dropdown-listbox]");
  if (listbox) {
    getOptionItems(listbox).forEach((o) =>
      o.classList.toggle("is-active", activeOption?.id === o.id),
    );
  }
  if (activeOption) {
    trigger.setAttribute("aria-activedescendant", activeOption.id);
  } else {
    trigger.removeAttribute("aria-activedescendant");
  }
};

const syncValueTextColor = (valueText: HTMLElement, selectedValue: string): void => {
  valueText.classList.toggle("text-text-subtle", selectedValue === "");
  valueText.classList.toggle("text-text-default", selectedValue !== "");
};

const closeDropdown = (elements: StyledDropdownElements): void => {
  elements.root.classList.remove("is-open");
  elements.trigger.setAttribute("aria-expanded", "false");
  elements.listbox.hidden = true;
  setActiveDescendant(elements.trigger, null);
};

const openDropdown = (elements: StyledDropdownElements): void => {
  elements.root.classList.add("is-open");
  elements.trigger.setAttribute("aria-expanded", "true");
  elements.listbox.hidden = false;
};

const syncFromNative = (elements: StyledDropdownElements): void => {
  const selectedValue = elements.nativeSelect.value;
  const selectedOption = getOptionItems(elements.listbox).find(
    (o) => getValue(o) === selectedValue,
  );
  const nextLabel = selectedOption
    ? getLabel(selectedOption)
    : (elements.nativeSelect.options[0]?.text ?? "");

  elements.valueText.textContent = nextLabel;
  syncValueTextColor(elements.valueText, selectedValue);
  markSelection(elements.listbox, selectedValue);
  elements.announcer.textContent =
    selectedValue === "" ? "No option selected." : `Selected: ${nextLabel}`;
};

export function bootstrapStyledDropdown(root: HTMLElement): void {
  if (root.dataset.sdInitialized === "true") return;

  const trigger = root.querySelector<HTMLButtonElement>("[data-dropdown-trigger]");
  const listbox = root.querySelector<HTMLElement>("[data-dropdown-listbox]");
  const valueText = root.querySelector<HTMLElement>("[data-dropdown-value]");
  const nativeSelect = root.querySelector<HTMLSelectElement>("[data-dropdown-native]");
  const announcer = root.querySelector<HTMLElement>("[data-dropdown-announcer]");

  if (!trigger || !listbox || !valueText || !nativeSelect || !announcer) return;

  const elements: StyledDropdownElements = {
    root,
    trigger,
    listbox,
    valueText,
    nativeSelect,
    announcer,
  };

  root.dataset.sdInitialized = "true";
  root.classList.add("is-enhanced");
  trigger.hidden = false;

  const moveActiveOption = (direction: 1 | -1): void => {
    const enabled = getEnabledOptions(elements.listbox);
    if (!enabled.length) return;

    const activeId = elements.trigger.getAttribute("aria-activedescendant");
    const currentIndex = enabled.findIndex((o) => o.id === activeId);
    const selectedIndex = enabled.findIndex(
      (o) => getValue(o) === elements.nativeSelect.value,
    );
    const startIndex = currentIndex >= 0 ? currentIndex : selectedIndex >= 0 ? selectedIndex : 0;
    const nextIndex = (startIndex + direction + enabled.length) % enabled.length;
    const nextOption = enabled[nextIndex];
    setActiveDescendant(elements.trigger, nextOption);
    nextOption.scrollIntoView({ block: "nearest" });
  };

  const selectOption = (option: HTMLElement): void => {
    if (option.dataset.disabled === "true") return;

    const nextValue = getValue(option);
    const nextLabel = getLabel(option);

    elements.nativeSelect.value = nextValue;
    elements.valueText.textContent = nextLabel;
    syncValueTextColor(elements.valueText, nextValue);
    markSelection(elements.listbox, nextValue);
    elements.announcer.textContent =
      nextValue === "" ? "No option selected." : `Selected: ${nextLabel}`;
    elements.nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));

    closeDropdown(elements);
    elements.trigger.focus();
  };

  trigger.addEventListener("click", () => {
    elements.root.classList.contains("is-open")
      ? closeDropdown(elements)
      : openDropdown(elements);
  });

  trigger.addEventListener("keydown", (event) => {
    const isOpen = elements.root.classList.contains("is-open");

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) openDropdown(elements);
      moveActiveOption(event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!isOpen) {
        openDropdown(elements);
        return;
      }
      const activeId = elements.trigger.getAttribute("aria-activedescendant");
      const activeOption = activeId
        ? elements.listbox.querySelector<HTMLElement>(`#${CSS.escape(activeId)}`)
        : (getEnabledOptions(elements.listbox)[0] ?? null);
      if (activeOption) selectOption(activeOption);
      return;
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      closeDropdown(elements);
      return;
    }

    if (event.key === "Tab" && isOpen) {
      closeDropdown(elements);
    }
  });

  listbox.addEventListener("click", (event) => {
    const option = (event.target as HTMLElement).closest<HTMLElement>("[data-dropdown-option]");
    if (option) selectOption(option);
  });

  document.addEventListener("pointerdown", (event) => {
    if (!(event.target instanceof Node) || !elements.root.contains(event.target)) {
      closeDropdown(elements);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.root.classList.contains("is-open")) {
      closeDropdown(elements);
      elements.trigger.focus();
    }
  });

  const parentForm = elements.nativeSelect.form;
  if (parentForm) {
    parentForm.addEventListener("reset", () => {
      window.requestAnimationFrame(() => {
        syncFromNative(elements);
        closeDropdown(elements);
      });
    });
  }

  syncFromNative(elements);
}

export function bootstrapAllStyledDropdowns(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLElement>("[data-styled-dropdown]").forEach(bootstrapStyledDropdown);
}
