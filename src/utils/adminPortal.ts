import { PAGE_GROUP_OPTIONS, PAGE_GROUPS_DATA, PAGE_SECTIONS } from "../data/admin";
import { bootstrapAllStyledDropdowns } from "./styledDropdown";

const SESSION_KEY = "rcan_admin_session";

export function bootstrapAdminPortal(): void {
  if (document.documentElement.dataset.adminPortalBootstrapped === "true") return;

  const loginScreen = document.getElementById("login-screen");
  const portal = document.getElementById("portal");
  const loginError = document.getElementById("login-error");
  const submitSuccess = document.getElementById("submit-success");
  const submitError = document.getElementById("submit-error");
  const submitBtn = document.querySelector<HTMLButtonElement>("#submit-btn");
  const submitLabel = document.getElementById("submit-label");
  const changesContainer = document.getElementById("changes-container");
  const changeForm = document.querySelector<HTMLFormElement>("#change-request-form");

  if (!loginScreen || !portal || !loginError || !changesContainer || !changeForm) return;

  document.documentElement.dataset.adminPortalBootstrapped = "true";

  const loginScreenEl = loginScreen;
  const portalEl = portal;
  const loginErrorEl = loginError;
  const adminUser = String(import.meta.env.PUBLIC_ADMIN_USER ?? "");
  const adminPass = String(import.meta.env.PUBLIC_ADMIN_PASS ?? "");

  function showPortal() {
    loginScreenEl.hidden = true;
    portalEl.hidden = false;
  }

  function showLogin() {
    portalEl.hidden = true;
    loginScreenEl.hidden = false;
    (document.getElementById("admin-username") as HTMLInputElement).value = "";
    (document.getElementById("admin-password") as HTMLInputElement).value = "";
    loginErrorEl.hidden = true;
  }

  if (localStorage.getItem(SESSION_KEY) === "authenticated") showPortal();

  document.getElementById("show-password")?.addEventListener("change", (event) => {
    const checkbox = event.target as HTMLInputElement;
    (document.getElementById("admin-password") as HTMLInputElement).type = checkbox.checked
      ? "text"
      : "password";
  });

  document.getElementById("login-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = (document.getElementById("admin-username") as HTMLInputElement).value.trim();
    const pass = (document.getElementById("admin-password") as HTMLInputElement).value;
    if (user === adminUser && pass === adminPass) {
      localStorage.setItem(SESSION_KEY, "authenticated");
      loginErrorEl.hidden = true;
      showPortal();
    } else {
      loginErrorEl.hidden = false;
    }
  });

  document.getElementById("sign-out")?.addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEY);
    showLogin();
  });

  wireBlock(changesContainer.querySelector<HTMLElement>(".change-block")!);
  renumberBlocks(changesContainer);

  document.getElementById("add-change-btn")?.addEventListener("click", () => {
    const block = createBlock(changesContainer);
    changesContainer.appendChild(block);
    renumberBlocks(changesContainer);
    block.querySelector<HTMLInputElement>("[data-page-radio]")?.focus();
  });

  changeForm.addEventListener("submit", (event) => {
    void submitChangeRequest(event, {
      changeForm,
      changesContainer,
      submitBtn,
      submitError,
      submitLabel,
      submitSuccess,
    });
  });

  bootstrapRequestHistory();
}

async function submitChangeRequest(
  event: SubmitEvent,
  elements: {
    changeForm: HTMLFormElement;
    changesContainer: HTMLElement;
    submitBtn: HTMLButtonElement | null;
    submitError: HTMLElement | null;
    submitLabel: HTMLElement | null;
    submitSuccess: HTMLElement | null;
  },
): Promise<void> {
  const { changeForm, changesContainer, submitBtn, submitError, submitLabel, submitSuccess } =
    elements;

  event.preventDefault();
  if (!submitSuccess || !submitError || !submitBtn || !submitLabel) return;

  submitSuccess.hidden = true;
  submitError.hidden = true;
  submitLabel.textContent = "Sending...";
  submitBtn.disabled = true;

  try {
    const response = await fetch(changeForm.action, {
      method: "POST",
      body: new FormData(changeForm),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      changeForm.reset();
      resetBlocks(changesContainer);
      submitSuccess.hidden = false;
      submitSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      submitError.hidden = false;
    }
  } catch {
    submitError.hidden = false;
  } finally {
    submitLabel.textContent = "Submit Request";
    submitBtn.disabled = false;
  }
}

let blockCounter = 1;

function makeGroupDropdownHTML(idPrefix: string): string {
  const labelId = `${idPrefix}-label`;
  const valueId = `${idPrefix}-value`;
  const listboxId = `${idPrefix}-listbox`;
  const nativeId = `${idPrefix}-native`;

  return `
    <div class="styled-dropdown" data-styled-dropdown data-page-group-select>
      <label class="block mb-2 text-sm font-semibold uppercase tracking-wide text-brand-secondary" id="${labelId}" for="${nativeId}">
        Choose one area to update<span class="ml-0.5 text-status-error" aria-hidden="true">*</span>
        <span class="block mt-0.5 text-sm font-normal normal-case text-text-subtle">One category per change, please. Need a page added, removed, or edited? Choose &ldquo;Other.&rdquo; Reporting a bug? Choose &ldquo;Technical / Bug Report.&rdquo;</span>
      </label>
      <div class="styled-dropdown__control">
        <button
          class="w-full flex items-center justify-between gap-3 rounded-md border border-border-default bg-surface-default px-3 py-2 text-base text-left shadow-sm transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-default disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none styled-dropdown__trigger"
          type="button"
          id="${idPrefix}"
          aria-haspopup="listbox"
          aria-expanded="false"
          aria-controls="${listboxId}"
          aria-labelledby="${labelId} ${valueId}"
          data-dropdown-trigger
          hidden
        >
          <span class="truncate styled-dropdown__value text-text-subtle" id="${valueId}" data-dropdown-value>— Select one —</span>
          <span class="w-5 h-5 shrink-0 styled-dropdown__icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" focusable="false" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75">
              <path d="M5.5 7.5L10 12l4.5-4.5"></path>
            </svg>
          </span>
        </button>
        <ul class="styled-dropdown__list" id="${listboxId}" role="listbox" aria-labelledby="${labelId}" hidden tabindex="-1" data-dropdown-listbox>
          ${PAGE_GROUP_OPTIONS.map(
            (option, index) =>
              `<li class="styled-dropdown__option" id="${idPrefix}-option-${index}" role="option" aria-selected="false" data-value="${option.value}" data-label="${option.label}" data-disabled="false" data-dropdown-option><span class="styled-dropdown__option-label">${option.label}</span><span class="styled-dropdown__option-description">${option.description}</span></li>`,
          ).join("")}
        </ul>
        <select class="styled-dropdown__native" id="${nativeId}" name="" required aria-labelledby="${labelId}" data-dropdown-native>
          <option value="" disabled selected>— Select one —</option>
          ${PAGE_GROUP_OPTIONS.map((option) => `<option value="${option.value}">${option.label} — ${option.description}</option>`).join("")}
        </select>
        <p class="sr-only" aria-live="polite" data-dropdown-announcer>No option selected.</p>
      </div>
    </div>`;
}

function makePageCardsHTML(fieldName: string, groupIdPrefix: string): string {
  return `
    <fieldset class="space-y-1" data-field="page">
      <div class="space-y-4">
        ${makeGroupDropdownHTML(groupIdPrefix)}
        ${PAGE_GROUPS_DATA.map(
          (group) => `
            <div class="space-y-2" data-page-group data-group="${group.key}" hidden>
              <p class="text-xs font-semibold uppercase tracking-widest text-text-subtle">${group.label}</p>
              <div class="grid ${group.cols} gap-2">
                ${group.pages
                  .map(
                    (page) => `
                      <label class="page-card">
                        <input type="radio" name="${fieldName}" value="${page}" class="sr-only" required data-page-radio />
                        <span class="page-card-inner">${page}</span>
                      </label>`,
                  )
                  .join("")}
              </div>
              <div data-section-area hidden>
                <p class="block mb-2 mt-1 text-sm font-semibold uppercase tracking-wide text-brand-secondary">
                  Which section?<span class="ml-0.5 text-status-error" aria-hidden="true">*</span>
                </p>
                <div class="flex flex-wrap gap-2" data-section-chips></div>
              </div>
            </div>`,
        ).join("")}
      </div>
    </fieldset>`;
}

function showPageChangeModal(onConfirm: () => void): void {
  const modal = document.getElementById("page-change-modal");
  const confirmBtn = document.getElementById("modal-confirm");
  const cancelBtn = document.getElementById("modal-cancel");
  const backdrop = document.getElementById("modal-backdrop");

  if (!modal || !confirmBtn || !cancelBtn || !backdrop) return;

  modal.hidden = false;
  cancelBtn.focus();

  function close() {
    modal!.hidden = true;
    confirmBtn!.removeEventListener("click", handleConfirm);
    cancelBtn!.removeEventListener("click", handleCancel);
    backdrop!.removeEventListener("click", handleCancel);
    document.removeEventListener("keydown", handleKeydown);
  }

  function handleConfirm() {
    close();
    onConfirm();
  }

  function handleCancel() {
    close();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") handleCancel();
  }

  confirmBtn.addEventListener("click", handleConfirm);
  cancelBtn.addEventListener("click", handleCancel);
  backdrop.addEventListener("click", handleCancel);
  document.addEventListener("keydown", handleKeydown);
}

function wireBlock(block: HTMLElement) {
  const groupSelect = block.querySelector<HTMLSelectElement>(
    "[data-page-group-select] [data-dropdown-native]",
  );

  groupSelect?.addEventListener("change", () => {
    const selected = groupSelect.value;
    block.querySelectorAll<HTMLElement>("[data-page-group]").forEach((group) => {
      const isMatch = group.dataset.group === selected;
      if (!isMatch) {
        group.querySelectorAll<HTMLInputElement>("[data-page-radio]").forEach((radio) => {
          radio.checked = false;
        });
        group.querySelectorAll<HTMLElement>("[data-section-area]").forEach((area) => {
          area.hidden = true;
          area.querySelector("[data-section-chips]")!.innerHTML = "";
        });
      }
      group.hidden = !isMatch;
    });
  });

  block.querySelectorAll<HTMLInputElement>("[data-page-radio]").forEach((radio) => {
    radio.addEventListener("click", (event) => {
      if (radio.checked) return;
      const hasSection = !!block.querySelector<HTMLInputElement>("[data-section-input]:checked");
      const desc =
        block.querySelector<HTMLTextAreaElement>('[data-field="description"]')?.value.trim() ?? "";
      if (!hasSection && !desc) return;
      event.preventDefault();
      showPageChangeModal(() => {
        block.querySelector<HTMLTextAreaElement>('[data-field="description"]')!.value = "";
        block.querySelectorAll<HTMLElement>("[data-section-area]").forEach((area) => {
          area.hidden = true;
          area.querySelector("[data-section-chips]")!.innerHTML = "";
        });
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });

    radio.addEventListener("change", () => {
      block.querySelectorAll<HTMLElement>("[data-section-area]").forEach((area) => {
        area.hidden = true;
        area.querySelector("[data-section-chips]")!.innerHTML = "";
      });
      const group = radio.closest<HTMLElement>("[data-page-group]")!;
      const sectionArea = group.querySelector<HTMLElement>("[data-section-area]")!;
      const chipContainer = sectionArea.querySelector<HTMLElement>("[data-section-chips]")!;
      const n = block.querySelector(".block-heading")!.textContent.match(/\d+/)?.[0] ?? "1";
      const sections = PAGE_SECTIONS[radio.value] ?? [];

      const isMulti = radio.value === "Request to remove a page";
      const inputType = isMulti ? "checkbox" : "radio";

      chipContainer.innerHTML = sections
        .map(
          (section) => `
            <label class="section-chip">
              <input type="${inputType}" name="Change ${n} - Section" value="${section}" class="sr-only" ${isMulti ? "" : "required"} data-section-input />
              <span class="section-chip-inner">${section}</span>
            </label>`,
        )
        .join("");

      sectionArea.hidden = sections.length === 0;
    });
  });

  block.querySelector(".remove-btn")?.addEventListener("click", () => {
    block.remove();
    const container = document.getElementById("changes-container");
    if (container) renumberBlocks(container);
  });
}

function renumberBlocks(changesContainer: HTMLElement) {
  const blocks = Array.from(changesContainer.querySelectorAll<HTMLElement>(".change-block"));
  const only = blocks.length === 1;

  blocks.forEach((block, index) => {
    const n = index + 1;
    block.querySelector(".block-heading")!.textContent = `Change ${n}`;
    block.querySelectorAll<HTMLInputElement>("[data-page-radio]").forEach((radio) => {
      radio.name = `Change ${n} - Page`;
    });
    block.querySelectorAll<HTMLInputElement>("[data-section-input]").forEach((input) => {
      input.name = `Change ${n} - Section`;
    });
    block
      .querySelector<HTMLElement>('[data-field="description"]')!
      .setAttribute("name", `Change ${n} - Description`);
    (block.querySelector(".remove-btn") as HTMLElement).hidden = only;
  });
}

function createBlock(changesContainer: HTMLElement): HTMLElement {
  blockCounter += 1;
  const block = document.createElement("div");
  block.className =
    "change-block rounded-lg border border-border-default bg-surface-default px-5 py-5 space-y-5";
  block.innerHTML = `
    <div class="flex items-center justify-between">
      <h2 class="block-heading inline-flex items-center rounded-md bg-[#FEF0E8] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-brand-secondary"></h2>
      <button type="button" class="remove-btn text-sm font-semibold text-status-error underline hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
        Remove
      </button>
    </div>
    ${makePageCardsHTML("page-placeholder", `page-group-select-${blockCounter}`)}
    <div class="space-y-2">
      <label class="block text-sm font-semibold uppercase tracking-wide text-brand-secondary">What would you like changed?</label>
      <p class="text-sm text-text-subtle">Describe the change in your own words. The more detail, the better.</p>
      <textarea data-field="description" rows="6" required
        placeholder="Example: Please update the first paragraph to say..."
        class="w-full rounded-md border border-border-default bg-surface-default px-3 py-2 text-base text-text-default placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"></textarea>
    </div>`;

  bootstrapAllStyledDropdowns(block);
  wireBlock(block);
  renumberBlocks(changesContainer);
  return block;
}

function resetBlocks(changesContainer: HTMLElement) {
  const blocks = Array.from(changesContainer.querySelectorAll<HTMLElement>(".change-block"));
  blocks.slice(1).forEach((block) => block.remove());
  const first = blocks[0];
  first.querySelectorAll<HTMLInputElement>("[data-page-radio]").forEach((radio) => {
    radio.checked = false;
  });
  first.querySelectorAll<HTMLElement>("[data-page-group]").forEach((group) => {
    group.hidden = true;
  });
  first.querySelectorAll<HTMLElement>("[data-section-area]").forEach((area) => {
    area.hidden = true;
    area.querySelector("[data-section-chips]")!.innerHTML = "";
  });
  first.querySelector<HTMLTextAreaElement>('[data-field="description"]')!.value = "";
  renumberBlocks(changesContainer);
}

function bootstrapRequestHistory() {
  const historyList = document.getElementById("request-history-list");
  const noResults = document.getElementById("history-no-results");

  if (!historyList) return;

  let activeFilter = "all";
  let sortOrder: "desc" | "asc" = "desc";

  function applyFilterSort() {
    const cards = Array.from(historyList!.querySelectorAll<HTMLElement>("[data-request-card]"));

    cards
      .sort((a, b) => {
        const da = a.dataset.date ?? "";
        const db = b.dataset.date ?? "";
        return sortOrder === "desc" ? db.localeCompare(da) : da.localeCompare(db);
      })
      .forEach((card) => historyList!.appendChild(card));

    let visible = 0;
    cards.forEach((card) => {
      const match = activeFilter === "all" || card.dataset.status === activeFilter;
      card.hidden = !match;
      if (match) visible++;
    });

    if (noResults) noResults.hidden = visible > 0;
  }

  function setActiveFilter(value: string) {
    activeFilter = value;
    document.querySelectorAll<HTMLButtonElement>(".history-filter").forEach((btn) => {
      const active = btn.dataset.filter === value;
      btn.classList.toggle("border-brand-primary", active);
      btn.classList.toggle("bg-brand-primary", active);
      btn.classList.toggle("text-white", active);
      btn.classList.toggle("border-border-default", !active);
      btn.classList.toggle("bg-surface-default", !active);
      btn.classList.toggle("text-text-subtle", !active);
      btn.classList.toggle("hover:border-brand-primary", !active);
      btn.classList.toggle("hover:text-brand-primary", !active);
    });
    applyFilterSort();
  }

  document.querySelectorAll<HTMLButtonElement>(".history-filter").forEach((btn) => {
    btn.addEventListener("click", () => setActiveFilter(btn.dataset.filter ?? "all"));
  });

  const sortToggle = document.getElementById("sort-toggle");
  const sortLabel = sortToggle?.querySelector<HTMLElement>("[data-sort-label]");
  const sortChevron = sortToggle?.querySelector<SVGElement>("[data-sort-chevron]");
  sortToggle?.addEventListener("click", () => {
    sortOrder = sortOrder === "desc" ? "asc" : "desc";
    if (sortLabel) sortLabel.textContent = sortOrder === "desc" ? "Newest first" : "Oldest first";
    if (sortChevron) sortChevron.style.transform = sortOrder === "asc" ? "rotate(180deg)" : "";
    applyFilterSort();
  });

  document.querySelectorAll<HTMLButtonElement>("[data-card-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      const body = document.getElementById(btn.getAttribute("aria-controls") ?? "");
      if (body) body.hidden = expanded;
      const chevron = btn.querySelector<SVGElement>("[data-chevron]");
      if (chevron) chevron.style.transform = expanded ? "" : "rotate(180deg)";
    });
  });

  setActiveFilter("all");
}
