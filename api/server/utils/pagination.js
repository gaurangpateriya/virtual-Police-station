import { PAGE_SIZE } from "../../../constants";

export const getPagingData = (data, page) => {
  const { count: totalItems, rows  } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  return { totalItems,data:rows , totalPages, currentPage };
};

export const getPagination = (page, size) => {
  const limit =  PAGE_SIZE;
  const offset = page ? (page-1) * limit : 0;

  return { limit, offset };
};