/**
 * Lightweight formatters.
 */

const monthShortSr: Record<string, string> = {
  Jan: "JAN",
  Feb: "FEB",
  Mar: "MAR",
  Apr: "APR",
  May: "MAJ",
  Jun: "JUN",
  Jul: "JUL",
  Aug: "AVG",
  Sep: "SEP",
  Oct: "OKT",
  Nov: "NOV",
  Dec: "DEC",
};

export function formatEventDate(iso: string) {
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, "0");
  const monthEn = d.toLocaleString("en", { month: "short" });
  const month = monthShortSr[monthEn] ?? monthEn.toUpperCase();
  const year = d.getFullYear();
  const time = d.toLocaleTimeString("sr-RS", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { day, month, year, time };
}

export function formatPrice(amount: number, currency: string) {
  const symbols: Record<string, string> = {
    EUR: "€",
    USD: "$",
    RSD: "RSD ",
  };
  const sym = symbols[currency] ?? "";
  if (currency === "RSD") return `${sym}${amount.toLocaleString("sr-RS")}`;
  return `${sym}${amount}`;
}

export function timeUntil(iso: string) {
  const target = new Date(iso).getTime();
  const diff = target - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return { days, hours, mins };
}
