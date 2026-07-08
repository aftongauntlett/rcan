// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { initDonorboxWidget } from "./donatePage";

const renderFixture = (): { skeleton: HTMLElement; widget: HTMLElement; shadow: ShadowRoot } => {
  document.body.innerHTML = `
    <div id="donorbox-skeleton" aria-hidden="true"></div>
    <dbox-widget class="opacity-0" aria-hidden="true" inert></dbox-widget>
  `;

  const skeleton = document.getElementById("donorbox-skeleton")!;
  const widget = document.querySelector("dbox-widget") as HTMLElement;
  const shadow = widget.attachShadow({ mode: "open" });
  shadow.innerHTML = `<div id="loading"></div><div id="donation_form"></div>`;

  return { skeleton, widget, shadow };
};

describe("initDonorboxWidget", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("reveals the widget once the loading indicator reports complete", async () => {
    const { skeleton, widget, shadow } = renderFixture();
    const form = shadow.querySelector("#donation_form") as HTMLElement;
    form.getBoundingClientRect = () => ({ width: 400, height: 600 }) as DOMRect;

    initDonorboxWidget();

    const loading = shadow.querySelector("#loading")!;
    loading.setAttribute("part", "complete");

    await vi.advanceTimersByTimeAsync(100);
    await vi.runAllTimersAsync();

    expect(skeleton.style.display).toBe("none");
    expect(widget.classList.contains("opacity-100")).toBe(true);
    expect(widget.hasAttribute("aria-hidden")).toBe(false);
    expect(widget.hasAttribute("inert")).toBe(false);
  });

  it("falls back to revealing the widget after the timeout even if never ready", async () => {
    const { skeleton, widget } = renderFixture();

    initDonorboxWidget();
    await vi.advanceTimersByTimeAsync(10000);

    expect(skeleton.style.display).toBe("none");
    expect(widget.classList.contains("opacity-100")).toBe(true);
  });
});
