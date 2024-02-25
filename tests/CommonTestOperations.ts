import type { Page } from "@playwright/test";

export const fillPurchaseFormWithValidData = async (page: Page) => {
  await page.getByLabel("Amount").fill("10.77");
  await page.getByLabel("Description").fill("cool thing");
  await page.locator("#category-input").fill("Gas");
  await page.getByLabel("Date").fill("2023-09-21");
};
