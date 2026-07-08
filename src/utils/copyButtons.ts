import { resolveCopyValue } from "./contactInteractions";

type LegacyClipboardDocument = Omit<Document, "execCommand"> & {
  execCommand(commandId: string): boolean;
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

export const initCopyButtons = (): void => {
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
