// Class cadence: Monday, Wednesday, Friday
const CLASS_WEEKDAYS = [1, 3, 5];

function addDays(d: Date, n: number) {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

/**
 * Given the Day 1 date, returns `count` class dates.
 * Day 1 is honored as given; every following day snaps to the next Mon/Wed/Fri.
 */
export function classDates(day1: Date, count: number): Date[] {
  const dates: Date[] = [];
  let cursor = new Date(day1.getFullYear(), day1.getMonth(), day1.getDate());
  dates.push(cursor);
  while (dates.length < count) {
    cursor = addDays(cursor, 1);
    while (!CLASS_WEEKDAYS.includes(cursor.getDay())) {
      cursor = addDays(cursor, 1);
    }
    dates.push(cursor);
  }
  return dates;
}

export function isClassWeekday(d: Date) {
  return CLASS_WEEKDAYS.includes(d.getDay());
}

/** Parse a `YYYY-MM-DD` string as a local date (avoids UTC shift). */
export function parseDateOnly(value: string | null | undefined): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function toDateOnly(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
