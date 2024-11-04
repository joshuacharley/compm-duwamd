export function getWeekNumber(date: Date = new Date()): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function (): number {
  return getWeekNumber(this);
};
