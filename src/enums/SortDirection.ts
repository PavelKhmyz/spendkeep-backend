enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export const convertSortDirectionToNumber = (direction: SortDirection) => direction === SortDirection.Asc ? 1 : -1;

export default SortDirection;
