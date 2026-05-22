// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";

import { getWrappedIndex, initCarousels } from "./carousel";

const renderCarouselFixture = () => {
  document.body.innerHTML = `
    <section data-carousel>
      <figure data-carousel-slide class="opacity-100"></figure>
      <figure data-carousel-slide class="opacity-0 pointer-events-none"></figure>
      <button type="button" data-carousel-prev>Prev</button>
      <p data-carousel-status></p>
      <button type="button" data-carousel-next>Next</button>
    </section>
  `;
};

describe("getWrappedIndex", () => {
  it("wraps backward from index 0", () => {
    expect(getWrappedIndex(0, -1, 2)).toBe(1);
  });

  it("wraps forward from last index", () => {
    expect(getWrappedIndex(1, 1, 2)).toBe(0);
  });

  it("returns zero when total is non-positive", () => {
    expect(getWrappedIndex(2, 1, 0)).toBe(0);
  });
});

describe("initCarousels", () => {
  beforeEach(() => {
    renderCarouselFixture();
  });

  it("renders initial status and aria-hidden state", () => {
    initCarousels(document);

    const status = document.querySelector("[data-carousel-status]");
    const slides = Array.from(document.querySelectorAll("[data-carousel-slide]"));

    expect(status?.textContent).toBe("1 / 2");
    expect(slides[0]?.getAttribute("aria-hidden")).toBe("false");
    expect(slides[1]?.getAttribute("aria-hidden")).toBe("true");
  });

  it("updates to next slide and then wraps back to first", () => {
    initCarousels(document);

    const nextButton = document.querySelector("[data-carousel-next]");
    const status = document.querySelector("[data-carousel-status]");
    const slides = Array.from(document.querySelectorAll("[data-carousel-slide]"));

    if (!(nextButton instanceof HTMLButtonElement)) {
      throw new Error("Fixture setup failed");
    }

    nextButton.click();
    expect(status?.textContent).toBe("2 / 2");
    expect(slides[1]?.classList.contains("opacity-100")).toBe(true);

    nextButton.click();
    expect(status?.textContent).toBe("1 / 2");
    expect(slides[0]?.classList.contains("opacity-100")).toBe(true);
  });
});
