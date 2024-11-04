import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import { getUrl } from "../helpers/url";

import {
  onChangeProgress,
  onChangeCurrentWindow,
  Loading,
  HbNavbar,
  fetchHubSpotFields,
  updateHubspotUserIds,
} from "@cloudify/hubspot-frontend";
import { fetchFortnoxFields } from "@cloudify/fortnox-frontend";
import {
  setShowErrorModal,
  setShowSuccessModal,
  fetchPipelines,
  GuideTour,
  updateGuideSteps,
  updateSettingsStoredKey,
  updateShowSettingsTour,
} from "@cloudify/generic";
import {
  fetchCmsData,
  onChangeIsUserAllowed,
  CmsEditAndSave,
} from "@cloudify/cms";

import {
  invoiceSyncRules as invoiceSteps,
  contactSyncSteps,
  productSyncNormalSteps,
  productSyncAdvancedSteps,
  connectSteps,
  introSteps,
} from "../helpers/steps/install";

import IntroPage from "./IntroPage";
import Connect from "./Connect";
import SyncRules from "./SyncRules";
import Subscription from "./Subscription";
import ConformationPage from "./ConfirmationPage";

import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";
import { IPreferenceSlice } from "@cloudify/generic/src/types/preferenceTypes";
import { IInvoiceSlice } from "@cloudify/generic/src/types/invoiceTypes";
import { IContactSlice } from "@cloudify/generic/src/types/contactTypes";
import { IProductSlice } from "@cloudify/generic/src/types/productTypes";
import { IFortnoxSlice } from "@cloudify/fortnox-frontend/src/types/fortnoxTypes";

import hsLogo from "./../assets/hs-eco-logo 3.svg";
import sparkle from "../assets/sparkle.png";

const WINDOW = Object.freeze({
  INTRO_WINDOW: "Intro Window",
  CONNECT_WINDOW: "Connect Window",
  SYNC_WINDOW: "Sync Window",
  SUBSCRIPTION_WINDOW: "Subscription Window",
  CONFIRMATION_WINDOW: "Confirmation Window",
});

const windowsObject = {
  [WINDOW.INTRO_WINDOW]: <IntroPage />,
  [WINDOW.CONNECT_WINDOW]: <Connect />,
  [WINDOW.SYNC_WINDOW]: <SyncRules />,
  [WINDOW.SUBSCRIPTION_WINDOW]: <Subscription />,
  [WINDOW.CONFIRMATION_WINDOW]: <ConformationPage />,
};

const Setup = () => {
  const {
    currentWindow,
    hubspotUserIds,
    fields: { loading: hubspotLoading },
  } = useSelector((state: { hubspot: IHubspotSlice }) => state.hubspot);

  const {
    fields: { loading: fortnoxLoading },
  } = useSelector((state: { fortnox: IFortnoxSlice }) => state.fortnox);

  const {
    allowedUsers,
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  const {
    isAppConnected,
    guidedTourSteps,
    settingsStoredKey,
    showSettingsTour,
  } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const { isContactCheckbox, isContactSyncRulesSaved } = useSelector(
    (state: { contact: IContactSlice }) => state.contact
  );

  const { advancedSettingStatus } = useSelector(
    (state: { products: IProductSlice }) => state.products
  );

  const {
    pipelinePreference,
    dealStagePreference,
    invoicePreference,
    pipelines: { pipelines },
  } = useSelector((state: { invoice: IInvoiceSlice }) => state.invoice);

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  let page = searchParams.get("page");
  page = page ? page : "introPage";

  const install = async () => {
    try {
      const code = searchParams.get("code");
      const page = searchParams.get("page");
      const portalId = searchParams.get("portalId");
      const userId = searchParams.get("userId");
      const paymentStatus = searchParams.get("paymentStatus");
      if (code) {
        setIsLoading(true);
        const { data: res } = await axios.get(getUrl("VITE_INSTALL_URL"), {
          params: {
            code,
          },
        });

        dispatch(onChangeCurrentWindow({ currentWindow: "Intro Window" }));
        navigate(`../setup?portalId=${res.portalId}&userId=${res.userId}`);
      } else if (portalId && userId && page === "connectPage") {
        dispatch(onChangeCurrentWindow({ currentWindow: "Connect Window" }));
      } else if (
        portalId &&
        userId &&
        (page === "invoiceSyncRules" ||
          page === "customerSearchRules" ||
          page === "productSyncRules")
      ) {
        dispatch(onChangeCurrentWindow({ currentWindow: "Sync Window" }));
        if (page === "invoiceSyncRules") {
          dispatch(
            onChangeProgress({
              "Invoice Sync Rules": true,
            })
          );
        } else if (page === "customerSearchRules") {
          dispatch(
            onChangeProgress({
              "Invoice Sync Rules": true,
              "Customer Preferences": true,
            })
          );
        } else if (page === "productSyncRules") {
          dispatch(
            onChangeProgress({
              "Invoice Sync Rules": true,
              "Customer Preferences": true,
              "Product Sync Rules": true,
            })
          );
        }
      } else if (portalId && userId && page === "confirmationPage") {
        dispatch(
          onChangeCurrentWindow({ currentWindow: "Confirmation Window" })
        );
      } else if (
        portalId &&
        userId &&
        (page === "subscriptionPage" || paymentStatus)
      ) {
        dispatch(
          onChangeCurrentWindow({ currentWindow: "Subscription Window" })
        );
      } else if (portalId && userId) {
        dispatch(onChangeCurrentWindow({ currentWindow: "Intro Window" }));
      }
    } catch (error) {
      console.log(error);
      let errorMessage;
      if (error instanceof Error) errorMessage = error.message;
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data.message
      )
        errorMessage = error.response.data.message;
      dispatch(
        setShowErrorModal({
          message: errorMessage,
        })
      );
    } finally {
      setIsLoading(false);
    }
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

  useEffect(() => {
    if (page) {
      dispatch(updateSettingsStoredKey({ key: `hs_fortonx_install_${page}` }));
    }
  }, [page]);

  useEffect(() => {
    if (page) {
      const isTourGuide = localStorage.getItem(settingsStoredKey);
      console.log(isTourGuide);
      !isTourGuide || isTourGuide === "false"
        ? dispatch(updateShowSettingsTour({ value: false }))
        : dispatch(updateShowSettingsTour({ value: true }));
    }
  }, [page, settingsStoredKey]);

  useEffect(() => {
    install();
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
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (portalId && currentWindow !== "Intro Window") {
      dispatch(updateHubspotUserIds({ portalId, userId }));
    }
  }, []);

  useEffect(() => {
    if (
      hubspotUserIds &&
      Object.keys(hubspotUserIds).length > 0 &&
      currentWindow !== "Intro Window"
    ) {
      dispatch(fetchHubSpotFields({ userIds: hubspotUserIds }));
      dispatch(fetchPipelines({ userIds: hubspotUserIds }));
    }
  }, [hubspotUserIds]);

  useEffect(() => {
    if (
      hubspotUserIds &&
      Object.keys(hubspotUserIds).length > 0 &&
      isAppConnected &&
      currentWindow !== "Intro Window"
    ) {
      dispatch(
        fetchFortnoxFields({ userIds: hubspotUserIds, setShowErrorModal })
      );
    }
  }, [hubspotUserIds, isAppConnected]);

  useEffect(() => {
    if (page === "connectPage") {
      isAppConnected
        ? dispatch(updateGuideSteps({ steps: [] }))
        : dispatch(updateGuideSteps({ steps: connectSteps }));
    } else if (page === "introPage") {
      dispatch(updateGuideSteps({ steps: introSteps }));
    } else if (page === "subscriptionPage") {
      dispatch(updateGuideSteps({ steps: [] }));
    }
  }, [page, isAppConnected]);

  useEffect(() => {
    if (page === "invoiceSyncRules") {
      dispatch(updateGuideSteps({ steps: invoiceSteps.slice(0, 2) }));
      console.log(invoiceSteps.slice(0, 2));
      if (pipelinePreference && dealStagePreference && invoicePreference) {
        dispatch(
          updateSettingsStoredKey({ key: `hs_fortnox_install_${page}_btns` })
        );
        dispatch(
          updateGuideSteps({
            steps: invoiceSteps.slice(-2),
          })
        );
      }

      if (pipelinePreference && !dealStagePreference) {
        dispatch(
          updateSettingsStoredKey({
            key: `hs_fortnox_install_${page}_dealStage`,
          })
        );
        dispatch(
          updateGuideSteps({
            steps: [invoiceSteps[2]],
          })
        );
      }

      if (pipelinePreference && dealStagePreference && !invoicePreference) {
        dispatch(
          updateSettingsStoredKey({
            key: `hs_fortnox_install_${page}_generate`,
          })
        );
        dispatch(
          updateGuideSteps({
            steps: [invoiceSteps[3]],
          })
        );
      }
    }
  }, [
    page,
    pipelinePreference,
    dealStagePreference,
    invoicePreference,
    pipelines,
  ]);

  useEffect(() => {
    if (page === "customerSearchRules") {
      if (isContactCheckbox && isContactSyncRulesSaved) {
        dispatch(updateGuideSteps({ steps: contactSyncSteps }));
      } else {
        dispatch(
          updateSettingsStoredKey({ key: `hs_fortnox_install_${page}_company` })
        );
        dispatch(updateGuideSteps({ steps: contactSyncSteps.slice(0, 3) }));
      }

      if (isContactCheckbox && !isContactSyncRulesSaved) {
        dispatch(
          updateSettingsStoredKey({ key: `hs_fortnox_install_${page}_contact` })
        );
        dispatch(updateGuideSteps({ steps: contactSyncSteps.slice(-1) }));
      }
    }
  }, [page, isContactCheckbox]);

  useEffect(() => {
    if (page === "productSyncRules") {
      dispatch(updateGuideSteps({ steps: productSyncNormalSteps }));
    }
  }, [page]);

  useEffect(() => {
    if (page === "productSyncRules" && advancedSettingStatus) {
      dispatch(
        updateSettingsStoredKey({ key: `hs_fortnox_install_${page}_advanced` })
      );
      dispatch(updateGuideSteps({ steps: productSyncAdvancedSteps }));
    } else if (page === "productSyncRules" && !advancedSettingStatus) {
      dispatch(updateSettingsStoredKey({ key: `hs_fortnox_install_${page}` }));
      dispatch(updateGuideSteps({ steps: productSyncNormalSteps }));
    }
  }, [page, advancedSettingStatus]);

  return (
    <div className="install-flow-bg">
      <HbNavbar logo={hsLogo} altText="Fortnox sync" text="Fortnox sync" />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <GuideTour
            steps={guidedTourSteps}
            loading={
              !cmsLoading && !hubspotLoading && !fortnoxLoading && !isLoading
                ? true
                : false
            }
            showTour={showSettingsTour}
            storedKey={settingsStoredKey}
          />
          {renderButton()}
          <div className="d-flex flex-column align-items-center my-5">
            <CmsEditAndSave
              userIds={hubspotUserIds}
              appSlug="hubspotFortnox-quick-install"
              setShowErrorModal={setShowErrorModal}
              setShowSuccessModal={setShowSuccessModal}
              editNotificationPath={`userId=${searchParams.get(
                "userId"
              )}&appSlug=hubspotFortnox-quick-install`}
            />
          </div>
          <div style={{ padding: "0 0 80px 0" }}>
            {windowsObject[currentWindow as keyof typeof windowsObject]}
          </div>
        </>
      )}
    </div>
  );
};

export default Setup;
