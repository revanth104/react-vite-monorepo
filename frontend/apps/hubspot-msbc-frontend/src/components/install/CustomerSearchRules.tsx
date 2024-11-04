import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-bootstrap";

import {
  onChangeContactPreferences,
  onChangeCheckboxForContact,
  SetupDropdown,
} from "@cloudify/generic";
import { CmsRichText } from "@cloudify/cms";

// Types
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { IContactSlice } from "@cloudify/generic/src/types/contactTypes";
import { IMsbcSlice } from "@cloudify/msbc-frontend/src/types/msbcTypes";

const CustomerSearchRules = () => {
  const {
    fields: {
      data: {
        companiesSearchFields: triggerAppCompaniesSearchFields,
        contactSearchFields: triggerAppContactsSearchFields,
      },
    },
    missingScope,
  } = useSelector((state: { hubspot: IHubspotSlice }) => state.hubspot);

  const {
    fields: {
      data: { customerSearchFields: actionAppCustomerSearchFields },
    },
  } = useSelector((state: { msbc: IMsbcSlice }) => state.msbc);

  const {
    triggerAppCompanyFilterPreference,
    triggerAppContactFilterPreference,
    actionAppCompanyFilterPreference,
    actionAppContactFilterPreference,
    isContactCheckbox,
  } = useSelector((state: { contact: IContactSlice }) => state.contact);

  const dispatch = useDispatch();

  return (
    <div>
      <CmsRichText
        path="cmsContent.install.customerSearchRules.headerContent"
        cssName="hubspot"
      />
      <div className="install-company-search-parameters">
        <div className="mt-5">
          <CmsRichText
            path="cmsContent.install.customerSearchRules.identifyCustomer.title"
            cssName="hubspot"
          />
          <CmsRichText
            path="cmsContent.install.customerSearchRules.identifyCustomer.description"
            cssName="hubspot"
          />
          <div className="mt-3">
            <SetupDropdown
              fieldItems={triggerAppCompaniesSearchFields}
              selectedValue={triggerAppCompanyFilterPreference}
              onChangeValue={onChangeContactPreferences}
              dropdownFor="triggerAppCompanyFilterField"
              dropdownLabel="HubSpot"
              cssName="install-flow-dropdown"
            />
          </div>
        </div>
        <div className="mt-5">
          <CmsRichText
            path="cmsContent.install.customerSearchRules.connectHubspot.title"
            cssName="hubspot"
          />
          <CmsRichText
            path="cmsContent.install.customerSearchRules.connectHubspot.description"
            cssName="hubspot"
          />
          <div className="mt-3">
            <SetupDropdown
              fieldItems={actionAppCustomerSearchFields}
              selectedValue={actionAppCompanyFilterPreference}
              onChangeValue={onChangeContactPreferences}
              dropdownFor="actionAppCompanyFilterField"
              dropdownLabel="Business central"
              cssName="install-flow-dropdown"
            />
          </div>
        </div>
      </div>
      {!missingScope && (
        <div className="mt-5">
          <div className="install-contact-checkbox">
            <div>
              <CmsRichText
                path="cmsContent.install.customerSearchRules.hubspotContact.title"
                cssName="hubspot"
              />
              <Form.Check
                type="checkbox"
                id="contactSearchParameter"
                label={`Enable Primary Contact Sync`}
                checked={!!isContactCheckbox}
                onChange={() => dispatch(onChangeCheckboxForContact())}
                className="contact-label"
              />
            </div>
            {isContactCheckbox && (
              <div className="mt-3 install-contact-search-parameters">
                <CmsRichText
                  path="cmsContent.install.customerSearchRules.hubspotContact.description"
                  cssName="hubspot"
                />
                <div className="mt-3">
                  <SetupDropdown
                    fieldItems={triggerAppContactsSearchFields}
                    selectedValue={triggerAppContactFilterPreference}
                    onChangeValue={onChangeContactPreferences}
                    dropdownFor="triggerAppContactFilterField"
                    cssName="install-flow-dropdown"
                  />
                </div>
                <div className="mt-5">
                  <CmsRichText
                    path="cmsContent.install.customerSearchRules.msbcContact.title"
                    cssName="hubspot"
                  />
                  <CmsRichText
                    path="cmsContent.install.customerSearchRules.msbcContact.description"
                    cssName="hubspot"
                  />
                  <div>
                    <SetupDropdown
                      fieldItems={actionAppCustomerSearchFields}
                      selectedValue={actionAppContactFilterPreference}
                      onChangeValue={onChangeContactPreferences}
                      dropdownFor="actionAppContactFilterField"
                      dropdownLabel="Business central"
                      cssName="install-flow-dropdown"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSearchRules;
