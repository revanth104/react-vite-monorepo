import { configureStore } from "@reduxjs/toolkit";

import { hubspotSlice } from "@cloudify/hubspot-frontend";
import {
  mappingSlice,
  contactSlice,
  productSlice,
  subscriptionSlice,
  preferenceSlice,
  invoiceSlice,
  financialSlice,
} from "@cloudify/generic";
import { fortnoxSlice } from "@cloudify/fortnox-frontend";
import { cmsSlice } from "@cloudify/cms";

const store = configureStore({
  reducer: {
    mappings: mappingSlice,
    contact: contactSlice,
    products: productSlice,
    fortnox: fortnoxSlice,
    hubspot: hubspotSlice,
    invoice: invoiceSlice,
    subscription: subscriptionSlice,
    preference: preferenceSlice,
    cms: cmsSlice,
    financial: financialSlice,
  },
});

export default store;
