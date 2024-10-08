import { configureStore } from "@reduxjs/toolkit";

import { cmsSlice } from "@cloudify/cms";
import {
  cvrMappingSlice,
  preferenceSlice,
  searchWindowSlice,
} from "@cloudify/cvr-frontend";

const store = configureStore({
  reducer: {
    cms: cmsSlice,
    cvrMapping: cvrMappingSlice,
    preference: preferenceSlice,
    searchWindow: searchWindowSlice,
  },
});

export default store;
