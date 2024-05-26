import { OrderByInput } from '@/common/enums/order-by.enum';

import { toCamelCase } from '../functions/case-transform.util';

export function getOrderBy(orderBy?: OrderByInput) {
  if (!orderBy) {
    return { name: 'asc' };
  }

  if (orderBy === 'UPDATED_AT') {
    return { updatedAt: 'desc' };
  }

  return { [toCamelCase(orderBy)]: 'asc' };
}
