import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import {
  InvoiceSync,
  ButtonWithTooltip,
  fetchPipelines,
  fetchDealStages,
} from "@cloudify/generic";
import { CmsRichText } from "@cloudify/cms";

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

  const triggerKeys = ["deals"];

  const dropdownForInvoice: { title: string; value: string }[] = [
    {
      title: "Create draft invoice",
      value: "invoice",
    },
    {
      title: "Create draft order",
      value: "order",
    },
  ];

  useEffect(() => {
    if (hubspotUserIds && Object.keys(hubspotUserIds).length > 0) {
      dispatch(fetchPipelines({ userIds: hubspotUserIds }));
    }
  }, [hubspotUserIds]);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container className="px-0">
      <Row>
        <Col>
          <InvoiceSync
            CmsRichText={CmsRichText}
            cardCssName="sync-settings-card"
            dropdownCssName="settings-dropdown"
            triggerAppName="HubSpot"
            dropdownForInvoice={dropdownForInvoice}
            dropdownForInvoiceLabel="Invoice/Order"
          />
          <ButtonWithTooltip
            actionAppName="Fortnox"
            triggerAppName="HubSpot"
            savePreferencesFor="invoiceSyncRules"
            userIds={hubspotUserIds}
            disableBtnCssName="hb-disabled-btn"
            btnCssName="hb-save-changes-btn"
            triggerKeys={triggerKeys}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default InvoiceSyncRules;
