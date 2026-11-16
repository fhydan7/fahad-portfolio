import { dimDate } from "./dimensions";

export interface Filters {
  dateFrom: string; // dateKey, inclusive
  dateTo: string; // dateKey, inclusive
  region: string; // "All" | region name
  lineKey: string; // "All" | lineKey
  locationKey: string; // "All" | locationKey
  serviceKey: string; // "All" | serviceKey
  deptKey: string; // "All" | deptKey
}

export const ALL = "All";

export const defaultFilters: Filters = {
  dateFrom: dimDate[dimDate.length - 12]?.dateKey ?? dimDate[0].dateKey, // last 12 months by default
  dateTo: dimDate[dimDate.length - 1].dateKey,
  region: ALL,
  lineKey: ALL,
  locationKey: ALL,
  serviceKey: ALL,
  deptKey: ALL,
};

export function inDateRange(dateKey: string, f: Filters) {
  return dateKey >= f.dateFrom && dateKey <= f.dateTo;
}

export function matchesRegion(region: string, f: Filters) {
  return f.region === ALL || region === f.region;
}
export function matchesLine(lineKey: string, f: Filters) {
  return f.lineKey === ALL || lineKey === f.lineKey;
}
export function matchesLocation(locationKey: string, f: Filters) {
  return f.locationKey === ALL || locationKey === f.locationKey;
}
export function matchesService(serviceKey: string, f: Filters) {
  return f.serviceKey === ALL || serviceKey === f.serviceKey;
}
export function matchesDept(deptKey: string, f: Filters) {
  return f.deptKey === ALL || deptKey === f.deptKey;
}

export function datesInRange(f: Filters) {
  return dimDate.filter((d) => inDateRange(d.dateKey, f)).map((d) => d.dateKey);
}

// previous period of equal length immediately before dateFrom, used for trend/variance
export function priorPeriod(f: Filters): Filters {
  const keys = dimDate.map((d) => d.dateKey);
  const fromIdx = keys.indexOf(f.dateFrom);
  const toIdx = keys.indexOf(f.dateTo);
  const len = toIdx - fromIdx + 1;
  const priorTo = keys[Math.max(0, fromIdx - 1)];
  const priorFrom = keys[Math.max(0, fromIdx - len)];
  return { ...f, dateFrom: priorFrom, dateTo: priorTo };
}

export function pctChange(current: number, prior: number) {
  if (!prior) return 0;
  return ((current - prior) / prior) * 100;
}
