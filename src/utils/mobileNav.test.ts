// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";

import { initMobileNavDialog } from "./mobileNav";

type TestDialog = HTMLDialogElement & {
  showModal: () => void;
  close: () => void;
};

const renderNavFixture = () => {
  document.body.innerHTML = `
    <button type="button" data-mobile-nav-open>Open</button>
    <dialog data-mobile-nav-dialog>
      <div>
        <button type="button" data-mobile-nav-close>Close</button>
        <a href="/about">About</a>
      </div>
    </dialog>
  `;

  const dialog = document.querySelector("[data-mobile-nav-dialog]");
  if (!(dialog instanceof HTMLDialogElement)) {
    throw new Error("Fixture setup failed");
  }

  const testDialog = dialog as TestDialog;
  testDialog.showModal = () => {
    dialog.open = true;
    dialog.setAttribute("open", "");
  };
  testDialog.close = () => {
    dialog.open = false;
    dialog.removeAttribute("open");
    dialog.dispatchEvent(new Event("close"));
  };
};

describe("initMobileNavDialog", () => {
  beforeEach(() => {
    renderNavFixture();
  });

  it("opens the dialog and moves focus into it", () => {
    const openButton = document.querySelector("[data-mobile-nav-open]");
    const dialog = document.querySelector("[data-mobile-nav-dialog]");

    if (!(openButton instanceof HTMLButtonElement) || !(dialog instanceof HTMLDialogElement)) {
      throw new Error("Fixture setup failed");
    }

    initMobileNavDialog(document);
    openButton.focus();
    openButton.click();

    expect(dialog.open).toBe(true);
    expect(document.activeElement).not.toBe(openButton);
  });

  it("closes from close button and restores focus to opener", () => {
    const openButton = document.querySelector("[data-mobile-nav-open]");
    const closeButton = document.querySelector("[data-mobile-nav-close]");
    const dialog = document.querySelector("[data-mobile-nav-dialog]");

    if (
      !(openButton instanceof HTMLButtonElement) ||
      !(closeButton instanceof HTMLButtonElement) ||
      !(dialog instanceof HTMLDialogElement)
    ) {
      throw new Error("Fixture setup failed");
    }

    initMobileNavDialog(document);
    openButton.focus();
    openButton.click();
    closeButton.click();

    expect(dialog.open).toBe(false);
    expect(document.activeElement).toBe(openButton);
  });

  it("closes when a mobile nav link is clicked", () => {
    const openButton = document.querySelector("[data-mobile-nav-open]");
    const link = document.querySelector("a[href='/about']");
    const dialog = document.querySelector("[data-mobile-nav-dialog]");

    if (
      !(openButton instanceof HTMLButtonElement) ||
      !(link instanceof HTMLAnchorElement) ||
      !(dialog instanceof HTMLDialogElement)
    ) {
      throw new Error("Fixture setup failed");
    }

    initMobileNavDialog(document);
    openButton.click();
    link.click();

    expect(dialog.open).toBe(false);
  });
});
