import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import { getUrl } from "../helpers/url";

import IntroPage from "./IntroPage";
import Connect from "./Connect";
import EnvironmentSelection from "./EnvironmentSelection";
import SyncRules from "./SyncRules";
import ConformationPage from "./ConfirmationPage";
import Subscription from "./Subscription";
import {
  invoiceSyncRules as invoiceSteps,
  contactSyncSteps,
  productSyncNormalSteps,
  productSyncAdvancedSteps,
  connectSteps,
  introSteps,
  environmentSteps,
} from "../helpers/steps/install";

import hsMsbcLogo from "./../assets/hs-eco-logo 3.svg";
import sparkleIcon from "../assets/sparkle.png";

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
  onChangeProgress,
  onChangeCurrentWindow,
  Loading,
  HbNavbar,
  fetchHubSpotFields,
  updateHubspotUserIds,
} from "@cloudify/hubspot-frontend";
import {
  fetchCmsData,
  onChangeIsUserAllowed,
  CmsEditAndSave,
} from "@cloudify/cms";

import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";
import { IPreferenceSlice } from "@cloudify/generic/src/types/preferenceTypes";
import { IInvoiceSlice } from "@cloudify/generic/src/types/invoiceTypes";
import { IContactSlice } from "@cloudify/generic/src/types/contactTypes";
import { IProductSlice } from "@cloudify/generic/src/types/productTypes";
import { IMsbcSlice } from "@cloudify/msbc-frontend/src/types/msbcTypes";

const WINDOW = Object.freeze({
  INTRO_WINDOW: "Intro Window",
  CONNECT_WINDOW: "Connect Window",
  ENV_WINDOW: "Environment Window",
  EXTENSION_WINDOW: "Extension Window",
  SYNC_WINDOW: "Sync Window",
  CONFIRMATION_WINDOW: "Confirmation Window",
  SUBSCRIPTION_WINDOW: "Subscription Window",
});

const windowsObject = {
  [WINDOW.INTRO_WINDOW]: <IntroPage />,
  [WINDOW.CONNECT_WINDOW]: <Connect />,
  [WINDOW.ENV_WINDOW]: <EnvironmentSelection />,
  [WINDOW.SYNC_WINDOW]: <SyncRules />,
  [WINDOW.CONFIRMATION_WINDOW]: <ConformationPage />,
  [WINDOW.SUBSCRIPTION_WINDOW]: <Subscription />,
};

const Setup = () => {
  const {
    currentWindow,
    hubspotUserIds,
    fields: { loading: hubspotLoading },
  } = useSelector((state: { hubspot: IHubspotSlice }) => state.hubspot);
  const {
    allowedUsers,
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  const {
    fields: { loading: msbcLoading },
    environmentPreference,
    companyPreference,
    environment: {
      environmentDetails: { environment },
    },
    company: {
      companyDetails: { companies },
    },
    isEnvPreferencesSaved,
  } = useSelector((state: { msbc: IMsbcSlice }) => state.msbc);

  const {
    isAppConnected,
    guidedTourSteps,
    settingsStoredKey,
    showSettingsTour,
  } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const {
    pipelinePreference,
    dealStagePreference,
    invoicePreference,
    pipelines: { pipelines },
  } = useSelector((state: { invoice: IInvoiceSlice }) => state.invoice);

  const { isContactCheckbox, isContactSyncRulesSaved } = useSelector(
    (state: { contact: IContactSlice }) => state.contact
  );

  const { advancedSettingStatus } = useSelector(
    (state: { products: IProductSlice }) => state.products
  );

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  let page = searchParams.get("page");

  page = page ? page : "introPage";
  const navigate = useNavigate();

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
      } else if (portalId && userId && page === "environmentPage") {
        dispatch(
          onChangeCurrentWindow({ currentWindow: "Environment Window" })
        );
      } else if (
        portalId &&
        userId &&
        (page === "subscriptionPage" || paymentStatus)
      ) {
        dispatch(
          onChangeCurrentWindow({ currentWindow: "Subscription Window" })
        );
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
            <img src={sparkleIcon} alt="guide logo" className="sparkle-img" />
          </Button>
        </OverlayTrigger>
      );
  };

  useEffect(() => {
    // Updates the settings stored key
    if (page) {
      dispatch(updateSettingsStoredKey({ key: `hs_msbc_install_${page}` }));
    }
  }, [page]);

  useEffect(() => {
    // Enables or disables tour guide
    if (page) {
      const isTourGuide = localStorage.getItem(settingsStoredKey);

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
    if (page === "environmentPage") {
      if (environmentPreference && companyPreference && isEnvPreferencesSaved) {
        dispatch(updateSettingsStoredKey({ key: `hs_msbc_install_${page}` }));
        dispatch(updateGuideSteps({ steps: environmentSteps }));
      }
      if (!environmentPreference && environment && environment.length > 0) {
        dispatch(
          updateSettingsStoredKey({
            key: `hs_msbc_install_${page}_environment`,
          })
        );
        dispatch(updateGuideSteps({ steps: [environmentSteps[0]] }));
      }
      if (
        environmentPreference &&
        !companyPreference &&
        companies &&
        companies.length > 0
      ) {
        dispatch(
          updateSettingsStoredKey({ key: `hs_msbc_install_${page}_company` })
        );
        dispatch(updateGuideSteps({ steps: [environmentSteps[1]] }));
      }
    }
  }, [page, environmentPreference, companyPreference, environment, companies]);

  useEffect(() => {
    if (page === "invoiceSyncRules") {
      dispatch(updateGuideSteps({ steps: invoiceSteps.slice(0, 2) }));
      if (pipelinePreference && dealStagePreference && invoicePreference) {
        dispatch(
          updateSettingsStoredKey({ key: `hs_msbc_install_${page}_btns` })
        );
        dispatch(
          updateGuideSteps({
            steps: invoiceSteps.slice(-2),
          })
        );
      }

      if (pipelinePreference && !dealStagePreference) {
        dispatch(
          updateSettingsStoredKey({ key: `hs_msbc_install_${page}_dealStage` })
        );
        dispatch(
          updateGuideSteps({
            steps: [invoiceSteps[2]],
          })
        );
      }

      if (pipelinePreference && dealStagePreference && !invoicePreference) {
        dispatch(
          updateSettingsStoredKey({ key: `hs_msbc_install_${page}_generate` })
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
          updateSettingsStoredKey({ key: `hs_msbc_install_${page}_company` })
        );
        dispatch(updateGuideSteps({ steps: contactSyncSteps.slice(0, 3) }));
      }

      if (isContactCheckbox && !isContactSyncRulesSaved) {
        dispatch(
          updateSettingsStoredKey({ key: `hs_msbc_install_${page}_contact` })
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
        updateSettingsStoredKey({ key: `hs_msbc_install_${page}_advanced` })
      );
      dispatch(updateGuideSteps({ steps: productSyncAdvancedSteps }));
    } else if (page === "productSyncRules" && !advancedSettingStatus) {
      dispatch(updateSettingsStoredKey({ key: `hs_msbc_install_${page}` }));
      dispatch(updateGuideSteps({ steps: productSyncNormalSteps }));
    }
  }, [page, advancedSettingStatus]);

  const renderGuideTourLoading = () => {
    if (
      page === "environmentPage" &&
      ((companies && companies.length > 0) ||
        (environment && environment.length > 0))
    ) {
      if (
        (companies && companies.length > 0) ||
        (environment && environment.length > 0)
      ) {
        return true;
      }
    } else if (!cmsLoading && !hubspotLoading && !msbcLoading && !isLoading) {
      return true;
    }
    return false;
  };

  return (
    <div className="install-flow-bg">
      <HbNavbar
        logo={hsMsbcLogo}
        altText="Microsoft Business Central sync"
        text="Microsoft business central sync"
      />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <GuideTour
            steps={guidedTourSteps}
            loading={renderGuideTourLoading()}
            showTour={showSettingsTour}
            storedKey={settingsStoredKey}
          />
          {renderButton()}
          <div className="d-flex flex-column align-items-center my-5">
            <CmsEditAndSave
              userIds={hubspotUserIds}
              appSlug="hubspotMsbc-quick-install"
              setShowErrorModal={setShowErrorModal}
              setShowSuccessModal={setShowSuccessModal}
              editNotificationPath={`userId=${searchParams.get(
                "userId"
              )}&appSlug=hubspotMsbc-quick-install`}
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
