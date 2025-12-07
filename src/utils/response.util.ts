export function standardPaginatedResponse({
  data,
  totalCount,
  currentPage,
  pageSize,
  baseUrl
}) {
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    count: totalCount,
    total_pages: totalPages,
    current_page: currentPage,
    next:
      currentPage < totalPages
        ? `${baseUrl}?page=${currentPage + 1}&page_size=${pageSize}`
        : null,
    previous:
      currentPage > 1
        ? `${baseUrl}?page=${currentPage - 1}&page_size=${pageSize}`
        : null,
    page_size: pageSize,
    data: data,
  };
}
