import { initForm } from "@formspree/ajax/dist/index.mjs";
import { shouldResetSubmitState } from "./contactInteractions";
import { selectCustomDropdownValue } from "./dropdownClient";
import { initCopyButtons } from "./copyButtons";

const setSubmitBehavior = (
  form: HTMLFormElement,
  submitButton: HTMLButtonElement,
  submitLabel: Element | null,
  successMessage: Element | null,
  errorMessage: Element | null,
): void => {
  if (submitButton.dataset.submitStateBound === "true") {
    return;
  }

  const initialDisabledState = submitButton.disabled;
  const defaultLabel =
    submitLabel instanceof HTMLElement
      ? submitLabel.textContent?.trim() || "Send message"
      : submitButton.textContent?.trim() || "Send message";

  const setSubmitState = (isSubmitting: boolean) => {
    submitButton.disabled = isSubmitting || initialDisabledState;

    if (submitLabel instanceof HTMLElement) {
      submitLabel.textContent = isSubmitting ? "Sending" : defaultLabel;
    } else {
      submitButton.textContent = isSubmitting ? "Sending" : defaultLabel;
    }

    if (isSubmitting) {
      form.setAttribute("aria-busy", "true");
    } else {
      form.removeAttribute("aria-busy");
    }
  };

  const resetFromMessage = () => {
    const successText = successMessage instanceof HTMLElement ? successMessage.textContent : "";
    const errorText = errorMessage instanceof HTMLElement ? errorMessage.textContent : "";

    if (shouldResetSubmitState(successText, errorText)) {
      setSubmitState(false);
    }
  };

  form.addEventListener("submit", () => {
    setSubmitState(true);
  });

  [successMessage, errorMessage].forEach((messageElement) => {
    if (messageElement instanceof HTMLElement) {
      const observer = new MutationObserver(resetFromMessage);
      observer.observe(messageElement, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }
  });

  submitButton.dataset.submitStateBound = "true";
};

const initContactForm = (): void => {
  const form = document.querySelector("#contact-form");
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const submitButton = form.querySelector("[data-fs-submit-btn]");
  const submitLabel = form.querySelector("[data-fs-submit-label]");
  const successMessage = document.querySelector("[data-fs-success]");
  const errorMessage = document.querySelector("[data-fs-error]");

  if (submitButton instanceof HTMLButtonElement) {
    setSubmitBehavior(form, submitButton, submitLabel, successMessage, errorMessage);
  }

  if (form.dataset.formspreeBound === "true") {
    return;
  }

  try {
    initForm({ formElement: "#contact-form", formId: "mdajaprb" });
    form.dataset.formspreeBound = "true";
  } catch (error) {
    console.error("Formspree init failed", error);
  }
};

const applyTopicFromQuery = (): void => {
  const topicFromQuery = new URLSearchParams(window.location.search).get("topic");
  if (!topicFromQuery) {
    return;
  }

  const dropdownRoot = document.querySelector("[data-custom-dropdown]");
  if (dropdownRoot instanceof HTMLElement) {
    selectCustomDropdownValue(dropdownRoot, topicFromQuery);
  }
};

export const initContactPage = (): void => {
  initContactForm();
  initCopyButtons();
  applyTopicFromQuery();
};
