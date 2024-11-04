import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-bootstrap";

import {
  onChangeContactPreferences,
  onChangeCheckboxForContact,
  SetupDropdown,
} from "@cloudify/generic";
import { CmsRichText } from "@cloudify/cms";

import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { IFortnoxSlice } from "@cloudify/fortnox-frontend/src/types/fortnoxTypes";
import { IContactSlice } from "@cloudify/generic/src/types/contactTypes";

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
  } = useSelector((state: { fortnox: IFortnoxSlice }) => state.fortnox);

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
      <div className="hs-fortnox-company-search-parameters">
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
              dropdownLabel="Fortnox"
              cssName="install-flow-dropdown"
            />
          </div>
        </div>
      </div>
      {!missingScope && (
        <div className="mt-5">
          <div className="hs-fortnox-contact-checkbox">
            <div>
              <CmsRichText
                path="cmsContent.install.customerSearchRules.hubspotContact.title"
                cssName="hubspot"
              />
            </div>
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
            <div className="mt-3 hs-fortnox-contact-search-parameters">
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
                  path="cmsContent.install.customerSearchRules.fortnoxContact.title"
                  cssName="hubspot"
                />
                <CmsRichText
                  path="cmsContent.install.customerSearchRules.fortnoxContact.description"
                  cssName="hubspot"
                />
                <div>
                  <SetupDropdown
                    fieldItems={actionAppCustomerSearchFields}
                    selectedValue={actionAppContactFilterPreference}
                    onChangeValue={onChangeContactPreferences}
                    dropdownFor="actionAppContactFilterField"
                    dropdownLabel="Fortnox"
                    cssName="install-flow-dropdown"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerSearchRules;
