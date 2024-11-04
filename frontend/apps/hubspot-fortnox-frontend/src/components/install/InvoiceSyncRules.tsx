import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AddPipelines } from "@cloudify/hubspot-frontend";
import { CmsRichText } from "@cloudify/cms";
import { fetchDealStages } from "@cloudify/generic";

import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { IInvoiceSlice } from "@cloudify/generic/src/types/invoiceTypes";

const InvoiceSyncRules = () => {
  const dispatch = useDispatch();
  const { hubspotUserIds } = useSelector(
    (state: { hubspot: IHubspotSlice }) => state.hubspot
  );

  const { pipelinePreference } = useSelector(
    (state: { invoice: IInvoiceSlice }) => state.invoice
  );

  const dropdownForInvoice: { title: string; value: string }[] = [
    {
      title: "Create draft invoice",
      value: "invoice",
    },
    {
      title: "Create quote",
      value: "quote",
    },
  ];

  useEffect(() => {
    if (
      hubspotUserIds &&
      Object.keys(hubspotUserIds).length > 0 &&
      pipelinePreference
    ) {
      const pipelineId = pipelinePreference.value;
      dispatch(fetchDealStages({ pipelineId, userIds: hubspotUserIds }));
    }
  }, [pipelinePreference]);

  return (
    <div>
      <CmsRichText
        path="cmsContent.install.invoiceSyncRules.pipeline"
        cssName="hubspot"
      />
      <div className="mb-5 mt-4">
        <AddPipelines
          dropdownForInvoice={dropdownForInvoice}
          dropdownForInvoiceLabel="Order/Invoice"
        />
      </div>
    </div>
  );
};

export default InvoiceSyncRules;
