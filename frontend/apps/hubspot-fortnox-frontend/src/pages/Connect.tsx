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

import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";
import { IPreferenceSlice } from "@cloudify/generic/src/types/preferenceTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";

import fortnoxLogo from "./../assets/fortnox_logo.png";

const Connect = () => {
  const [disConnectLoading, setDisConnectLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [portal, setPortalId] = useState(null);
  const [user, setUserId] = useState(null);

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
      `../${window.location.pathname}?portalId=${portalId}&userId=${userId}&page=subscriptionPage`
    );
    dispatch(onChangeCurrentWindow({ currentWindow: "Subscription Window" }));
  };

  const connectFortnoxAccount = () => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    try {
      setLoading(true);
      const url = `https://apps.fortnox.se/oauth-v1/auth?client_id=${
        import.meta.env.VITE_FORTNOX_CLIENT_ID
      }&redirect_uri=${
        window.location.origin
      }/redirect&scope=profile%20customer%20currency%20invoice%20order%20article%20settings%20price&state=hubspotFortnox_${portalId}_${userId}&response_type=code&access_type=offline`;
      const ref = window.open(url, "_blank");
      window.addEventListener("message", (event) => {
        const { message, portalId, userId } = event.data;
        if (portalId && userId) {
          setPortalId(portalId);
          setUserId(userId);
        }
        if (message === "closeTheTab") {
          ref?.close();
          setLoading(false);
        } else if (message === "code or token not received") {
          ref?.close();
          setLoading(false);
          dispatch(
            setShowErrorModal({
              message:
                "There was a problem while connecting your Fortnox Account.",
            })
          );
        }
      });
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
    }
  };

  const connectFortnox = () => {
    return (
      <div>
        <CmsRichText
          path="cmsContent.authenticationPage.title"
          cssName="hubspot"
        />
        <img
          src={fortnoxLogo}
          alt="fortnox logo"
          className="mt-4 mb-5"
          style={{ width: "250px", height: "65px" }}
        />
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
        {path === "/setup" && (
          <div className="my-4">
            <HbButton
              text={`${isAppConnected ? "Continue" : "Connect Fortnox"}`}
              click={
                isAppConnected ? changeCurrentWindow : connectFortnoxAccount
              }
              className="fortnox-connect-button"
            />
          </div>
        )}
        {path === "/connect" && !isAppConnected && (
          <div className="my-4">
            <HbButton
              text="Connect Fortnox"
              click={connectFortnoxAccount}
              className="fortnox-connect-button"
            />
          </div>
        )}
        <p
          className="mt-3"
          style={{ marginBottom: "0px", fontSize: "14px", opacity: "70%" }}
        >
          Need help?
        </p>
        <p style={{ fontSize: "14px", opacity: "70%" }} className="mt-1 mb-4">
          Check the{" "}
          <a href="/setupguide" target="_blank" rel="noreferrer">
            setup guide
          </a>
        </p>
      </div>
    );
  };

  const disconnectAccount = async () => {
    try {
      setDisConnectLoading(true);
      const portalId = searchParams.get("portalId") as string;
      await axios.post(getUrl("VITE_REMOVE_FORTNOX_CREDS"), {
        portalId: parseInt(portalId),
      });

      dispatch(connectApp());

      dispatch(
        setShowSuccessModal({
          message: "Your Fortnox account has been disconnected successfully",
        })
      );
      setPortalId(null);
      setUserId(null);
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
    if (hubspotUserIds && Object.keys(hubspotUserIds).length > 0) {
      dispatch(fetchStatus({ userIds: hubspotUserIds }));
    }
  }, [portal, user]);

  useEffect(() => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (portalId && path === "/connect") {
      dispatch(updateHubspotUserIds({ portalId, userId }));
    }
  }, []);

  useEffect(() => {
    if (
      hubspotUserIds &&
      Object.keys(hubspotUserIds).length > 0 &&
      path === "/connect"
    ) {
      dispatch(fetchStatus({ userIds: hubspotUserIds }));
    }
  }, [hubspotUserIds]);

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

  return (
    <Container>
      {cmsLoading || loading ? (
        <Loading />
      ) : (
        <>
          {path === "/connect" && (
            <div className="d-flex flex-column align-items-center mt-5">
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
          )}
          <div className={`${path === "/connect" ? "my-3" : ""}`}>
            <Connection
              actionAppConnection={connectFortnox}
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
