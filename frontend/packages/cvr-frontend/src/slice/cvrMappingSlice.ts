import { createSlice, createAsyncThunk, Slice } from "@reduxjs/toolkit";
import axios, { AxiosResponse, AxiosError } from "axios";
import { getUrlInCvr } from "../helpers/url";
import { setShowErrorModal } from "./preferenceSlice";

import {
  ICvrMappingSlice,
  IFetchMappings,
  IFetchFields,
  IAppFields,
  IFields,
} from "../types/cvrMappingTypes";

interface IProps {
  userIds: {
    [k: string]: number | string;
  };
}

const initialState: ICvrMappingSlice = {
  mappings: {
    loading: false,
    defaultMappings: {},
    error: "",
    currentRequestId: null,
  },
  appFields: {
    loading: false,
    fields: {},
    error: "",
    currentRequestId: null,
  },
  deletedProperties: [],
  searchInput: "",
  searchFilteredArray: {},
  currentlyEditing: "",
  selectedPreference: {},
  isEditMapping: false,
  isCvrCheck: false,
  activeAccordion: "basicMappings",
  isMappingsSaved: false,
  contactCreation: false,
  activeKey: "companyMappings",
};

export const fetchMappings = createAsyncThunk(
  "cvr/fetchMappings",
  async (props: IProps, { dispatch }) => {
    try {
      const { userIds } = props;
      const res: AxiosResponse<IFetchMappings> =
        await axios.get<IFetchMappings>(getUrlInCvr("VITE_FETCH_MAPPINGS"), {
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

export const fetchAppFields = createAsyncThunk(
  "cvr/fetchAppFields",
  async (props: IProps, { dispatch }) => {
    try {
      const { userIds } = props;
      const res: AxiosResponse<IFetchFields> = await axios.get<IFetchFields>(
        getUrlInCvr("VITE_FETCH_APP_FIELDS"),
        {
          params: userIds,
        }
      );
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

export const cvrMappingSlice: Slice<ICvrMappingSlice> = createSlice({
  name: "cvrMapping",
  initialState,
  reducers: {
    validateProperties(state, { payload }) {
      const { appProperties, mappingsFor } = payload;
      const { defaultMappings } = state.mappings;
      const emptyArray: string[] = [];

      const newSet = new Set(
        appProperties.map((property: IAppFields) => property.value)
      );

      Object.keys(mappingsFor).forEach((item) => {
        Object.entries(defaultMappings[item]).forEach((mapping) => {
          if (mapping[1].value && !newSet.has(mapping[1].value)) {
            emptyArray.push(mapping[1].value);
          }
        });
      });
      state.deletedProperties = emptyArray;
    },

    onSearchCvrMappings(state, { payload }) {
      const { searchString, filteredArray, mappingKeys } = payload;
      const activeItem =
        mappingKeys.length > 1 ? state.activeAccordion : mappingKeys[0];
      state.searchInput = searchString;
      state.searchFilteredArray = {};
      if (state.searchInput !== "") {
        const filter = filteredArray.filter(
          (el: { keyword: string; key: string }) => {
            return (
              el.keyword
                .toLowerCase()
                .includes(state.searchInput.toLowerCase()) ||
              el.key.toLowerCase().includes(state.searchInput.toLowerCase())
            );
          }
        );

        const filteredData: { [k: string]: IFields } = {};
        Object.keys(state.mappings.defaultMappings).map((key) => {
          filteredData[key] = {};
        });

        for (const item of filter) {
          filteredData[activeItem][item.key] =
            state.mappings.defaultMappings[activeItem][item.key];
        }

        state.searchFilteredArray = filteredData;
      } else {
        state.searchFilteredArray = state.mappings.defaultMappings;
      }
    },

    storeActiveAccordion(state, { payload }) {
      const { activeAccordion } = payload;
      state.activeAccordion = activeAccordion;
      state.searchInput = "";
      Object.keys(state.searchFilteredArray).map((key) => {
        state.searchFilteredArray[key] = {};
      });
    },

    editMapping(state, { payload }) {
      const { cvrKey } = payload;
      state.isEditMapping = true;
      state.currentlyEditing = cvrKey;
    },

    deleteMapping(state, { payload }) {
      const { cvrKey, mappingKeys } = payload;
      const activeItem =
        mappingKeys && mappingKeys.length > 1
          ? state.activeAccordion
          : mappingKeys[0];
      const { defaultMappings } = state.mappings;
      defaultMappings[activeItem][cvrKey] = {
        ...defaultMappings[activeItem][cvrKey],
        value: "",
        label: "",
        description: "",
      };
      state.mappings.defaultMappings = defaultMappings;
      state.isMappingsSaved = true;
    },

    updateMapping(state, { payload }) {
      const { title, cvrKey } = payload;
      const { defaultMappings } = state.mappings;
      if (
        state.selectedPreference &&
        Object.keys(state.selectedPreference).length > 0
      ) {
        Object.entries(defaultMappings[title]).forEach((mapping) => {
          if (mapping[0] === cvrKey) {
            defaultMappings[title][mapping[0]].value =
              state.selectedPreference.value;
            defaultMappings[title][mapping[0]].label =
              state.selectedPreference.label;
            defaultMappings[title][mapping[0]].description =
              state.selectedPreference.description;
            state.mappings.defaultMappings = defaultMappings;
          }
        });
      }
      if (cvrKey === "CVR Number") {
        state.isCvrCheck = false;
      }
      state.selectedPreference = {};
      state.isEditMapping = false;
      state.currentlyEditing = "";
      state.isMappingsSaved = true;
    },

    cancelMapping(state) {
      state.selectedPreference = {};
      state.isEditMapping = false;
      state.currentlyEditing = "";
    },

    setSelectedPreference(state, { payload }) {
      const { appProperty } = payload;
      state.selectedPreference = appProperty;
    },

    setIsMappingsSaved(state) {
      state.isMappingsSaved = false;
    },
    onChangeContactCreation(state) {
      state.contactCreation = !state.contactCreation;
      state.isMappingsSaved = true;
    },
    clearDefaultValues(state) {
      state.searchInput = "";
      state.searchFilteredArray = {};
      state.currentlyEditing = "";
      state.selectedPreference = {};
      state.isEditMapping = false;
      state.activeAccordion = "basicMappings";
    },
    storeActiveKey(state, { payload }) {
      const { activeKey } = payload;
      state.activeKey = activeKey;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMappings.pending, (state, action) => {
      if (!state.mappings.loading) {
        state.mappings.loading = true;
        state.mappings.currentRequestId = action.meta.requestId;
      }
    });

    builder.addCase(fetchMappings.fulfilled, (state, action) => {
      state.mappings.loading = false;
      state.mappings.currentRequestId = null;
      const mappings = action.payload;
      state.contactCreation = mappings?.createContacts as unknown as boolean;
      delete mappings.createContacts;
      const defaultMappings: { [k: string]: IFields } = {};
      const nonDefaultMappings: { [k: string]: IFields } = {};
      const keys = Object.keys(mappings);

      keys.map((key) => {
        defaultMappings[key] = {};
        nonDefaultMappings[key] = {};
        state.searchFilteredArray[key] = {};
      });

      keys.forEach((key) => {
        Object.entries(mappings[key]).filter((entry) => {
          if (entry[1].value === "" && !entry[1].required) {
            nonDefaultMappings[key][entry[0]] = entry[1];
          } else {
            defaultMappings[key][entry[0]] = entry[1];
          }
        });
        state.mappings.defaultMappings[key] = {
          ...defaultMappings[key],
          ...nonDefaultMappings[key],
        };
      });
      if (
        !mappings.basicMappings["CVR Number"].value ||
        mappings.basicMappings["CVR Number"].value === ""
      ) {
        state.isCvrCheck = true;
        state.isEditMapping = true;
        state.currentlyEditing = "CVR Number";
      }
    });

    builder.addCase(fetchMappings.rejected, (state, action) => {
      state.mappings.loading = false;
      state.mappings.currentRequestId = null;
      state.mappings.error = action.error.message ?? "";
    });

    builder.addCase(fetchAppFields.pending, (state, action) => {
      if (!state.appFields.loading) {
        state.appFields.loading = true;
        state.appFields.currentRequestId = action.meta.requestId;
      }
    });
    builder.addCase(fetchAppFields.fulfilled, (state, action) => {
      state.appFields.loading = false;
      state.appFields.currentRequestId = null;
      state.appFields.fields = action.payload;
    });

    builder.addCase(fetchAppFields.rejected, (state, action) => {
      state.appFields.loading = false;
      state.appFields.currentRequestId = null;
      state.appFields.error = action.error.message ?? "";
    });
  },
});

export const {
  validateProperties,
  onSearchCvrMappings,
  storeActiveAccordion,
  editMapping,
  updateMapping,
  deleteMapping,
  cancelMapping,
  setSelectedPreference,
  setIsMappingsSaved,
  onChangeContactCreation,
  clearDefaultValues,
  storeActiveKey,
} = cvrMappingSlice.actions;

export default cvrMappingSlice.reducer;
