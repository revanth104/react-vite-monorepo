import { createSlice, createAsyncThunk, Slice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

import { getUrlInCvr } from "../helpers/url";
import { setShowErrorModal } from "./preferenceSlice";

import { ISearchWindowSlice, IProperties } from "../types/searchWindowTypes";

interface IProps {
  userIds?: {
    [k: string]: number | string;
  };
  keyword?: string;
}

const initialState: ISearchWindowSlice = {
  financialData: {
    loading: false,
    financial: {},
    error: "",
  },
  companies: {
    loading: false,
    companiesData: [],
    error: "",
  },
  cvrProperties: {
    loading: false,
    properties: {},
    error: "",
  },
  dataFetched: false,
  searchInput: "",
  globalSearch: "person",
  isAllSelected: false,
  location: undefined,
  locationComparison: undefined,
  sizeComparison: undefined,
  industryType: undefined,
  companyStatusComparison: { title: "Equal to", value: "eq" },
  logicalOperator: {
    title: "And",
    value: "and",
  },
  size: 0,
  selectedCompanies: [],
  locationSelectedFields: [],
  industryTypeSelectedFields: [],
  companyStatusSelectedFields: [
    {
      title: "Normal / aktiv",
      value: "NORMAL",
    },
  ],
  showInfo: false,
  checked: [],
  expanded: [],
  selectedItems: [],
  showIndustryTypeModal: false,
  showMultipleOrgModal: false,
};

export const fetchFinancialData = createAsyncThunk(
  "searchWindow/fetchFinancialData",
  async (props: IProps, { dispatch }) => {
    try {
      const { userIds } = props;
      const res = await axios.get(getUrlInCvr("VITE_GET_FINANCIAL_DATA"), {
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
      dispatch(setShowErrorModal({ message: errorMessage }));
      throw error;
    }
  }
);

export const getCompanies = createAsyncThunk(
  "searchWindow/getCompanies",
  async (props: IProps, { dispatch }) => {
    try {
      const { keyword } = props;
      if (keyword === "") throw new Error("Search input should not be empty.");
      const res = await axios.get(getUrlInCvr("VITE_SEARCH_COMPANIES_URL"), {
        params: {
          keyword,
        },
      });
      if (res.data.hits.hits.length === 0)
        throw new Error("No companies found for the given keyword.");
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
      dispatch(setShowErrorModal({ message: errorMessage }));
      throw error;
    }
  }
);

export const getSearchQueryCompanies = createAsyncThunk(
  "searchWindow/querySearch",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (props: any, { dispatch }) => {
    try {
      const { userIds, data } = props;
      const res = await axios.post(getUrlInCvr("VITE_SEARCH_COMPANY_QUERY"), {
        userIds,
        ...data,
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
      dispatch(setShowErrorModal({ message: errorMessage }));
      throw error;
    }
  }
);

export const getCvrProperties = createAsyncThunk(
  "searchWindow/getCvrProperties",
  async (props: IProps, { dispatch }) => {
    try {
      const { userIds } = props;
      const res = await axios.get(getUrlInCvr("VITE_GET_CVR_PROPERTIES_URL"), {
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
      dispatch(setShowErrorModal({ message: errorMessage }));
      throw error;
    }
  }
);

const convertNumbers = (value: string) => {
  const roundOffNumber = Math.round(parseInt(value) / 1000);
  return roundOffNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const searchWindowSlice: Slice<ISearchWindowSlice> = createSlice({
  name: "searchWindow",
  initialState,
  reducers: {
    setCompaniesData(state) {
      state.companies.companiesData = [];
      state.selectedCompanies = [];
    },
    setShowInfo(state, { payload }) {
      const { showInfo } = payload;
      state.showInfo = showInfo;
    },
    setSearchInput(state, { payload }) {
      state.searchInput = payload.searchKeyword;
      if (payload.searchKeyword === "") {
        state.companies.companiesData = [];
      }
    },
    setGlobalSearch(state, { payload }) {
      const { globalSearchKeyword } = payload;
      state.globalSearch = globalSearchKeyword;
    },
    handleSelectAll(state, { payload }) {
      const { isChecked } = payload;
      if (isChecked) {
        state.isAllSelected = isChecked;
        state.companies.companiesData.forEach((company) => {
          company.isChecked = true;
          state.selectedCompanies.push({
            cvrNumber: company._source.Vrvirksomhed.cvrNummer,
            companyName:
              company._source.Vrvirksomhed.virksomhedMetadata.nyesteNavn.navn,
            cvrId: company._id,
          });
        });
      } else if (!isChecked) {
        state.isAllSelected = false;
        state.companies.companiesData.forEach(
          (company) => (company.isChecked = false)
        );
        state.selectedCompanies = [];
      }
    },
    onSelectCompany(state, { payload }) {
      const { isChecked, id, cvrNumber, companyName } = payload;
      state.isAllSelected = false;
      if (isChecked) {
        const index = state.companies.companiesData.findIndex(
          (company) => company._id === id
        );
        const companyFound = state.companies.companiesData[index];
        state.selectedCompanies.push({
          cvrNumber: cvrNumber,
          companyName: companyName,
          cvrId: id,
        });
        companyFound.isChecked = true;
        state.companies.companiesData.splice(index, 1, companyFound);
      } else if (!isChecked) {
        const index = state.companies.companiesData.findIndex(
          (company) => company._id === id
        );

        const companyFound = state.companies.companiesData[index];
        companyFound.isChecked = false;
        state.companies.companiesData.splice(index, 1, companyFound);
        const cvrNumberIndex = state.selectedCompanies.findIndex(
          (number) => number.cvrNumber === cvrNumber
        );
        if (cvrNumberIndex !== -1) {
          state.selectedCompanies.splice(cvrNumberIndex, 1);
        }
      }
    },
    onSelectQueries(state, { payload }) {
      const { selectingFor, selectedOption } = payload;
      if (selectingFor === "location") {
        state.location = {
          title: selectedOption.title,
          value: selectedOption.value,
          type: selectedOption.type,
        };
        state.locationSelectedFields = [];
      } else if (selectingFor === "locationComparison") {
        state.locationComparison = {
          title: selectedOption.title,
          value: selectedOption.value,
        };
      } else if (selectingFor === "sizeComparison") {
        state.sizeComparison = {
          title: selectedOption.title,
          value: selectedOption.value,
        };
      } else if (selectingFor === "industryTypeComparison") {
        state.industryType = {
          title: selectedOption.title,
          value: selectedOption.value,
        };
      } else if (selectingFor === "logicalOperator") {
        state.logicalOperator = {
          title: selectedOption.title,
          value: selectedOption.value,
        };
      } else if (selectingFor === "companyStatusComparison") {
        state.companyStatusComparison = {
          title: selectedOption.title,
          value: selectedOption.value,
        };
      }
    },
    onSelectSize(state, { payload }) {
      const { size } = payload;
      state.size = parseInt(size);
    },
    onSelectMultipleOptions(state, { payload }) {
      const { checked, selectedValue, selectedFor } = payload;
      if (
        checked &&
        (selectedFor === "postalCode" || selectedFor === "municipality")
      ) {
        state.locationSelectedFields.push(selectedValue);
      } else if (checked && selectedFor === "industryType") {
        state.industryTypeSelectedFields.push(selectedValue);
      } else if (checked && selectedFor === "companyStatus") {
        state.companyStatusSelectedFields.push(selectedValue);
      } else if (
        !checked &&
        (selectedFor === "postalCode" || selectedFor === "municipality")
      ) {
        const index = state.locationSelectedFields.findIndex(
          (item) => item.value === selectedValue.value
        );
        if (index !== -1) {
          state.locationSelectedFields.splice(index, 1);
        }
      } else if (!checked && selectedFor === "industryType") {
        const index = state.industryTypeSelectedFields.findIndex(
          (item) => item.value === selectedValue.value
        );
        if (index !== -1) {
          state.industryTypeSelectedFields.splice(index, 1);
        }
      } else if (!checked && selectedFor === "companyStatus") {
        const index = state.companyStatusSelectedFields.findIndex(
          (item) => item.value === selectedValue.value
        );
        if (index !== -1) {
          state.companyStatusSelectedFields.splice(index, 1);
        }
      }
    },
    onDeleteMultipleOptions(state, { payload }) {
      const { checked, selectedKey, selectedFor } = payload;
      if (
        !checked &&
        (selectedFor === "postalCode" || selectedFor === "municipality")
      ) {
        const index = state.locationSelectedFields.findIndex(
          (item) => item.value === selectedKey
        );
        if (index !== -1) {
          state.locationSelectedFields.splice(index, 1);
        }
      } else if (!checked && selectedFor === "industryType") {
        const index = state.industryTypeSelectedFields.findIndex(
          (item) => item.value === selectedKey
        );
        if (index !== -1) {
          state.industryTypeSelectedFields.splice(index, 1);
        }
      } else if (!checked && selectedFor === "companyStatus") {
        const index = state.companyStatusSelectedFields.findIndex(
          (item) => item.value === selectedKey
        );
        if (index !== -1) {
          state.companyStatusSelectedFields.splice(index, 1);
        }
      }
    },
    setChecked(state, { payload }) {
      const { checked } = payload;
      state.selectedItems = checked;
    },
    setSavedSelectedItems(state) {
      state.checked = state.selectedItems;
      state.selectedItems = [];
    },
    setExpanded(state, { payload }) {
      const { expanded } = payload;
      state.expanded = expanded;
    },
    setCancelIndustryType(state) {
      state.checked = [];
      state.expanded = [];
    },
    setShowIndustryTypeModal(state) {
      state.showIndustryTypeModal = !state.showIndustryTypeModal;
      if (state.showIndustryTypeModal) {
        state.selectedItems = state.checked;
      }
    },
    setShowMultipleOrgModal(state, { payload }) {
      state.showMultipleOrgModal = payload.show;
    },
    setValuesToDefault(state) {
      state.isAllSelected = false;
      state.selectedCompanies = [];
      state.showInfo = false;
      state.expanded = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFinancialData.pending, (state) => {
      if (!state.financialData.loading) {
        state.financialData.loading = true;
      }
    });
    builder.addCase(fetchFinancialData.fulfilled, (state, action) => {
      state.financialData.loading = false;
      const { financial } = action.payload;
      if (financial && Object.keys(financial).length > 0) {
        const years = Object.keys(financial).sort().reverse();
        const data: { [key: string]: unknown } = {};
        for (const year of years) {
          data[`${year}`] = {
            "Net turnover": financial[`${year}`].revenue
              ? convertNumbers(financial[`${year}`].revenue)
              : "-",
            "Gross profit": financial[`${year}`].grossProfit
              ? convertNumbers(financial[`${year}`].grossProfit)
              : "-",
            "Net result": financial[`${year}`].profitLoss
              ? convertNumbers(financial[`${year}`].profitLoss)
              : "-",
            Equity: financial[`${year}`].equity
              ? convertNumbers(financial[`${year}`].equity)
              : "-",
            "Balance sheet": financial[`${year}`].status
              ? convertNumbers(financial[`${year}`].status)
              : "-",
            "Currency code": financial[`${year}`].currency
              ? financial[`${year}`].currency
              : "-",
          };
        }
        state.financialData.financial = data;
      }
    });
    builder.addCase(fetchFinancialData.rejected, (state, action) => {
      state.financialData.loading = false;
      state.financialData.financial = {};
      state.financialData.error = action.error.message ?? "";
    });

    builder.addCase(getCompanies.pending, (state) => {
      if (!state.companies.loading) {
        state.companies.loading = true;
        state.dataFetched = false;
      }
    });
    builder.addCase(getCompanies.fulfilled, (state, action) => {
      state.companies.loading = false;
      state.dataFetched = true;
      if (action.payload.hits.hits.length === 0) {
        state.companies.companiesData = [];
      } else {
        state.companies.companiesData = action.payload.hits.hits;
        state.companies.companiesData.forEach((company) => {
          company.isChecked = false;
        });
      }
      state.companies.error = "";
    });
    builder.addCase(getCompanies.rejected, (state, action) => {
      state.companies.loading = false;
      state.dataFetched = false;
      state.companies.error = action.error.message ?? "";
    });

    builder.addCase(getCvrProperties.pending, (state) => {
      if (!state.cvrProperties.loading) {
        state.cvrProperties.loading = true;
      }
    });
    builder.addCase(getCvrProperties.fulfilled, (state, action) => {
      if (state.cvrProperties.loading) {
        state.cvrProperties.loading = false;
        state.cvrProperties.properties = action.payload;
        const { postalCodes } = state.cvrProperties.properties;
        const codes: IProperties[] = [];
        if (postalCodes) {
          postalCodes.forEach((code) =>
            codes.push({ title: code.toString(), value: code.toString() })
          );
        }

        state.cvrProperties.properties.postalCodes = codes;
        state.cvrProperties.error = "";
      }
    });
    builder.addCase(getCvrProperties.rejected, (state, action) => {
      if (state.cvrProperties.loading) {
        state.cvrProperties.loading = false;
        state.cvrProperties.properties = {};
        state.cvrProperties.error = action.error.message ?? "";
      }
    });

    builder.addCase(getSearchQueryCompanies.pending, (state) => {
      if (!state.companies.loading) {
        state.companies.loading = true;
        state.dataFetched = false;
      }
    });
    builder.addCase(getSearchQueryCompanies.fulfilled, (state, action) => {
      state.companies.loading = false;
      state.dataFetched = true;
      if (action.payload.hits.hits.length === 0) {
        state.companies.companiesData = [];
      } else {
        state.companies.companiesData = action.payload.hits.hits;
        state.companies.companiesData.forEach((company) => {
          company.isChecked = false;
        });
      }
      state.companies.error = "";
    });
    builder.addCase(getSearchQueryCompanies.rejected, (state, action) => {
      state.companies.loading = false;
      state.dataFetched = false;
      state.companies.error = action.error.message ?? "";
    });
  },
});

export const {
  setSearchInput,
  setCompaniesData,
  setGlobalSearch,
  handleSelectAll,
  onSelectCompany,
  onSelectQueries,
  onSelectSize,
  onSelectMultipleOptions,
  onDeleteMultipleOptions,
  setShowInfo,
  setChecked,
  setExpanded,
  setCancelIndustryType,
  setValuesToDefault,
  setSavedSelectedItems,
  setShowMultipleOrgModal,
  setShowIndustryTypeModal,
} = searchWindowSlice.actions;

export default searchWindowSlice.reducer;
