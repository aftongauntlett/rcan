interface MobileNavElements {
  openButton: HTMLButtonElement;
  dialog: HTMLDialogElement;
}

const findMobileNavElements = (root: ParentNode): MobileNavElements | null => {
  const openButton = root.querySelector("[data-mobile-nav-open]");
  const dialog = root.querySelector("[data-mobile-nav-dialog]");

  if (!(openButton instanceof HTMLButtonElement) || !(dialog instanceof HTMLDialogElement)) {
    return null;
  }

  return { openButton, dialog };
};

export const initMobileNavDialog = (root: ParentNode = document): void => {
  const elements = findMobileNavElements(root);
  if (!elements) {
    return;
  }

  const { openButton, dialog } = elements;

  if (openButton.dataset.mobileNavBound === "true") {
    return;
  }

  const closeButton = dialog.querySelector("[data-mobile-nav-close]");
  const dialogContent = dialog.firstElementChild;
  let returnFocusEl: HTMLElement | null = null;

  const closeDialog = () => {
    if (dialog.open) {
      dialog.close();
    }
  };

  openButton.addEventListener("click", () => {
    returnFocusEl = openButton;
    dialog.showModal();

    const firstInteractive = dialog.querySelector("a[href], button:not([disabled])");
    if (firstInteractive instanceof HTMLElement) {
      firstInteractive.focus();
    }
  });

  if (closeButton instanceof HTMLButtonElement) {
    closeButton.addEventListener("click", closeDialog);
  }

  dialog.addEventListener("click", (event) => {
    if (!(dialogContent instanceof HTMLElement)) {
      return;
    }

    if (!(event.target instanceof Node)) {
      return;
    }

    if (!dialogContent.contains(event.target)) {
      closeDialog();
    }
  });

  dialog.querySelectorAll("a[href]").forEach((link) => {
    if (link instanceof HTMLAnchorElement) {
      link.addEventListener("click", closeDialog);
    }
  });

  dialog.addEventListener("close", () => {
    if (returnFocusEl instanceof HTMLElement) {
      returnFocusEl.focus();
    }
  });

  openButton.dataset.mobileNavBound = "true";
};
