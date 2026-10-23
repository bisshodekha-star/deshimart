// Bengali number & price formatting helpers

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function enToBn(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/** ৳ price in Bengali digits with South-Asian grouping (1,00,000) */
export function price(n: number): string {
  const grouped = n.toLocaleString("en-IN");
  return `৳${enToBn(grouped)}`;
}

export function numBn(n: number): string {
  return enToBn(n.toLocaleString("en-IN"));
}

/** Relative time in Bengali */
export function timeAgoBn(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "এইমাত্র";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${enToBn(minutes)} মিনিট আগে`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${enToBn(hours)} ঘণ্টা আগে`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${enToBn(days)} দিন আগে`;
  const months = Math.floor(days / 30);
  return `${enToBn(months)} মাস আগে`;
}

export const DELIVERY_FEE = 80;
export const FREE_DELIVERY_MIN = 1000;
