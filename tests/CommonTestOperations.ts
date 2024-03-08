import { expect, type Page } from "@playwright/test";
import { format } from "date-fns";

export const fillPurchaseFormWithValidData = async (page: Page) => {
  await page.getByLabel("Amount").fill("10.77");
  await page.getByLabel("Description").fill("cool thing");
  await page.locator("#category-input").fill("Gas");
  await page.locator(".sv-item").first().click();
  await page.getByLabel("Date").fill("2023-09-21");
};

export const clickEditAtPurchaseIndex = async (page: Page, index: number) => {
  await page.getByTestId(`edit-${index}`).click();
};

export const clickSaveEdit = async (page: Page) => {
  await page.getByText("Save Edit").click();
};

export const clickCancelEdit = async (page: Page) => {
  await page.getByText("Cancel").click();
};

export const clickDeletePurchaseAtIndex = async (page: Page, index: number) => {
  await page.getByTestId("delete-item-" + index).click();
};

export const expectFormToBeEmpty = async (page: Page) => {
  const today = format(new Date(), "yyyy-MM-dd");

  await expect(await amountOnForm(page)).toBe("");
  await expect(await descriptionOnForm(page)).toBe("");
  await expect(await categoryOnForm(page)).toBe("");
  await expect(await dateOnForm(page)).toBe(today);
};

export const purchasesOnPage = async (page: Page) => {
  return page.locator(".purchase-list tr").count();
};

export const amountOnForm = async (page: Page) =>
  await page.locator('[data-testid="amount-input"]').inputValue();

export const descriptionOnForm = async (page: Page) =>
  await page.getByTestId("description-input").inputValue();

export const categoryOnForm = async (page: Page) => {
  const selectedCategory = await page.locator(".sv-item-content").count();
  if (selectedCategory) {
    return await page.locator(".sv-item-content").textContent();
  } else {
    return "";
  }
};

export const dateOnForm = async (page: Page) =>
  await page.getByTestId("date-input").inputValue();

export const expectTheseAtPurchaseIndex = async (
  page: Page,
  values: string[],
  index: number
) => {
  let expectations: Promise<any>[] = [];
  values.forEach((v) => {
    expectations.push(
      expect(page.getByTestId("purchase-list-item-" + index)).toContainText(v)
    );
  });
  await Promise.all(expectations);
};
