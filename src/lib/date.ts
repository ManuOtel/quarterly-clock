import type { Project, ProjectStatus } from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toUtcMidnight = (date: Date) =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

const daysBetween = (start: Date, end: Date) => {
  const startUtc = toUtcMidnight(start);
  const endUtc = toUtcMidnight(end);
  return Math.round((endUtc - startUtc) / MS_PER_DAY);
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export type QuarterInfo = {
  quarter: 1 | 2 | 3 | 4;
  year: number;
  start: Date;
  end: Date;
  totalDays: number;
  daysElapsed: number;
  daysRemaining: number;
  percentComplete: number;
};

export type YearInfo = {
  year: number;
  start: Date;
  end: Date;
  totalDays: number;
  daysElapsed: number;
  daysRemaining: number;
  percentComplete: number;
};

export const getQuarterInfoFor = (
  quarter: QuarterInfo["quarter"],
  year: number,
  today = new Date()
): QuarterInfo => {
  const startMonth = (quarter - 1) * 3;
  const start = new Date(year, startMonth, 1);
  const end = new Date(year, startMonth + 3, 0);
  const totalDays = daysBetween(start, end) + 1;
  const todayUtc = toUtcMidnight(today);
  const startUtc = toUtcMidnight(start);
  const endUtc = toUtcMidnight(end);
  let daysElapsed = 0;
  if (todayUtc < startUtc) {
    daysElapsed = 0;
  } else if (todayUtc > endUtc) {
    daysElapsed = totalDays;
  } else {
    daysElapsed = clamp(daysBetween(start, today) + 1, 0, totalDays);
  }
  const daysRemaining = clamp(totalDays - daysElapsed, 0, totalDays);
  const percentComplete = totalDays === 0 ? 0 : (daysElapsed / totalDays) * 100;

  return {
    quarter,
    year,
    start,
    end,
    totalDays,
    daysElapsed,
    daysRemaining,
    percentComplete
  };
};

export const getQuarterInfo = (today = new Date()): QuarterInfo => {
  const year = today.getFullYear();
  const quarter = (Math.floor(today.getMonth() / 3) + 1) as QuarterInfo["quarter"];
  return getQuarterInfoFor(quarter, year, today);
};

export const getYearInfo = (today = new Date()): YearInfo => {
  const year = today.getFullYear();
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const totalDays = daysBetween(start, end) + 1;
  const todayUtc = toUtcMidnight(today);
  const startUtc = toUtcMidnight(start);
  const endUtc = toUtcMidnight(end);
  let daysElapsed = 0;
  if (todayUtc < startUtc) {
    daysElapsed = 0;
  } else if (todayUtc > endUtc) {
    daysElapsed = totalDays;
  } else {
    daysElapsed = clamp(daysBetween(start, today) + 1, 0, totalDays);
  }
  const daysRemaining = clamp(totalDays - daysElapsed, 0, totalDays);
  const percentComplete = totalDays === 0 ? 0 : (daysElapsed / totalDays) * 100;

  return {
    year,
    start,
    end,
    totalDays,
    daysElapsed,
    daysRemaining,
    percentComplete
  };
};

export const getCompletionPercent = (project: Project) => {
  const total = project.subtasks.length;
  if (total === 0) return 0;
  const done = project.subtasks.filter((task) => task.completed).length;
  return (done / total) * 100;
};

export const getDaysUntilDeadline = (project: Project, today = new Date()) => {
  const deadline = new Date(project.deadline + "T00:00:00");
  return daysBetween(today, deadline);
};

export const getProjectStatus = (
  project: Project,
  quarter: QuarterInfo,
  today = new Date()
): ProjectStatus => {
  const completion = getCompletionPercent(project);
  const deadline = new Date(project.deadline + "T00:00:00");
  const totalTime = daysBetween(quarter.start, deadline);
  const elapsed = daysBetween(quarter.start, today);
  const expected =
    totalTime <= 0 ? 100 : clamp((elapsed / totalTime) * 100, 0, 100);
  const delta = completion - expected;

  if (delta >= 10) return "ahead";
  if (delta <= -10) return "behind";
  return "on_track";
};
