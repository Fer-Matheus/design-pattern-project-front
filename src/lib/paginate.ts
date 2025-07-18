interface Paginate<T> {
  page: number;
  per_page: number;
  total: number;
  items: T[];
}
