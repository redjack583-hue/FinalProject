export function formatEventDate(value?: string | Date | null) {
  if (!value) return "TBD";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "TBD";

  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;

  const dateText = new Intl.DateTimeFormat("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  if (!hasTime) return dateText;

  const timeText = new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

  return `${dateText} at ${timeText}`;
}
