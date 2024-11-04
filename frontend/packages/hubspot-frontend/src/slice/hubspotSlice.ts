import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { setShowErrorModal, fetchStatus } from "@cloudify/generic";

import { getUrlInHs } from "../helpers/url";

import { IHubspotSlice } from "../types/types";

type THSProps = {
  userIds: {
    [key: string]: string | number;
  };
};

const initialState: IHubspotSlice = {
  fields: {
    loading: false,
    data: {},
    error: "",
    currentRequestId: null,
  },
  hubspotUserIds: {},
  currentWindow: "",
  progress: {
    "Invoice Sync Rules": true,
    "Customer Preferences": false,
    "Product Sync Rules": false,
  },
  missingScope: false,
};

/**
 * This function is used to fetch the hubspot fields.
 */
export const fetchHubSpotFields = createAsyncThunk(
  "hubspot/fetchHubSpotFields",
  async (props: THSProps, { dispatch }) => {
    try {
      const { userIds } = props;
      const res = await axios.get(
        `${getUrlInHs("VITE_FETCH_TRIGGER_APP_FIELDS")}`,
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
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data.details.category !== "MISSING_SCOPES"
      )
        dispatch(
          setShowErrorModal({
            message: errorMessage,
          })
        );
      throw error;
    }
  }
);

export const hubspotSlice = createSlice({
  name: "hubspot",
  initialState,
  reducers: {
    updateHubspotUserIds: (state, { payload }) => {
      const { portalId, userId } = payload;

      state.hubspotUserIds = {
        portalId: parseInt(portalId),
        userId: parseInt(userId),
      };
    },

    onChangeCurrentWindow(state, { payload }) {
      state.currentWindow = payload.currentWindow;
    },
    onChangeProgress(state, { payload }) {
      state.progress = {
        ...state.progress,
        ...payload,
      };
    },
    onChangeTime(state, { payload }) {
      state.timePreference = payload.selectedOption;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHubSpotFields.pending, (state, action) => {
      if (!state.fields.loading) {
        state.fields.loading = true;
        state.fields.currentRequestId = action.meta.requestId;
      }
    });

    builder.addCase(fetchHubSpotFields.fulfilled, (state, action) => {
      if (
        state.fields.loading &&
        state.fields.currentRequestId === action.meta.requestId
      ) {
        state.fields.loading = false;
        state.fields.data = action.payload;
        const { missingScope } = action.payload;
        if (
          missingScope.length > 0 &&
          missingScope === "Missing Contact Scopes"
        ) {
          state.missingScope = true;
        }
        state.fields.error = "";
        state.fields.currentRequestId = null;
      }
    });

    builder.addCase(fetchHubSpotFields.rejected, (state, action) => {
      if (
        state.fields.loading &&
        state.fields.currentRequestId === action.meta.requestId
      ) {
        state.fields.loading = false;
        state.fields.data = {};
        state.fields.error = action.error.message ?? "Something went wrong";
        state.fields.currentRequestId = null;
      }
    });

    builder.addCase(fetchStatus.fulfilled, (state, action) => {
      const { preferences } = action.payload;
      const { customerSync } = preferences;
      state.timePreference = customerSync?.time
        ? customerSync?.time
        : undefined;
    });
  },
});

export const {
  updateHubspotUserIds,
  onChangeCurrentWindow,
  onChangeProgress,
  onChangeTime,
} = hubspotSlice.actions;

export default hubspotSlice.reducer;
