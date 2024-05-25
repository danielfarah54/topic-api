import { PaginationInput } from '@/common/dtos/pagination.dto';
import { IPaginationParams } from '@/common/interfaces/pagination-params.interface';

const DEFAULT_PAGE_SIZE = 10;

export function calculatePagination(data?: any & Partial<PaginationInput>): IPaginationParams {
  const pageSize = data?.pageSize ?? DEFAULT_PAGE_SIZE;
  const skip = data?.page ? (data.page - 1) * pageSize : 0;

  return {
    take: pageSize,
    skip,
  };
}
