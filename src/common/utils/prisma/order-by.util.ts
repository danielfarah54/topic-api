import { OrderByInput } from '@/common/enums/order-by.enum';

import { toCamelCase } from '../functions/case-transform.util';

export function getOrderBy(orderBy?: OrderByInput): Record<string, 'asc' | 'desc'> {
  if (!orderBy) {
    return { name: 'asc' };
  }

  if (orderBy === OrderByInput.CREATED_AT) {
    return { updatedAt: 'desc' };
  }

  if (orderBy === OrderByInput.UPDATED_AT) {
    return { updatedAt: 'desc' };
  }

  return { [toCamelCase(orderBy)]: 'asc' };
}
