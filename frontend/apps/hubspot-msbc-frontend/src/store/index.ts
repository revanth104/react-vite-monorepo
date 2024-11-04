import { configureStore } from "@reduxjs/toolkit";

import { hubspotSlice } from "@cloudify/hubspot-frontend";
import { msbcSlice } from "@cloudify/msbc-frontend";
import { cmsSlice } from "@cloudify/cms";
import {
  mappingSlice,
  contactSlice,
  productSlice,
  subscriptionSlice,
  preferenceSlice,
  invoiceSlice,
  financialSlice,
} from "@cloudify/generic";

const store = configureStore({
  reducer: {
    hubspot: hubspotSlice,
    msbc: msbcSlice,
    cms: cmsSlice,
    mappings: mappingSlice,
    contact: contactSlice,
    products: productSlice,
    subscription: subscriptionSlice,
    preference: preferenceSlice,
    invoice: invoiceSlice,
    financial: financialSlice,
  },
});

export default store;
