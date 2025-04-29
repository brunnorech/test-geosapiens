/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";

const INITIAL_PAGE = 1;

interface IUsePagination {
  list: any[];
  itemsPerPage: number;
}

function usePagination({ list, itemsPerPage = 5 }: IUsePagination) {
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const listSize = list.length;

  const totalPages = useMemo(() => {
    return Math.ceil(listSize / itemsPerPage);
  }, [listSize, itemsPerPage]);

  const itemsFromCurrentPage = useMemo(() => {
    const endIndex = currentPage * itemsPerPage;
    const startIndex = endIndex - itemsPerPage;

    return list.slice(startIndex, endIndex);
  }, [currentPage, list, itemsPerPage]);

  console.log({ totalPages });

  function nextPage() {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }

  function previousPage() {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }

  function gotoPage(page: number) {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  }

  return {
    items: itemsFromCurrentPage,
    totalPages,
    currentPage,
    nextPage,
    previousPage,
    gotoPage,
  };
}

export default usePagination;
