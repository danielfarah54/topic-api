import { toCamelCase } from '../functions/case-transform.util';

export function getOrderBy(orderBy?: string) {
  if (!orderBy) return { name: 'asc' };
  if (orderBy === 'UPDATED_AT') return { updatedAt: 'desc' };
  return { [toCamelCase(orderBy)]: 'asc' };
}
