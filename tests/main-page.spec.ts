import { test, expect, type Page } from "@playwright/test";
import { clearFirebaseData, createFakePurchases } from "./DatabaseTestUtil";
import { fillPurchaseFormWithValidData } from "./CommonTestOperations";

const purchasesTable = (page: Page) => page.locator(".purchases-list");

test.beforeEach(async () => {
  await clearFirebaseData().then(createFakePurchases);
});

// todo: test to write: order by date
test("Past purchases are loaded by default", async ({ page }) => {
  await page.goto("/");
  await expect(purchasesTable(page).getByText("Item one")).toBeAttached();
  await expect(purchasesTable(page).getByText("Item two")).toBeAttached();
  await expect(purchasesTable(page).getByText("Item three")).toBeAttached();
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

  // todo: add clear button to form

  // todo: assert numpad for price

  // todo: assert current date time for date time
});

test.describe("Adding", () => {
  test("Adding a purchase saves it to the database", async ({ page }) => {
    await clearFirebaseData();
    await page.goto("/");
    await fillPurchaseFormWithValidData(page);
    await page.getByText("Submit").click();

    await expect(purchasesTable(page).getByText("cool thing")).toBeAttached();
    await expect(purchasesTable(page).getByText("$10.77")).toBeAttached();
    await expect(purchasesTable(page).getByText("Gas")).toBeAttached();
  });
  // todo: validation for each field (right now you can just do category)
});

// todo:
// test.describe("Editing", () => {
//   test("An edit initializes the form to the purchase under edit", () => {});
//   test("An edit clears the form when completed", () => {});
//   test("Canceling an edit clears form contents")
//   test("Canceling an edit doesn't save changes")
// });

// test.describe("Deleting", () => {
// });

// todo: disable text selection on emoji header
test("clicking header 3 times logs a debug message", async ({ page }) => {
  let debugPrinted = false;
  page.on("console", (msg) => {
    if (msg.text().includes("DEBUG INFO")) {
      // todo: assert the debug contents (under an edit scenario)
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
  let fakeDB = undefined;
  page.on("console", (msg) => {
    if (msg.text().includes("Using fake DB")) {
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
