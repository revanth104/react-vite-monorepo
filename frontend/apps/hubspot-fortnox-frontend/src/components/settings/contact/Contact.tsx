import React, { useEffect } from "react";
import { Tab, Tabs, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import ContactSyncRules from "./ContactSyncRules";
import ContactDefaultMappings from "./ContactDefaultMappings";
import ContactFieldMappings from "./ContactFieldMappings";
import CompanyFieldMappings from "./CompanyFieldMappings";

import {
  onChangeContactActiveTab,
  clearDefaultValues,
  updateGuideSteps,
  updateSettingsStoredKey,
  updateShowSettingsTour,
} from "@cloudify/generic";

import { IPreferenceSlice } from "@cloudify/generic/src/types/preferenceTypes";
import { IContactSlice } from "@cloudify/generic/src/types/contactTypes";
import { IFortnoxSlice } from "@cloudify/fortnox-frontend/src/types/fortnoxTypes";
import { IMappingSlice } from "@cloudify/generic/src/types/mappingTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";

import {
  contactSyncRulesSteps,
  contactDefaultMappingsSteps,
} from "../../../helpers/steps/settings";

const Contact = () => {
  const dispatch = useDispatch();
  const { missingScope } = useSelector(
    (state: { hubspot: IHubspotSlice }) => state.hubspot
  );
  const {
    isAppConnected,
    contactActiveTab,
    settingsActiveTab,
    settingsStoredKey,
  } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );
  const {
    isContactSyncRulesSaved,
    isContactCheckbox,
    customerNumberPreference,
  } = useSelector((state: { contact: IContactSlice }) => state.contact);
  const { isContactDefaultMappingsSaved } = useSelector(
    (state: { fortnox: IFortnoxSlice }) => state.fortnox
  );
  const {
    isMappingSaved,
    mapping: { loading: statusLoading },
  } = useSelector((state: { mappings: IMappingSlice }) => state.mappings);

  const contactSyncRulesGuide = [...contactSyncRulesSteps];
  if (customerNumberPreference.value === "action") {
    contactSyncRulesGuide.pop();
  } else if (customerNumberPreference.value === "trigger") {
    contactSyncRulesGuide.splice(-2, 1);
  }

  const renderTooltipText = () => {
    let text;
    if (missingScope) {
      text =
        "In order to use the contact field mappings please reinstall the application.";
    } else if (!isContactCheckbox) {
      text =
        "Contact field mappings only applicable when contact sync option is selected.";
    }
    return text;
  };

  useEffect(() => {
    // Updates the settings stored key
    if (settingsActiveTab === "contact" && contactActiveTab) {
      dispatch(
        updateSettingsStoredKey({
          key: `hs_fortnox_settings_${settingsActiveTab}_${contactActiveTab}`,
        })
      );
    }
  }, [contactActiveTab, settingsActiveTab]);

  useEffect(() => {
    // Enables or disables tour guide
    if (settingsActiveTab === "contact" && contactActiveTab) {
      const isTourGuide = localStorage.getItem(settingsActiveTab);

      !isTourGuide || isTourGuide === "false"
        ? dispatch(updateShowSettingsTour({ value: false }))
        : dispatch(updateShowSettingsTour({ value: true }));
    }
  }, [contactActiveTab, settingsStoredKey]);

  useEffect(() => {
    // Updates the guide steps
    if (settingsActiveTab === "contact") {
      if (contactActiveTab === "syncRules") {
        dispatch(updateGuideSteps({ steps: contactSyncRulesGuide }));
      } else if (contactActiveTab === "defaultMappings") {
        dispatch(updateGuideSteps({ steps: contactDefaultMappingsSteps }));
      } else {
        dispatch(updateGuideSteps({ steps: [] }));
      }
    }
  }, [contactActiveTab, settingsActiveTab, customerNumberPreference]);

  return (
    <div className="settings-nested-tabs mt-2">
      <Tabs
        style={{ top: "69px" }}
        defaultActiveKey="syncRules"
        activeKey={contactActiveTab}
        onSelect={(selectedKey) => {
          dispatch(clearDefaultValues());
          dispatch(
            onChangeContactActiveTab({
              selectedTab: selectedKey,
              isAppConnected,
              isContactSyncRulesSaved,
              isContactDefaultMappingsSaved,
              isContactMappingsSaved: isMappingSaved?.customerSync,
              setupLoading: statusLoading,
            })
          );
          window.scrollTo(0, 0);
        }}
      >
        <Tab
          eventKey="syncRules"
          title={
            <span className="customer-sync-rules-tab">Customer sync rules</span>
          }
        >
          <ContactSyncRules />
        </Tab>
        <Tab
          eventKey="defaultMappings"
          title={
            <span className="customer-default-mappings-tab">
              Customer default mappings
            </span>
          }
        >
          <ContactDefaultMappings />
        </Tab>
        <Tab eventKey="companyFieldMappings" title="Company field mappings">
          <CompanyFieldMappings />
        </Tab>
        {isContactCheckbox && !missingScope ? (
          <Tab eventKey="contactFieldMappings" title="Contact field mappings">
            <ContactFieldMappings />
          </Tab>
        ) : (
          <Tab
            title={
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip style={{ fontSize: "12px" }}>
                    {renderTooltipText()}
                  </Tooltip>
                }
              >
                <span>Contact field mappings</span>
              </OverlayTrigger>
            }
          ></Tab>
        )}
      </Tabs>
    </div>
  );
};

export default Contact;
