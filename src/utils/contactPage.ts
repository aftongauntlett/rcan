import { initForm } from "@formspree/ajax";
import { resolveCopyValue, shouldResetSubmitState } from "./contactInteractions";
import { selectCustomDropdownValue } from "./dropdownClient";

type LegacyClipboardDocument = Omit<Document, "execCommand"> & {
  execCommand(commandId: string): boolean;
};

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

const setCopyFeedback = (feedbackId: string, message: string): void => {
  const feedback = document.getElementById(feedbackId);
  if (!(feedback instanceof HTMLElement)) {
    return;
  }

  feedback.textContent = message;

  window.setTimeout(() => {
    if (feedback.textContent === message) {
      feedback.textContent = "";
    }
  }, 2000);
};

const fallbackCopyText = (value: string): boolean => {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  const execCommandCopy = (document as LegacyClipboardDocument).execCommand.bind(document);

  let copied = false;
  try {
    copied = execCommandCopy("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
};

const copyResetTimers = new WeakMap<HTMLButtonElement, number>();

const setCopyIconState = (button: HTMLButtonElement, copied: boolean): void => {
  const copyIcon = button.querySelector("[data-copy-icon]");
  const copiedIcon = button.querySelector("[data-copied-icon]");

  if (!(copyIcon instanceof HTMLElement) || !(copiedIcon instanceof HTMLElement)) {
    return;
  }

  copyIcon.style.display = copied ? "none" : "inline-block";
  copiedIcon.style.display = copied ? "inline-block" : "none";
};

const bindCopyButtons = (): void => {
  document.querySelectorAll("[data-copy-button]").forEach((button) => {
    if (!(button instanceof HTMLButtonElement) || button.dataset.copyBound === "true") {
      return;
    }

    button.dataset.copyBound = "true";
    setCopyIconState(button, false);

    const handleCopyClick = async () => {
      const row = button.closest("[data-copy-row]");
      const copyTextElement = row?.querySelector("[data-copy-text]");
      const valueFromRow =
        copyTextElement instanceof HTMLElement ? copyTextElement.innerText.trim() : "";
      const value = resolveCopyValue(valueFromRow, button.dataset.copyValue ?? "");
      const feedbackId = button.dataset.copyFeedbackId ?? "";

      if (!value || !feedbackId) {
        return;
      }

      let copied = false;

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(value);
          copied = true;
        } catch {
          copied = fallbackCopyText(value);
        }
      } else {
        copied = fallbackCopyText(value);
      }

      const existingReset = copyResetTimers.get(button);
      if (existingReset) {
        window.clearTimeout(existingReset);
      }

      setCopyIconState(button, copied);
      if (copied) {
        const resetHandle = window.setTimeout(() => {
          setCopyIconState(button, false);
          copyResetTimers.delete(button);
        }, 1500);
        copyResetTimers.set(button, resetHandle);
      }

      setCopyFeedback(feedbackId, copied ? "Copied" : "Unable to copy");
    };

    button.addEventListener("click", () => {
      void handleCopyClick();
    });
  });
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
  bindCopyButtons();
  applyTopicFromQuery();
};
