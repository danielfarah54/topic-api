import _ from 'lodash';

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomHex() {
  return randomInt(0, 65536).toString(16);
}

export function randomLongHexString() {
  return randomHex() + randomHex();
}

export function randomObject<T>(it: T[]): T | undefined {
  return _.sample(it);
}

export function randomJoin(source: string[][], joiner: string) {
  return source.map((it) => randomObject(it)).join(joiner);
}

export function randomEnum<T>(_enum: Record<string, string>): T[keyof T] {
  return _.sample(Object.values(_enum)) as T[keyof T];
}

export function randomTime(timeRange?: { hourRange: Array<number>; minuteRange: Array<number> }): string {
  const startHourRange = timeRange ? timeRange.hourRange[0] : 0;
  const endHourRange = timeRange ? timeRange.hourRange[1] : 23;

  const startMinuteRange = timeRange ? timeRange.minuteRange[0] : 0;
  const endMinuteRange = timeRange ? timeRange.minuteRange[1] : 59;

  const randomHour = randomInt(startHourRange, endHourRange);
  const randomMinute = randomInt(startMinuteRange, timeRange && randomHour < endHourRange ? 59 : endMinuteRange);

  return randomHour.toString().padStart(2, '0') + ':' + randomMinute.toString().padStart(2, '0');
}

export function randomObjecValue<T>(obj: Record<string, T>): T {
  const keys = Object.keys(obj);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  return obj[randomKey];
}
