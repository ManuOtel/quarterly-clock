export type MonthInfo = {
  percentComplete: number;
  currentDay: number;
  totalDays: number;
};

export const getMonthInfo = (date: Date): MonthInfo => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const totalDays = monthEnd.getDate();
  const currentDay = date.getDate();
  return {
    percentComplete: ((currentDay - 1) / totalDays) * 100,
    currentDay,
    totalDays
  };
};

export const circleDash = (percent: number, radius: number) => {
  const circumference = 2 * Math.PI * radius;
  return `${circumference} ${circumference}`;
};

export const circleOffset = (percent: number, radius: number) => {
  const circumference = 2 * Math.PI * radius;
  return circumference - (percent / 100) * circumference;
};

export const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};
