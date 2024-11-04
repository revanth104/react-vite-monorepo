import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";

import { Loading } from "@cloudify/hubspot-frontend";
import {
  CompanySearch,
  HandlingCustomerNumber,
  CustomerNumber,
  ButtonWithTooltip,
} from "@cloudify/generic";
import { CmsRichText } from "@cloudify/cms";

import { IFortnoxSlice } from "@cloudify/fortnox-frontend/src/types/fortnoxTypes";
import {
  IHubspotSlice,
  IFieldItem,
} from "@cloudify/hubspot-frontend/src/types/types";
import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";

const ContactSyncRules = () => {
  const customerNumberFields: { title: string; value: string }[] = [
    {
      title: "Let Fortnox create customer number",
      value: "action",
    },
    {
      title: "Take customer number from HubSpot",
      value: "trigger",
    },
  ];

  const fortnoxCustomerNumberPreference: { [k: string]: string } = {
    name: "Customer Number",
    value: "customerNumber",
  };

  const actionAppCustomerNumberFields: IFieldItem[] = [
    {
      CRF: "customerNumber",
      HRF: "Customer Number",
      type: "string",
      description: "",
    },
  ];

  const {
    fields: {
      loading: fortnoxLoading,
      data: { customerSearchFields },
    },
  } = useSelector((state: { fortnox: IFortnoxSlice }) => state.fortnox);

  const {
    hubspotUserIds,
    loading: hubspotLoading,
    fields: {
      data: { companiesSearchFields, contactSearchFields, companies, contacts },
    },
    missingScope,
  } = useSelector((state: { hubspot: IHubspotSlice }) => state.hubspot);

  const {
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  const searchFilterOptionKeys = ["companies", "contacts"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container className="px-0">
      {cmsLoading || hubspotLoading || fortnoxLoading ? (
        <Loading />
      ) : (
        <>
          <CompanySearch
            triggerAppLabel="HubSpot"
            actionAppLabel="Fortnox"
            triggerAppCompanySearchFields={companiesSearchFields}
            triggerAppContactSearchFields={contactSearchFields}
            actionAppCustomerSearchFields={customerSearchFields}
            dropdownClassName="settings-dropdown"
            cardClassName="sync-settings-card"
            CmsRichText={CmsRichText}
            missingScope={missingScope}
          />
          <HandlingCustomerNumber
            customerNumberFields={customerNumberFields}
            CmsRichText={CmsRichText}
            cardClassName="sync-settings-card"
            cmsClassName="hubspot"
          />
          <CustomerNumber
            actionAppCustomerFields={actionAppCustomerNumberFields}
            actionAppName="Fortnox"
            triggerAppName="HubSpot"
            dropdownClassName="settings-dropdown"
            cardClassName="sync-settings-card"
            triggerAppCompanyFields={companies}
            triggerAppContactFields={contacts}
            actionAppCustomerNumberPreference={fortnoxCustomerNumberPreference}
            cssName="settings-dropdown"
            isDisabled={true}
            CmsRichText={CmsRichText}
          />
          <ButtonWithTooltip
            triggerAppName="HubSpot"
            actionAppName="Fortnox"
            savePreferencesFor="customerSyncRules"
            preferenceType="customerSync"
            userIds={hubspotUserIds}
            disableBtnCssName="hb-disabled-btn"
            btnCssName="hb-save-changes-btn"
            searchFilterOptionKeys={searchFilterOptionKeys}
          />
        </>
      )}
    </Container>
  );
};

export default ContactSyncRules;
