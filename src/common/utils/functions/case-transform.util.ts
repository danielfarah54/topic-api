import { Transform } from 'class-transformer';

export const ToLowerCase = (): PropertyDecorator =>
  Transform(({ value }: any) => {
    if (typeof value !== 'string') {
      return value;
    }
    return value.toLowerCase();
  });

export const ToUpperCase = (): PropertyDecorator =>
  Transform(({ value }: any) => {
    if (typeof value !== 'string') {
      return value;
    }
    return value.toUpperCase();
  });

export function toCamelCase(str: string): string {
  return str.toLowerCase().replace(/[-_](.)/g, (_, c) => c.toUpperCase());
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const HasValue = (): PropertyDecorator =>
  Transform(({ value }) => {
    if (value !== null && value !== undefined && value !== '') return value;
    return undefined;
  });
