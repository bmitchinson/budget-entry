import { test, expect } from "@playwright/test";
import { clearFirebaseData, createFakePurchases } from "./DatabaseTestUtil";

test("Past purchases are loaded by default", async ({ page }) => {
  await clearFirebaseData().then(createFakePurchases);

  await page.goto("/");
  await expect(page.getByText("Item one")).toBeAttached();
  await expect(page.getByText("Item two")).toBeAttached();
  await expect(page.getByText("Item three")).toBeAttached();
});

// test.describe("Entry form", () => {
//   test("Auto focuses on page load", () => {});
//   test("Clears the form when entered", () => {});
// });

// test.describe("Adding", () => {
//   test("a purchase saves it to the database", () => {});
//   todo: validation for each field (right now you can just do category)
// });

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
