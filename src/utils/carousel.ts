export const getWrappedIndex = (currentIndex: number, offset: number, total: number): number => {
  if (total <= 0) {
    return 0;
  }

  return (currentIndex + offset + total) % total;
};

const AUTOPLAY_INTERVAL_MS = 5000;

const renderCarousel = (slides: HTMLElement[], status: HTMLElement, currentIndex: number): void => {
  slides.forEach((slide, index) => {
    const isActive = index === currentIndex;
    slide.classList.toggle("opacity-100", isActive);
    slide.classList.toggle("opacity-0", !isActive);
    slide.classList.toggle("pointer-events-none", !isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  status.textContent = `Photo ${currentIndex + 1} of ${slides.length}`;
};

const initSingleCarousel = (carousel: Element): void => {
  const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]")).filter(
    (slide): slide is HTMLElement => slide instanceof HTMLElement,
  );
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const status = carousel.querySelector("[data-carousel-status]");

  if (
    !(prevButton instanceof HTMLButtonElement) ||
    !(nextButton instanceof HTMLButtonElement) ||
    !(status instanceof HTMLElement) ||
    slides.length === 0
  ) {
    return;
  }

  if (carousel instanceof HTMLElement && carousel.dataset.carouselBound === "true") {
    return;
  }

  let currentIndex = 0;
  let autoplayTimer: ReturnType<typeof setInterval> | null = null;

  const startAutoplay = () => {
    if (autoplayTimer !== null) return;
    autoplayTimer = setInterval(() => {
      currentIndex = getWrappedIndex(currentIndex, 1, slides.length);
      renderCarousel(slides, status, currentIndex);
    }, AUTOPLAY_INTERVAL_MS);
  };

  const stopAutoplay = () => {
    if (autoplayTimer !== null) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  prevButton.addEventListener("click", () => {
    currentIndex = getWrappedIndex(currentIndex, -1, slides.length);
    renderCarousel(slides, status, currentIndex);
  });

  nextButton.addEventListener("click", () => {
    currentIndex = getWrappedIndex(currentIndex, 1, slides.length);
    renderCarousel(slides, status, currentIndex);
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);

  renderCarousel(slides, status, currentIndex);
  startAutoplay();

  if (carousel instanceof HTMLElement) {
    carousel.dataset.carouselBound = "true";
  }
};

export const initCarousels = (root: ParentNode = document): void => {
  root.querySelectorAll("[data-carousel]").forEach((carousel) => {
    initSingleCarousel(carousel);
  });
};
