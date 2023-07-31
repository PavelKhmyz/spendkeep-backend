import SortDirection from '../../enums/SortDirection';

export interface IPaginationLimitParams {
  offset?: number;
  count?: number;
}

interface IPaginationParams<SortField> extends IPaginationLimitParams {
  search?: string;
  sortField?: SortField;
  sortDirection?: SortDirection;
}

export interface IPaginationResult<Item> {
  total: number;
  items: Item[];
}

export default IPaginationParams;
