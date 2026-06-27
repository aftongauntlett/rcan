import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/about",
  "/how-we-help",
  "/who-we-are",
  "/impact",
  "/get-involved",
  "/contact",
  "/donate",
  "/404",
];

test("core routes render main landmark", async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("main#main-content")).toBeVisible();
  }
});

test("mobile navigation opens, closes, and navigates to contact", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const openButton = page.getByRole("button", { name: "Open navigation menu" });
  const dialog = page.getByRole("dialog", { name: "Mobile navigation" });
  const closeButton = page.getByRole("button", { name: "Close navigation menu" });

  await openButton.focus();
  await openButton.click();
  await expect(dialog).toBeVisible();

  await closeButton.click();
  await expect(dialog).not.toBeVisible();
  await expect(openButton).toBeFocused();

  await openButton.click();
  await dialog.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/contact\/?$/);
});

test("contact congregation field stays visible and optional regardless of topic", async ({
  page,
}) => {
  await page.goto("/contact");

  const dropdownTrigger = page.locator("[data-dropdown-trigger]");
  const congregationInput = page.locator("#congregation");

  await expect(congregationInput).toBeVisible();
  await expect(congregationInput).toHaveJSProperty("required", false);

  await dropdownTrigger.click();
  await page.getByRole("menuitemradio", { name: "Engage your congregation" }).click();

  await expect(congregationInput).toBeVisible();
  await expect(congregationInput).toHaveJSProperty("required", false);
});
