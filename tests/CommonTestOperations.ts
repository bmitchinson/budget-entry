import { expect, type Page } from "@playwright/test";
import { format, parse } from "date-fns";

const formatOfDatetimeFieldValue = "yyyy-MM-dd'T'HH:mm";

export const mockedClockDatetimeString = "2023-05-12T01:30";

export const mockedClockDate = parse(
  mockedClockDatetimeString,
  formatOfDatetimeFieldValue,
  new Date()
);

export const dateToDatetimeFieldValue = (date: Date) =>
  format(date, formatOfDatetimeFieldValue);

export const fillPurchaseFormWithValidData = async (page: Page) => {
  await page.getByLabel("Amount").fill("10.77");
  await page.getByLabel("Description").fill("cool trip");
  await page.locator("#category-input-btn").click();
  await page.locator("#category-input").fill("Gas");
  await page.locator(".category-item").first().click();
  await page.getByLabel("Date/Time").fill(mockedClockDatetimeString);
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
  await expect(await amountOnForm(page)).toBe("0");
  await expect(await descriptionOnForm(page)).toBe("");
  await expect(await categoryOnForm(page)).toBe("Select Category");
  await expect(page.getByTestId("datetime-input")).toHaveValue(
    new RegExp(mockedClockDatetimeString)
  );
};

export const purchasesOnPage = async (page: Page) => {
  return page.locator(".purchase-list tr").count();
};

export const amountOnForm = async (page: Page) =>
  await page.locator('[data-testid="amount-input"]').inputValue();

export const descriptionOnForm = async (page: Page) =>
  await page.getByTestId("description-input").inputValue();

export const categoryOnForm = async (page: Page) => {
  return page.locator("#category-input-btn").innerText();
};

export const advanceTimeOneMinute = async (page: Page) =>
  await page.evaluate(() => {
    (window as any).advanceTimeOneMinute();
  });

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
