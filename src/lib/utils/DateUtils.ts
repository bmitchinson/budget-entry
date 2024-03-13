import { format, parse } from "date-fns";
import { Timestamp } from "firebase/firestore";

export const datetimeStringFormat = "yyyy-MM-dd'T'HH:mm";

export const dateToDatetimeString = (date: Date) =>
  format(date, datetimeStringFormat);

export const initialDatetimeString = dateToDatetimeString(new Date());

export const datetimeToTimestamp = (datetime: string) =>
  Timestamp.fromDate(parse(datetime, datetimeStringFormat, new Date()));

export const timestampToDatetimeString = (timestamp: Timestamp) =>
  format(timestamp.toDate(), datetimeStringFormat);
