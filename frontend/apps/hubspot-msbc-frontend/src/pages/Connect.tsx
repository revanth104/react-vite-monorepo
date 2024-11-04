import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios, { AxiosError } from "axios";
import { getUrl } from "../helpers/url";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  onChangeCurrentWindow,
  updateHubspotUserIds,
  Connection,
  HbButton,
  ConnectedAccount,
  Loading,
} from "@cloudify/hubspot-frontend";
import {
  connectApp,
  setShowErrorModal,
  setShowSuccessModal,
  fetchStatus,
} from "@cloudify/generic";
import {
  CmsRichText,
  fetchCmsData,
  onChangeIsUserAllowed,
  CmsEditAndSave,
} from "@cloudify/cms";

import msbcLogo from "./../assets/logo-business-central.svg";

import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";
import { IPreferenceSlice } from "@cloudify/generic/src/types/preferenceTypes";

const Connect = () => {
  const [disConnectLoading, setDisConnectLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [connectLoading, setConnectLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const path = window.location.pathname;

  const {
    cmsData: { loading: cmsLoading },
    allowedUsers,
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  const { isAppConnected, connectedMail } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const { hubspotUserIds } = useSelector(
    (state: { hubspot: IHubspotSlice }) => state.hubspot
  );

  const changeCurrentWindow = () => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    navigate(
      `../${window.location.pathname}?portalId=${portalId}&userId=${userId}&page=environmentPage`
    );
    dispatch(onChangeCurrentWindow({ currentWindow: "Environment Window" }));
  };

  const navigateToEnvSelectionPage = () => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    navigate(
      `../environment?portalId=${portalId}&userId=${userId}&page=environmentPage`
    );
    dispatch(onChangeCurrentWindow({ currentWindow: "Environment Window" }));
  };

  const renderButtonText = () => {
    let btnText = "";
    if (isAppConnected && path === "/setup") {
      btnText = "Continue";
    } else if (isAppConnected && path !== "/setup") {
      btnText = "Next";
    } else if (!isAppConnected) {
      btnText = "Connect Microsoft Business Central";
    }
    return btnText;
  };

  const renderNavigationMethods = () => {
    if (isAppConnected && path === "/setup") {
      return changeCurrentWindow;
    } else if (isAppConnected && path !== "/setup") {
      return navigateToEnvSelectionPage;
    } else if (!isAppConnected) {
      return connectMsbcAccount;
    }
  };

  const connectMsbcAccount = () => {
    try {
      setConnectLoading(true);
      const portalId = searchParams.get("portalId");
      const userId = searchParams.get("userId");
      window.open(
        `${getUrl(
          "VITE_INSTALL_MSBC"
        )}?portalId=${portalId}&userId=${userId}&path=${
          window.location.pathname.split("/")[1]
        }`,
        "_self"
      );
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
      setConnectLoading(false);
    }
  };

  const disconnectAccount = async () => {
    try {
      setDisConnectLoading(true);
      const portalId = searchParams.get("portalId");
      await axios.post(getUrl("VITE_DISCONNECT_MSBC"), {
        portalId,
      });
      dispatch(connectApp());
      dispatch(
        setShowSuccessModal({
          message:
            "cmsContent.notifications.authenticationPage.successContent.disconnectAcc.message",
        })
      );
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
      setDisConnectLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const status = searchParams.get("status");
    const tenantId = searchParams.get("tenantId");
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");

    if (status && status === "successfull") {
      dispatch(connectApp());
      dispatch(
        setShowSuccessModal({
          message:
            "cmsContent.notifications.authenticationPage.successContent.connectAcc.message",
        })
      );
    }
    if (
      window.location.pathname === "/connect" &&
      status === "successfull" &&
      tenantId &&
      portalId
    ) {
      navigate(`../environment?portalId=${portalId}&userId=${userId}`);
    }
  }, []);

  useEffect(() => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (portalId && path === "/connect") {
      dispatch(updateHubspotUserIds({ portalId, userId }));
    }
  }, []);

  useEffect(() => {
    if (path === "/connect") {
      dispatch(fetchCmsData());
    }
  }, []);

  useEffect(() => {
    if (allowedUsers.length > 0 && path === "/connect") {
      dispatch(onChangeIsUserAllowed({ userId: hubspotUserIds.userId }));
    }
  }, [allowedUsers]);

  useEffect(() => {
    if (hubspotUserIds && Object.keys(hubspotUserIds).length > 0) {
      dispatch(fetchStatus({ userIds: hubspotUserIds }));
    }
  }, [hubspotUserIds]);

  const connectMsbc = () => {
    return (
      <div>
        <CmsRichText
          path="cmsContent.authenticationPage.title"
          cssName="hubspot"
        />
        <img src={msbcLogo} alt="e-conomic logo" className="mt-4 mb-5" />
        {isAppConnected && (
          <ConnectedAccount
            buttonText="Unlink"
            connectedAccount={connectedMail}
            disConnectAccount={disconnectAccount}
            disConnectBtnLoading={disConnectLoading}
          />
        )}
        {!isAppConnected ? (
          <>
            <CmsRichText
              path="cmsContent.authenticationPage.disconnected"
              cssName="hubspot"
            />
          </>
        ) : (
          <CmsRichText
            path="cmsContent.authenticationPage.connected"
            cssName="hubspot"
          />
        )}

        <div className="my-4">
          <HbButton
            text={renderButtonText()}
            click={renderNavigationMethods()}
            className="connect-button"
          />
        </div>

        <p
          className="mt-3"
          style={{ marginBottom: "0px", fontSize: "14px", opacity: "70%" }}
        >
          Need help?
        </p>
        <p
          style={{ marginBottom: "0px", fontSize: "14px", opacity: "70%" }}
          className="my-1"
        >
          Check the{" "}
          <a href="/setupguide" target="_blank" rel="noreferrer">
            setup guide
          </a>
        </p>
        <p style={{ fontSize: "14px", opacity: "70%" }} className="mb-4">
          <a
            href="https://meetings.hubspot.com/cloudify/app-assistance"
            target="_blank"
            rel="noreferrer"
          >
            Book a consultation
          </a>
        </p>
      </div>
    );
  };

  return (
    <Container>
      {cmsLoading ? (
        <Loading />
      ) : (
        <>
          {path === "/connect" && (
            <div className="d-flex flex-column align-items-center mt-5">
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
          )}
          <div className={`${path === "/connect" ? "my-3" : ""}`}>
            <Connection
              actionAppConnection={connectMsbc}
              CmsRichText={CmsRichText}
              isIframe={path === "/connect" ? true : false}
            />
          </div>
        </>
      )}
    </Container>
  );
};

export default Connect;
