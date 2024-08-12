import { createSlice, createAsyncThunk, Slice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { getUrlInCvr } from "../helpers/url";

import {
  IPreferenceSlice,
  ICompanies,
  ISearchCompanies,
} from "../types/preferenceTypes";

interface IProps {
  userIds: {
    [k: string]: number | string;
  };
}

const initialState: IPreferenceSlice = {
  errorMessage: [],
  successMessage: "",
  subscriptionDetails: {
    loading: false,
    subscription: {},
    error: "",
  },
  userIds: {},
  showSaveModal: false,
  slicedCompanies: [],
  paginationSearchResults: [],
  paginationSearchInput: "",
  itemOffset: 0,
  pageCount: 0,
  bulkFeatureStats: {
    bulkUpdate: {},
    bulkCreate: {},
  },
  showProgressBar: false,
  showBulkFeatureModal: false,
};

export const fetchSubscription = createAsyncThunk(
  "preference/fetchSubscription",
  async (props: IProps) => {
    try {
      const { userIds } = props;
      const res = await axios.get(getUrlInCvr("VITE_GET_PLAN_URL"), {
        params: userIds,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      let errorMessage;
      if (error instanceof Error) errorMessage = error.message;
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data.message
      )
        errorMessage = error.response.data.message;
      console.log(errorMessage);
      throw error;
    }
  }
);

export const preferenceSlice: Slice<IPreferenceSlice> = createSlice({
  name: "preference",
  initialState,
  reducers: {
    setShowSuccessModal(state, { payload }) {
      state.successMessage = payload.message;
    },
    onHideSuccessModal(state) {
      state.successMessage = "";
    },
    setShowErrorModal(state, { payload }) {
      state.errorMessage.push(payload.message);
    },
    onHideErrorModal(state) {
      state.errorMessage.shift();
    },
    updateUserIds(state, { payload }) {
      Object.keys(payload).map((key) => {
        state.userIds[key] = parseInt(payload[key]);
      });
    },
    hideSaveModal(state) {
      state.showSaveModal = false;
    },
    showSaveModal(state) {
      state.showSaveModal = true;
    },
    setSubScriptionDetails(state, { payload }) {
      state.subscriptionDetails.subscription = {
        ...state.subscriptionDetails.subscription,
        ...payload,
      };
    },

    // search functionality for the companies in the Pagination for the bulk update and for the search results.
    setPaginationSearchResults(state, { payload }) {
      const {
        searchFor,
        bulkUpdateCompanies,
        cvrKey,
        searchKeyword,
        searchResults,
      } = payload;
      state.paginationSearchInput = searchKeyword;
      let filteredCompanies = [];
      if (searchFor === "bulkUpdate") {
        filteredCompanies =
          bulkUpdateCompanies &&
          bulkUpdateCompanies.length > 0 &&
          bulkUpdateCompanies.filter((company: ICompanies) => {
            if (company.properties) {
              return (
                company.properties.name
                  .toLowerCase()
                  .includes(state.paginationSearchInput.toLowerCase()) ||
                company.properties[cvrKey]
                  .toLowerCase()
                  .includes(state.paginationSearchInput.toLowerCase())
              );
            }
          });
        state.paginationSearchResults = filteredCompanies;
      } else if (searchFor === "searchResults") {
        filteredCompanies =
          searchResults &&
          searchResults.length > 0 &&
          searchResults.filter((company: ISearchCompanies) => {
            const companyName =
              company._source.Vrvirksomhed.virksomhedMetadata.nyesteNavn.navn;
            const cvrNumber = company._source.Vrvirksomhed.cvrNummer;
            return (
              companyName
                .toLowerCase()
                .includes(state.paginationSearchInput.toLowerCase()) ||
              cvrNumber
                ?.toString()
                .toLowerCase()
                .includes(state.paginationSearchInput.toLowerCase())
            );
          });
        state.paginationSearchResults = filteredCompanies;
      }
    },

    setPaginationSearchInput(state, { payload }) {
      const { searchKeyword } = payload;
      state.paginationSearchInput = searchKeyword;
    },

    setItemOffset(state, { payload }) {
      const { offset } = payload;
      state.itemOffset = offset;
    },

    setSlicedCompanies(state, { payload }) {
      const { companies, endOffset } = payload;
      state.slicedCompanies = companies.slice(state.itemOffset, endOffset);
    },
    setPageCount(state, { payload }) {
      const { numberOfPages } = payload;
      state.pageCount = numberOfPages;
    },
    setBulkFeatureStats(state, { payload }) {
      const { bulkStatsKey, stats } = payload;
      state.bulkFeatureStats[bulkStatsKey] = stats;
    },
    setShowProgressBar(state, { payload }) {
      const { show } = payload;
      state.showProgressBar = show;
    },
    setShowBulkFeatureModal(state, { payload }) {
      const { showModal } = payload;
      state.showBulkFeatureModal = showModal;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSubscription.pending, (state) => {
      if (!state.subscriptionDetails.loading) {
        state.subscriptionDetails.loading = true;
      }
    });
    builder.addCase(fetchSubscription.fulfilled, (state, action) => {
      state.subscriptionDetails.loading = false;
      state.subscriptionDetails.subscription = action.payload;
      state.subscriptionDetails.error = "";
    });
    builder.addCase(fetchSubscription.rejected, (state, action) => {
      state.subscriptionDetails.loading = false;
      state.subscriptionDetails.subscription = {};
      state.subscriptionDetails.error = action.error.message ?? "";
    });
  },
});

export const {
  setShowErrorModal,
  onHideErrorModal,
  setShowSuccessModal,
  onHideSuccessModal,
  updateUserIds,
  setSubScriptionDetails,
  hideSaveModal,
  showSaveModal,
  setPaginationSearchResults,
  setItemOffset,
  setPageCount,
  setPaginationSearchInput,
  setSlicedCompanies,
  setBulkFeatureStats,
  setShowBulkFeatureModal,
  setShowProgressBar,
} = preferenceSlice.actions;

export default preferenceSlice.reducer;
