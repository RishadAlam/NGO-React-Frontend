export default function getCurrentMonth(
  year = new Date().getFullYear(),
  month = new Date().getMonth(),
  day = 1,
  endDate = new Date()
) {
  return [new Date(year, month, day), endDate]
}
