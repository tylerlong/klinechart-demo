const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  dateStyle: 'short',
  timeStyle: 'short',
});
export const formatDateTime = (s: string) => dateTimeFormatter.format(new Date(s));

const numberFormatter = new Intl.NumberFormat('en-US');
export const formatNumber = (s: number) => numberFormatter.format(s);
