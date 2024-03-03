// Wish I had this instead </3 https://github.com/firebase/firebase-tools/issues/2297

import { Timestamp } from "firebase/firestore";
import type { Purchase } from "../src/lib/DatabaseTypes";
import { Database } from "../src/lib/Database";
import { add } from "date-fns";

const fakePurchases: Purchase[] = [
  {
    amount: 123.45,
    category: "Gas",
    date: "2021-01-01",
    description: "Item One",
    entryTime: Timestamp.fromDate(new Date()),
  },
  {
    amount: 456.12,
    category: "Restaurants",
    date: "2021-01-02",
    description: "Item Two",
    entryTime: Timestamp.fromDate(add(new Date(), { seconds: 10 })),
  },
  {
    amount: 100,
    category: "Date Night",
    date: "2021-01-03",
    description: "Item Three",
    entryTime: Timestamp.fromDate(add(new Date(), { seconds: 20 })),
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
