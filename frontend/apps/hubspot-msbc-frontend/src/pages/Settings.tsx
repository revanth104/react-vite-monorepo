import React, { useEffect } from "react";
import {
  Tab,
  Tabs,
  Container,
  OverlayTrigger,
  Tooltip,
  Button,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import sparkle from "../assets/sparkle.png";

import {
  onChangeSettingsTabKey,
  clearDefaultValues,
  AutoSaveModal,
  fetchStatus,
  setShowSuccessModal,
  setShowErrorModal,
  GuideTour,
  updateShowSettingsTour,
  updateSettingsStoredKey,
  MeetingButton,
} from "@cloudify/generic";
import {
  fetchHubSpotFields,
  updateHubspotUserIds,
  ReInstallAlert,
  Loading,
} from "@cloudify/hubspot-frontend";
import {
  saveContactDefaultMappings,
  fetchMsbcFields,
  getDefaultMappingFields,
} from "@cloudify/msbc-frontend";
import {
  CmsEditAndSave,
  fetchCmsData,
  onChangeIsUserAllowed,
  CmsRichText,
} from "@cloudify/cms";

import Contact from "../components/settings/contact/Contact";
import Product from "../components/settings/product/Product";
import Invoice from "../components/settings/invoice/Invoice";

import { IPreferenceSlice } from "@cloudify/generic/src/types/preferenceTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { IMsbcSlice } from "@cloudify/msbc-frontend/src/types/msbcTypes";
import { IContactSlice } from "@cloudify/generic/src/types/contactTypes";
import { IMappingSlice } from "@cloudify/generic/src/types/mappingTypes";
import { IInvoiceSlice } from "@cloudify/generic/src/types/invoiceTypes";
import { IProductSlice } from "@cloudify/generic/src/types/productTypes";
import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";
import { ISubscriptionSlice } from "@cloudify/generic/src/types/subscriptionTypes";

const Settings = () => {
  const {
    settingsActiveTab,
    isAppConnected,
    guidedTourSteps,
    settingsStoredKey,
    showSettingsTour,
  } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const { isContactSyncRulesSaved } = useSelector(
    (state: { contact: IContactSlice }) => state.contact
  );
  const {
    isContactDefaultMappingsSaved,
    defaultMappings,
    fields: { loading: msbcLoading, data: msbcFields },
  } = useSelector((state: { msbc: IMsbcSlice }) => state.msbc);
  const { isMappingSaved } = useSelector(
    (state: { mappings: IMappingSlice }) => state.mappings
  );
  const { isInvoiceSyncRulesSaved } = useSelector(
    (state: { invoice: IInvoiceSlice }) => state.invoice
  );
  const { isProductSyncRulesSaved } = useSelector(
    (state: { products: IProductSlice }) => state.products
  );

  const {
    hubspotUserIds,
    fields: { loading: hubspotLoading },
  } = useSelector((state: { hubspot: IHubspotSlice }) => state.hubspot);
  const {
    allowedUsers,
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  const {
    subscription: { planData },
  } = useSelector(
    (state: { subscription: ISubscriptionSlice }) => state.subscription
  );

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const accordionFor = {
    customerSync: true,
    invoiceSync: true,
    products: false,
    productFields: false,
  };

  const actionAppKeys = ["customer", "invoice"];

  const renderTooltip = (content: string) => (
    <Tooltip style={{ fontSize: "12px" }}>{content}</Tooltip>
  );

  useEffect(() => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (portalId) {
      dispatch(updateHubspotUserIds({ portalId, userId }));
    }
  }, []);

  useEffect(() => {
    dispatch(fetchCmsData());
  }, []);

  useEffect(() => {
    if (allowedUsers.length > 0) {
      dispatch(onChangeIsUserAllowed({ userId: hubspotUserIds.userId }));
    }
  }, [allowedUsers]);

  useEffect(() => {
    if (hubspotUserIds && Object.keys(hubspotUserIds).length > 0) {
      dispatch(
        fetchStatus({
          userIds: hubspotUserIds,
          accordionFor,
          fields: msbcFields,
          fieldKeys: actionAppKeys,
          triggerAppName: "HubSpot",
        })
      );
      dispatch(fetchHubSpotFields({ userIds: hubspotUserIds }));
    }
  }, [hubspotUserIds, msbcFields]);

  useEffect(() => {
    if (
      hubspotUserIds &&
      Object.keys(hubspotUserIds).length > 0 &&
      isAppConnected
    ) {
      dispatch(fetchMsbcFields({ userIds: hubspotUserIds }));
      dispatch(getDefaultMappingFields({ userIds: hubspotUserIds }));
    }
  }, [isAppConnected, hubspotUserIds]);

  const searchFilterOptionKeys = ["companies", "contacts"];

  const installUrl = () => {
    let environment;
    if (
      window.location.origin.includes("develop") ||
      window.location.origin.includes("localhost")
    ) {
      environment = "dev.pm";
    } else {
      environment = "pm";
    }
    return `https://${environment}.cloudify.biz/hubspot-msbc/redirect`;
  };

  const renderButton = () => {
    const showTourGuide = localStorage.getItem(settingsStoredKey);

    if (showTourGuide === "true")
      return (
        <OverlayTrigger
          placement="left"
          overlay={<Tooltip>Show guide</Tooltip>}
        >
          <Button
            className="floating-button"
            onClick={() => {
              const key = settingsStoredKey;
              localStorage.setItem(settingsStoredKey, "false");
              dispatch(updateSettingsStoredKey({ key: "" }));
              dispatch(updateSettingsStoredKey({ key }));
              dispatch(updateShowSettingsTour({ value: false }));
            }}
          >
            <img src={sparkle} alt="guide logo" className="sparkle-img" />
          </Button>
        </OverlayTrigger>
      );
  };
  const triggerKeys: string[] = ["deals"];
  return (
    <>
      <AutoSaveModal
        actionAppName="Business Central"
        triggerAppName="HubSpot"
        userIds={hubspotUserIds}
        isContactDefaultMappingsSaved={isContactDefaultMappingsSaved}
        defaultMappings={defaultMappings}
        saveContactDefaultMappings={saveContactDefaultMappings}
        CmsRichText={CmsRichText}
        contentCssName="hubspot"
        searchFilterOptionKeys={searchFilterOptionKeys}
        actionAppFields={msbcFields}
        actionAppKeys={actionAppKeys}
        accordionFor={accordionFor}
        triggerKeys={triggerKeys}
      />
      <MeetingButton
        changePlacement={guidedTourSteps.length !== 0 ? false : true}
      />
      <GuideTour
        steps={guidedTourSteps}
        loading={!hubspotLoading && !msbcLoading && !cmsLoading ? true : false}
        storedKey={settingsStoredKey}
        showTour={showSettingsTour}
      />
      {renderButton()}
      <div
        style={{
          background: "#fff",
          minHeight: "100vh",
          paddingBottom: "80px",
        }}
      >
        <div className="d-flex flex-column align-items-center mt-4">
          <CmsEditAndSave
            userIds={hubspotUserIds}
            appSlug="hubspotMsbc-quick-install"
            setShowSuccessModal={setShowSuccessModal}
            setShowErrorModal={setShowErrorModal}
            editNotificationPath={`userId=${searchParams.get(
              "userId"
            )}&appSlug=hubspotMsbc-quick-install`}
          />
        </div>
        <Container>
          {cmsLoading ? (
            <Loading />
          ) : (
            <>
              <div className="d-flex flex-row justify-content-center align-items-center">
                <ReInstallAlert installUrl={installUrl()} />
              </div>
              <div className="sync-settings-tabs">
                <Tabs
                  defaultActiveKey="contact"
                  activeKey={settingsActiveTab}
                  onSelect={(selectedKey) => {
                    dispatch(clearDefaultValues());
                    dispatch(
                      onChangeSettingsTabKey({
                        selectedTab: selectedKey,
                        setupLoading: false,
                        isContactSyncRulesSaved,
                        isContactDefaultMappingsSaved,
                        isInvoiceSyncRulesSaved,
                        isProductSyncRulesSaved,
                        isContactMappingsSaved: isMappingSaved?.customerSync,
                        isInvoiceMappingsSaved: isMappingSaved?.invoiceSync,
                        isProductFieldMappingsSaved:
                          isMappingSaved?.productFields,
                        isAppConnected,
                      })
                    );
                  }}
                  style={{
                    top: "0px",
                    paddingTop: "20px",
                  }}
                  className={`${
                    settingsActiveTab === "contact"
                      ? "border-right"
                      : "border-left"
                  }`}
                >
                  <Tab eventKey="contact" title="Customer">
                    <Contact />
                  </Tab>
                  {planData.plan === "basic" ? (
                    <Tab
                      title={
                        <OverlayTrigger
                          placement="top"
                          overlay={renderTooltip(
                            "These sync is not available in the Basic plan, please upgrade to the Premium plan."
                          )}
                        >
                          <span>Products</span>
                        </OverlayTrigger>
                      }
                    ></Tab>
                  ) : (
                    <Tab eventKey="product" title="Products">
                      <Product />
                    </Tab>
                  )}
                  {planData.plan === "basic" ? (
                    <Tab
                      title={
                        <OverlayTrigger
                          placement="top"
                          overlay={renderTooltip(
                            "These sync is not available in the Basic plan, please upgrade to the Premium plan."
                          )}
                        >
                          <span>Invoices/Orders</span>
                        </OverlayTrigger>
                      }
                    ></Tab>
                  ) : (
                    <Tab eventKey="invoice" title="Invoice/Orders">
                      <Invoice />
                    </Tab>
                  )}
                </Tabs>
              </div>
            </>
          )}
        </Container>
      </div>
    </>
  );
};

export default Settings;
