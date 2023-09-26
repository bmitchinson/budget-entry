import { test, expect } from "@playwright/test";
import { clearFirebaseData, createFakePurchases } from "./DatabaseTestUtil";
import { fillPurchaseFormWithValidData } from "./CommonTestOperations";

test.beforeEach(async () => {
  await clearFirebaseData().then(createFakePurchases);
});

test("Past purchases are loaded by default", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Item one")).toBeAttached();
  await expect(page.getByText("Item two")).toBeAttached();
  await expect(page.getByText("Item three")).toBeAttached();
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
    await expect(page.locator("#category-select")).toHaveText("");
    await expect(page.getByLabel("Date")).toHaveText("");
  });
});

test.describe("Adding", () => {
  test.skip("a purchase saves it to the database", async ({ page }) => {
    await clearFirebaseData();
    await page.goto("/");
    await fillPurchaseFormWithValidData(page);
    await page.getByText("Submit").click();

    await expect(page.getByText("cool thing")).toBeAttached();
    await expect(page.getByText("$10.77")).toBeAttached();
    await expect(page.getByText("Gas")).toBeAttached();
  });
  // todo: validation for each field (right now you can just do category)
});

// test.describe("Editing", () => {
//   test("a purchase initializes the form to the purchase under edit", () => {});
//   test("a purchase clears the form when completed", () => {});
//   test("multiple purchases in a row saves appropriate data", () => {});
// });

// test.describe("Deleting", () => {
// });

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
