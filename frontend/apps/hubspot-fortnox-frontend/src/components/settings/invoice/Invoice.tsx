import React, { useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import InvoiceSyncRules from "./InvoiceSyncRules";
import { useSelector, useDispatch } from "react-redux";
import InvoiceFieldMappings from "./InvoiceFieldMappings";

import {
  onChangeInvoiceActiveTab,
  clearDefaultValues,
  updateGuideSteps,
  updateSettingsStoredKey,
  updateShowSettingsTour,
} from "@cloudify/generic";

import { IMappingSlice } from "@cloudify/generic/src/types/mappingTypes";
import { IInvoiceSlice } from "@cloudify/generic/src/types/invoiceTypes";
import { IPreferenceSlice } from "@cloudify/generic/src/types/preferenceTypes";

import { invoiceSyncRulesSteps } from "../../../helpers/steps/settings";

const Invoice = () => {
  const {
    isInvoiceSyncRulesSaved,
    pipelinePreference,
    dealStagePreference,
    invoicePreference,
  } = useSelector((state: { invoice: IInvoiceSlice }) => state.invoice);

  const {
    isAppConnected,
    invoiceActiveTab,
    settingsActiveTab,
    settingsStoredKey,
  } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const {
    isMappingSaved,
    mapping: { loading: statusLoading },
  } = useSelector((state: { mappings: IMappingSlice }) => state.mappings);

  const dispatch = useDispatch();

  useEffect(() => {
    // Updates the settings stored key
    if (settingsActiveTab === "invoice" && invoiceActiveTab) {
      dispatch(
        updateSettingsStoredKey({
          key: `hs_fortnox_settings_${settingsActiveTab}_${invoiceActiveTab}`,
        })
      );
    }
  }, [invoiceActiveTab, settingsActiveTab]);

  useEffect(() => {
    // Enables or disables tour guide
    if (settingsActiveTab === "invoice" && invoiceActiveTab) {
      const isTourGuide = localStorage.getItem(settingsActiveTab);

      !isTourGuide || isTourGuide === "false"
        ? dispatch(updateShowSettingsTour({ value: false }))
        : dispatch(updateShowSettingsTour({ value: true }));
    }
  }, [
    invoiceActiveTab,
    settingsStoredKey,
    pipelinePreference,
    dealStagePreference,
    invoicePreference,
  ]);

  useEffect(() => {
    // Updates the guide steps
    if (settingsActiveTab === "invoice") {
      if (invoiceActiveTab === "syncRules") {
        dispatch(
          updateGuideSteps({
            steps: invoiceSyncRulesSteps.slice(0, 2),
          })
        );

        if (pipelinePreference && dealStagePreference && invoicePreference) {
          dispatch(
            updateSettingsStoredKey({
              key: `hs_fortnox_settings_${settingsActiveTab}_${invoiceActiveTab}_btns`,
            })
          );
          dispatch(
            updateGuideSteps({
              steps: invoiceSyncRulesSteps.slice(-3),
            })
          );
        }

        if (pipelinePreference && !dealStagePreference) {
          dispatch(
            updateSettingsStoredKey({
              key: `hs_fortnox_settings_${settingsActiveTab}_${invoiceActiveTab}_dealStage`,
            })
          );

          dispatch(
            updateGuideSteps({
              steps: [invoiceSyncRulesSteps[2]],
            })
          );
        }

        if (pipelinePreference && dealStagePreference && !invoicePreference) {
          dispatch(
            updateSettingsStoredKey({
              key: `hs_fortnox_settings_${settingsActiveTab}_${invoiceActiveTab}_generate`,
            })
          );
          dispatch(
            updateGuideSteps({
              steps: [invoiceSyncRulesSteps[3]],
            })
          );
        }
      } else {
        dispatch(updateGuideSteps({ steps: [] }));
      }
    }
  }, [
    invoiceActiveTab,
    settingsActiveTab,
    pipelinePreference,
    dealStagePreference,
    invoicePreference,
  ]);

  return (
    <div className="mt-2 settings-nested-tabs">
      <Tabs
        style={{ top: "69px" }}
        activeKey={invoiceActiveTab}
        defaultActiveKey="syncRules"
        onSelect={(selectedKey) => {
          dispatch(clearDefaultValues());
          dispatch(
            onChangeInvoiceActiveTab({
              selectedTab: selectedKey,
              isAppConnected,
              isInvoiceSyncRulesSaved,
              isInvoiceMappingsSaved: isMappingSaved?.invoiceSync,
              setupLoading: statusLoading,
            })
          );
          window.scrollTo(0, 0);
        }}
      >
        <Tab
          eventKey="syncRules"
          title={
            <span className="invoice-sync-rules-tab">
              Invoice/Order sync rules
            </span>
          }
        >
          <InvoiceSyncRules />
        </Tab>
        <Tab eventKey="fieldMappings" title="Invoice/Order field mappings">
          <InvoiceFieldMappings />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Invoice;
