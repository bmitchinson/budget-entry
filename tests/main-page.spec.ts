import { test, expect, type Page } from "@playwright/test";
import { clearFirebaseData, createFakePurchases } from "./DatabaseTestUtil";
import {
  amountOnForm,
  categoryOnForm,
  clickCancelEdit,
  clickEditAtPurchaseIndex,
  clickSaveEdit,
  clickDeletePurchaseAtIndex,
  descriptionOnForm,
  expectFormToBeEmpty,
  fillPurchaseFormWithValidData,
  purchasesOnPage,
  expectTheseAtPurchaseIndex,
  mockedClockDate,
  mockedClockDatetimeString,
} from "./CommonTestOperations";
import { format } from "date-fns";

// TODO: Use shadcn/ui

test.beforeEach(async ({ page }) => {
  // https://github.com/microsoft/playwright/issues/6347#issuecomment-1085850728
  const fakeNow = mockedClockDate.valueOf();

  // Update the Date accordingly in your test pages
  await page.addInitScript(`{
  // Extend Date constructor to default to fakeNow
  Date = class extends Date {
    constructor(...args) {
      (args.length === 0) ? super(${fakeNow}) : super(...args)
    }
  }

  // Override Date.now() to start from fakeNow
  const __DateNowOffset = ${fakeNow} - Date.now();
  const __DateNow = Date.now;
  Date.now = () => __DateNow() + __DateNowOffset;
}`);

  await clearFirebaseData().then(createFakePurchases);
  await page.goto("/");
});

test("Past purchases are loaded and shown in order", async ({ page }) => {
  await expect(page.getByTestId("purchase-list-item-0")).toContainText(
    "Centro"
  );
  await expect(page.getByTestId("purchase-list-item-1")).toContainText("Lunch");
  await expect(page.getByTestId("purchase-list-item-2")).toContainText(
    "Morning Drive"
  );
});

test.describe("Entry form", () => {
  test("Auto focuses on page load", async ({ page }) => {
    await expect(page.getByLabel("Amount")).toBeFocused();
  });

  test("Clocks is set to the mocked playwright time", async ({ page }) => {
    await expect(page.getByTestId("datetime-input")).toHaveValue(
      new RegExp(mockedClockDatetimeString)
    );
  });

  test("Clears the form when entered", async ({ page }) => {
    await fillPurchaseFormWithValidData(page);
    await page.getByText("Submit").click();

    await expect(page.getByLabel("Amount")).toHaveText("");
    await expect(page.getByLabel("Description")).toHaveText("");
    await expect(page.locator("#category-input")).toHaveText("");
    await expect(page.getByTestId("datetime-input")).toHaveValue(
      new RegExp(mockedClockDatetimeString)
    );
  });

  // todo-postshadcn: add clear button to form

  test("Defaults to the current datetime", async ({ page }) => {});
});

test.describe("Adding", () => {
  test("Adding a purchase saves it to the database", async ({ page }) => {
    await clearFirebaseData().then(() => page.goto("/"));
    await fillPurchaseFormWithValidData(page);
    await page.getByText("Submit").click();

    await expect(page.getByTestId("purchase-list-item-0")).toContainText(
      "cool trip"
    );
    await expect(page.getByTestId("purchase-list-item-0")).toContainText(
      "$10.77"
    );
    await expect(page.getByTestId("purchase-list-item-0")).toContainText("Gas");
  });

  // todo-postshadcn: validation for each field (right now you can just do category)
});

test.describe("Editing", () => {
  test.beforeEach(async ({ page }) => {
    await clickEditAtPurchaseIndex(page, 0);
  });

  test("An edit initializes the form to the purchase under edit", async ({
    page,
  }) => {
    await expect(await amountOnForm(page)).toBe("100");
    await expect(await descriptionOnForm(page)).toBe("Centro");
    await expect(await categoryOnForm(page)).toBe("Date Night");
    await expect(page.getByTestId("datetime-input")).toHaveValue(
      "2023-05-12T01:29"
    );
  });

  test("Canceling an edit clears form contents", async ({ page }) => {
    await clickCancelEdit(page);
    await expectFormToBeEmpty(page);
  });

  test("Canceling an edit doesn't save changes", async ({ page }) => {
    await fillPurchaseFormWithValidData(page);
    await clickCancelEdit(page);
    await expectTheseAtPurchaseIndex(page, ["Centro", "$100", "Date Night"], 0);
  });

  test("Completed edits are persisted", async ({ page }) => {
    await fillPurchaseFormWithValidData(page);
    await clickSaveEdit(page);
    await expect(await purchasesOnPage(page)).toBe(3);
    await expectTheseAtPurchaseIndex(page, ["cool trip", "$10.77", "Gas"], 0);
  });

  test("A purchase being edited is signified", async ({ page }) => {
    await expect(
      page.locator("[data-testid=purchase-list-item-0] > .text-left")
    ).toHaveClass(/under-edit/);
    await expect(
      page.locator("[data-testid=purchase-list-item-1] > .text-left")
    ).not.toHaveClass(/under-edit/);
  });
});

test.describe("Deleting", () => {
  test("Hitting delete twice will delete a purchase", async ({ page }) => {
    await clickDeletePurchaseAtIndex(page, 2);
    await clickDeletePurchaseAtIndex(page, 2);
    await clickDeletePurchaseAtIndex(page, 0);
    await clickDeletePurchaseAtIndex(page, 0);
    await expect(await purchasesOnPage(page)).toBe(1);
    await expectTheseAtPurchaseIndex(
      page,
      ["Lunch", "$456.12", "Restaurants"],
      0
    );
  });
  test("Hitting delete once will *not* delete a purchase", async ({ page }) => {
    await clickDeletePurchaseAtIndex(page, 0);
    await expect(await purchasesOnPage(page)).toBe(3);
  });
  test("Hitting delete twice not in immediate sequence will not delete", async ({
    page,
  }) => {
    await clickDeletePurchaseAtIndex(page, 2);
    await clickDeletePurchaseAtIndex(page, 1);
    await clickDeletePurchaseAtIndex(page, 0);
    await clickDeletePurchaseAtIndex(page, 2);
    await clickDeletePurchaseAtIndex(page, 1);
    await clickDeletePurchaseAtIndex(page, 0);
    await expect(await purchasesOnPage(page)).toBe(3);
  });
  test("Deleting clears any purchase from being under edit", async ({
    page,
  }) => {
    await clickEditAtPurchaseIndex(page, 0);
    await clickDeletePurchaseAtIndex(page, 2);
    await clickDeletePurchaseAtIndex(page, 2);
    await expectFormToBeEmpty(page);
  });
});
// deleting on under edit, assert 2 and form is empty

test("clicking header 3 times logs a debug message", async ({ page }) => {
  let debugPrinted = false;
  page.on("console", (msg) => {
    if (msg.text().includes("DEBUG INFO")) {
      debugPrinted = true;
    }
  });

  await page.goto("/");
  const moneyIcon = page.getByTestId("money-icon");
  await moneyIcon.click();
  await moneyIcon.click();
  await moneyIcon.click();

  expect(debugPrinted).toBe(true);
});

test("Tests running in playwright use fake database", async ({ page }) => {
  let fakeDB = false;
  page.on("console", (msg) => {
    if (msg.text().includes("using firebase emulator")) {
      fakeDB = true;
    }
  });

  await page.goto("/");
  await expect(async () => {
    expect(fakeDB).toBe(true);
  }).toPass({
    timeout: 3_000,
  });
});

// test.describe("Reset", async ({ page }) => {
// todo: reset should populate to an updated time, not the time when the page was loaded
// ^ will need a way to advance time a minute
// });

// todo: enable some of these tests to run in offline mode
//     as well?
// - add purchase, block FB, add 2nd purchase, refresh page (FB Still blocked), are both purchases there?
//    - same but with delete as the operation instead of add
// - ^ that was the core of why I wanted to use firebase so .... hope those work?
// https://github.com/microsoft/playwright/issues/27599#issuecomment-1761787734

// todo: firebase rules to require login?
