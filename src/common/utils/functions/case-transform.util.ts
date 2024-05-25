import { Transform } from 'class-transformer';

export const ToLowerCase = () =>
  Transform(({ value }: any) => {
    if (typeof value !== 'string') {
      return value;
    }
    return value.toLowerCase();
  });

export const ToUpperCase = () =>
  Transform(({ value }: any) => {
    if (typeof value !== 'string') {
      return value;
    }
    return value.toUpperCase();
  });

export function toCamelCase(str: string) {
  return str.toLowerCase().replace(/[-_](.)/g, (_, c) => c.toUpperCase());
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const HasValue = () =>
  Transform(({ value }) => {
    if (value !== null && value !== undefined && value !== '') return value;
    return undefined;
  });
