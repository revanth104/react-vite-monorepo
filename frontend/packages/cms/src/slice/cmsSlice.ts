import { createSlice, createAsyncThunk, Slice } from "@reduxjs/toolkit";

import axios from "axios";
import { getCmsUrl } from "../helpers/url.js";
import { ICmsData } from "../types/cmsTypes.js";

const initialState: ICmsData = {
  cmsData: {
    loading: true,
    data: {
      allowedUsers: [],
      cmsContent: {},
    },
    currentRequestId: null,
    error: "",
  },
  allowedUsers: [],
  isAllowedUser: false,
  isEdit: false,
};

export const fetchCmsData = createAsyncThunk("cms/fetchCmsData", async () => {
  try {
    const { data: response } = await axios.get(
      getCmsUrl("VITE_GET_CMS_CONTENT")
    );
    return response;
  } catch (error) {
    console.log(error);
    return error;
    throw error;
  }
});

export const cmsSlice: Slice<ICmsData> = createSlice({
  name: "cms",
  initialState,
  reducers: {
    onChangeCmsData(state, { payload }) {
      const { path, editedValue } = payload;

      const properties = path.split(".");
      let current = state.cmsData.data;
      for (let i = 0; i < properties.length - 1; i++) {
        const property = properties[i];
        current = current[property as keyof ICmsData["cmsData"]["data"]];
      }
      const lastProperty = properties[properties.length - 1];
      current[lastProperty as keyof ICmsData["cmsData"]["data"]] = editedValue;
    },
    onChangeIsAllowedUser(state, { payload }) {
      state.isAllowedUser = payload.isAllowedUser;
    },
    onChangeIsEdit(state, { payload }) {
      state.isEdit = payload.isEdit;
    },
    onChangeIsUserAllowed(state, { payload }) {
      for (const user of state.allowedUsers) {
        if (user && user.userId === payload?.userId?.toString()) {
          state.isAllowedUser = true;
          break;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCmsData.pending, (state, action) => {
      if (state.cmsData.loading) {
        state.cmsData.loading = true;
        state.cmsData.currentRequestId = action.meta.requestId;
      }
    });
    builder.addCase(fetchCmsData.fulfilled, (state, action) => {
      if (
        state.cmsData.currentRequestId === action.meta.requestId &&
        state.cmsData.loading
      ) {
        state.cmsData.loading = false;
        state.cmsData.data = action.payload;
        state.cmsData.error = "";
        state.cmsData.currentRequestId = null;

        if (action.payload.allowedUsers.length > 0) {
          state.allowedUsers = action.payload.allowedUsers;
        }
      }
    });
    builder.addCase(fetchCmsData.rejected, (state, action) => {
      if (
        state.cmsData.currentRequestId === action.meta.requestId &&
        state.cmsData.loading
      ) {
        state.cmsData.loading = false;
        state.cmsData.data = { allowedUsers: [], cmsContent: {} };
        state.cmsData.error = action.error.message ?? "";
        state.cmsData.currentRequestId = null;
      }
    });
  },
});

export const {
  onChangeCmsData,
  onChangeIsAllowedUser,
  onChangeIsEdit,
  onChangeIsUserAllowed,
} = cmsSlice.actions;

export default cmsSlice.reducer;
