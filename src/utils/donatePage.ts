const REVEAL_FALLBACK_MS = 10000;
const READY_POLL_MS = 100;

const isVisible = (element: Element | null): boolean => {
  if (!element) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  const styles = window.getComputedStyle(element);
  return (
    rect.width > 0 && rect.height > 0 && styles.display !== "none" && styles.visibility !== "hidden"
  );
};

const isDonorboxReady = (widget: Element): boolean => {
  const root = widget.shadowRoot;
  if (!root) {
    return false;
  }

  const loading = root.querySelector("#loading");
  const form = root.querySelector("#donation_form");
  const loadingStyles = loading ? window.getComputedStyle(loading) : null;
  const loadingComplete =
    loading &&
    (loading.classList.contains("loaded") ||
      (loading.getAttribute("part") ?? "").split(" ").includes("complete") ||
      Number(loadingStyles?.opacity) === 0);

  return Boolean(loadingComplete && isVisible(form));
};

export const initDonorboxWidget = (): void => {
  const skeleton = document.getElementById("donorbox-skeleton");
  const widget = document.querySelector("dbox-widget");
  if (!skeleton || !widget) {
    return;
  }

  let observer: MutationObserver | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let timeout: number | undefined;
  let interval: number | undefined;

  const cleanup = (): void => {
    observer?.disconnect();
    resizeObserver?.disconnect();
    if (timeout) window.clearTimeout(timeout);
    if (interval) window.clearInterval(interval);
  };

  const reveal = (): void => {
    skeleton.style.display = "none";
    widget.classList.remove("opacity-0");
    widget.classList.add("opacity-100");
    widget.removeAttribute("aria-hidden");
    widget.removeAttribute("inert");
    cleanup();
  };

  const check = (): void => {
    if (!isDonorboxReady(widget)) return;
    window.requestAnimationFrame(reveal);
  };

  const observeShadowRoot = (): boolean => {
    const root = widget.shadowRoot;
    if (!root) return false;

    observer = new MutationObserver(check);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "part", "style", "hidden"],
      childList: true,
      subtree: true,
    });

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(check);
      resizeObserver.observe(widget);
      const form = root.querySelector("#donation_form");
      if (form) resizeObserver.observe(form);
    }

    check();
    return true;
  };

  interval = window.setInterval(() => {
    if (observer || !observeShadowRoot()) check();
  }, READY_POLL_MS);

  // Fallback in case the widget API changes and the ready markers disappear.
  timeout = window.setTimeout(reveal, REVEAL_FALLBACK_MS);
};
