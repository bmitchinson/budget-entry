import { test, expect, type Page } from "@playwright/test";
import { clearFirebaseData, createFakePurchases } from "./DatabaseTestUtil";
import {
  amountOnForm,
  categoryOnForm,
  clickCancelEdit,
  clickEditForPurchaseIndex,
  clickSaveEdit,
  dateOnForm,
  descriptionOnForm,
  expectFormToBeEmpty,
  fillPurchaseFormWithValidData,
  purchasesOnPage,
} from "./CommonTestOperations";
import { format } from "date-fns";

// TODO: Use shadcn/ui

test.beforeEach(async () => {
  await clearFirebaseData().then(createFakePurchases);
});

test("Past purchases are loaded and shown in order", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("purchase-list-item-0")).toContainText(
    "Item One"
  );
  await expect(page.getByTestId("purchase-list-item-1")).toContainText(
    "Item Two"
  );
  await expect(page.getByTestId("purchase-list-item-2")).toContainText(
    "Item Three"
  );
});

test.describe("Entry form", () => {
  test("Auto focuses on page load", async ({ page }) => {
    await page.goto("/");
    page.evaluate(() => {
      console.log("active:", JSON.stringify(document.activeElement));
    });
    await expect(page.getByLabel("Amount")).toBeFocused();
  });

  test("Clears the form when entered", async ({ page }) => {
    await page.goto("/");
    await fillPurchaseFormWithValidData(page);
    await page.getByText("Submit").click();

    await expect(page.getByLabel("Amount")).toHaveText("");
    await expect(page.getByLabel("Description")).toHaveText("");
    await expect(page.locator("#category-input")).toHaveText("");
    await expect(page.getByLabel("Date")).toHaveText("");
  });

  // todo-postshadcn: add clear button to form

  // todo-postshadcn: assert numpad for price

  // todo-postshadcn: assert current date time for date time
});

test.describe("Adding", () => {
  test("Adding a purchase saves it to the database", async ({ page }) => {
    await clearFirebaseData();
    await page.goto("/");
    await fillPurchaseFormWithValidData(page);
    await page.getByText("Submit").click();

    await expect(page.getByTestId("purchase-list-item-0")).toContainText(
      "cool thing"
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
    await page.goto("/");
    await clickEditForPurchaseIndex(page, 0);
  });

  test("An edit initializes the form to the purchase under edit", async ({
    page,
  }) => {
    await expect(await amountOnForm(page)).toBe("123.45");
    await expect(await descriptionOnForm(page)).toBe("Item One");
    await expect(await categoryOnForm(page)).toBe("Gas");
    await expect(await dateOnForm(page)).toBe("2021-01-01");
  });

  test("Canceling an edit clears form contents", async ({ page }) => {
    await clickCancelEdit(page);
    await expectFormToBeEmpty(page);
  });
  test("Canceling an edit doesn't save changes", async ({ page }) => {
    await clickCancelEdit(page);
    await expect(page.getByTestId("purchase-list-item-0")).toContainText(
      "Item One"
    );
  });

  test("Completed edits are persisted", async ({ page }) => {
    await fillPurchaseFormWithValidData(page);
    await clickSaveEdit(page);
    await expect(await purchasesOnPage(page)).toBe(3);
    await expect(page.getByTestId("purchase-list-item-0")).toContainText(
      "cool thing"
    );
    await expect(page.getByTestId("purchase-list-item-0")).toContainText(
      "$10.77"
    );
    await expect(page.getByTestId("purchase-list-item-0")).toContainText("Gas");
  });
});

// todo: test.describe("Deleting", () => {});
// deleting one and three, assert 2
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

// todo: enable some of these tests to run in offline mode
//     as well?
// - add purchase, block FB, add 2nd purchase, refresh page (FB Still blocked), are both purchases there?
//    - same but with delete as the operation instead of add
// - ^ that was the core of why I wanted to use firebase so .... hope those work?
// https://github.com/microsoft/playwright/issues/27599#issuecomment-1761787734
