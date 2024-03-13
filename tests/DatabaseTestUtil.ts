// Wish I had this instead </3 https://github.com/firebase/firebase-tools/issues/2297

import { Timestamp } from "firebase/firestore";
import type { Purchase } from "../src/lib/DatabaseTypes";
import { Database } from "../src/lib/Database";
import { add, sub } from "date-fns";
import { mockedClockDate } from "./CommonTestOperations";

const fakePurchases: Purchase[] = [
  {
    amount: 123.45,
    category: "Gas",
    purchaseDatetime: Timestamp.fromDate(sub(mockedClockDate, { minutes: 3 })),
    description: "Morning Drive",
    entryDatetime: Timestamp.fromDate(new Date()),
  },
  {
    amount: 456.12,
    category: "Restaurants",
    purchaseDatetime: Timestamp.fromDate(sub(mockedClockDate, { minutes: 2 })),
    description: "Lunch",
    entryDatetime: Timestamp.fromDate(new Date()),
  },
  {
    amount: 100,
    category: "Date Night",
    purchaseDatetime: Timestamp.fromDate(sub(mockedClockDate, { minutes: 1 })),
    description: "Centro",
    entryDatetime: Timestamp.fromDate(new Date()),
  },
];

export const createFakePurchases = () => {
  const promises: Promise<void>[] = [];

  fakePurchases.forEach((purchase) => {
    promises.push(Database.get().addPurchase(purchase));
  });

  return Promise.all(promises);
};

export const clearFirebaseData = async () => {
  return await fetch(
    "http://127.0.0.1:8080/emulator/v1/projects/budget-entry-45bc4/databases/(default)/documents",
    { method: "DELETE" }
  ).catch((e) => {
    console.log("Firebase Fetch Error:", e);
    throw new Error("Couldn't call firebase emulator to clear database");
  });
};
