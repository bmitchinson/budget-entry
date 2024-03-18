import { format, parse } from "date-fns";
import { Timestamp } from "firebase/firestore";

export const datetimeEntryStringFormat = "yyyy-MM-dd'T'HH:mm";

export const dateToDatetimeString = (date: Date) =>
  format(date, datetimeEntryStringFormat);

export const initialDatetimeString = () => dateToDatetimeString(new Date());

export const datetimeToTimestamp = (datetime: string) =>
  Timestamp.fromDate(parse(datetime, datetimeEntryStringFormat, new Date()));

export const timestampToDatetimeString = (timestamp: Timestamp) =>
  format(timestamp.toDate(), datetimeEntryStringFormat);
