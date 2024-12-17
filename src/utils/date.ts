import { format, isValid, parseISO, subHours, subDays } from 'date-fns';

export function isValidDateString(dateStr: string): boolean {
  try {
    return isValid(parseISO(dateStr));
  } catch {
    return false;
  }
}

export function formatDateForDisplay(date: string): string {
  try {
    return format(parseISO(date), 'MMM d, yyyy h:mm a');
  } catch {
    return date;
  }
}

export function getDatePresets() {
  const now = new Date();
  
  return {
    today: {
      label: 'Last 24 hours',
      getRange: () => ({
        startDate: format(subHours(now, 24), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        endDate: format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      })
    },
    last7Days: {
      label: 'Last 7 days',
      getRange: () => ({
        startDate: format(subDays(now, 7), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        endDate: format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      })
    },
    last30Days: {
      label: 'Last 30 days', 
      getRange: () => ({
        startDate: format(subDays(now, 30), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        endDate: format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      })
    },
    thisMonth: {
      label: 'This month',
      getRange: () => ({
        startDate: format(new Date(now.getFullYear(), now.getMonth(), 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        endDate: format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      })
    },
    custom: {
      label: 'Custom range',
      getRange: () => ({
        startDate: '',
        endDate: ''
      })
    }
  };
}