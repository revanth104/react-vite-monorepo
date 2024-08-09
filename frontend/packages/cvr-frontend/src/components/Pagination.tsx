import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";

import { IPreferenceSlice } from "../types/preferenceTypes";

import {
  setItemOffset,
  setSlicedCompanies,
  setPageCount,
} from "../slice/preferenceSlice";

import { ICompaniesData } from "../types/searchWindowTypes";

interface IProps {
  paginationData: ICompaniesData[];
  itemsPerPage: number;
}

const Pagination = (props: IProps) => {
  const { paginationData, itemsPerPage } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const path = window.location.pathname;

  const dispatch = useDispatch();
  const {
    paginationSearchResults,
    paginationSearchInput,
    itemOffset,
    pageCount,
  } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  useEffect(() => {
    if (
      paginationData.length > 0 &&
      paginationSearchResults.length > 0 &&
      paginationSearchInput
    ) {
      const endOffset = itemOffset + itemsPerPage;
      dispatch(
        setSlicedCompanies({ companies: paginationSearchResults, endOffset })
      );
      const numberOfPages = Math.ceil(
        paginationSearchResults.length / itemsPerPage
      );
      dispatch(setPageCount({ numberOfPages }));
    } else if (paginationData.length > 0) {
      const endOffset = itemOffset + itemsPerPage;
      dispatch(setSlicedCompanies({ companies: paginationData, endOffset }));
      const numberOfPages = Math.ceil(paginationData.length / itemsPerPage);
      dispatch(setPageCount({ numberOfPages }));
    }
  }, [itemOffset, itemsPerPage, paginationData, paginationSearchResults]);

  useEffect(() => {
    if (
      paginationData.length > 0 &&
      paginationSearchResults.length > 0 &&
      paginationSearchInput
    ) {
      const newOffset =
        (selectedIndex * itemsPerPage) % paginationSearchResults.length;
      dispatch(setItemOffset({ offset: newOffset }));
    } else {
      const newOffset = (selectedIndex * itemsPerPage) % paginationData.length;
      dispatch(setItemOffset({ offset: newOffset }));
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (paginationSearchResults.length > 0) {
      setSelectedIndex(0);
    }
  }, [paginationSearchResults]);

  return (
    <div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={(event) => {
          setSelectedIndex(event.selected);
          path === "/query-search"
            ? window.scrollTo(0, 620)
            : window.scrollTo(0, 200);
        }}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        containerClassName="pagination-container"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="active"
        disabledLinkClassName="disabled"
        marginPagesDisplayed={3}
        forcePage={selectedIndex}
      />
    </div>
  );
};

export default Pagination;
