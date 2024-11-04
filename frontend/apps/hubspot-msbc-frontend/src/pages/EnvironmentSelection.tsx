import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  EnvSelection,
  fetchCompanies,
  fetchEnvironment,
} from "@cloudify/msbc-frontend";
import {
  Loading,
  BookConsultation,
  onChangeCurrentWindow,
  updateHubspotUserIds,
} from "@cloudify/hubspot-frontend";
import {
  CmsRichText,
  fetchCmsData,
  onChangeIsUserAllowed,
  CmsEditAndSave,
} from "@cloudify/cms";
import {
  setShowErrorModal,
  setShowSuccessModal,
  fetchStatus,
} from "@cloudify/generic";

import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";
import { IMsbcSlice } from "@cloudify/msbc-frontend/src/types/msbcTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";

const EnvironmentSelection = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const path = window.location.pathname;

  const {
    cmsData: { loading: cmsLoading },
    allowedUsers,
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  const {
    environment: { loading: envLoading },
    environmentPreference,
  } = useSelector((state: { msbc: IMsbcSlice }) => state.msbc);

  const { hubspotUserIds } = useSelector(
    (state: { hubspot: IHubspotSlice }) => state.hubspot
  );

  const changeCurrentWindow = () => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (window.location.pathname === "/environment") {
      setTimeout(() => {
        navigate(
          `../subscription?portalId=${portalId}&userId=${userId}&page=subscriptionPage`
        );
      }, 2000);
    } else if (window.location.pathname === "/setup") {
      setTimeout(() => {
        dispatch(
          onChangeCurrentWindow({ currentWindow: "Subscription Window" })
        );
        navigate(
          `../${window.location.pathname}?portalId=${portalId}&userId=${userId}&page=subscriptionPage`
        );
      }, 1500);
    }
  };

  useEffect(() => {
    if (hubspotUserIds && Object.keys(hubspotUserIds).length > 0) {
      dispatch(fetchEnvironment({ userIds: hubspotUserIds }));
      dispatch(fetchStatus({ userIds: hubspotUserIds }));
    }
  }, [hubspotUserIds]);

  useEffect(() => {
    if (
      hubspotUserIds &&
      Object.keys(hubspotUserIds).length > 0 &&
      environmentPreference
    ) {
      dispatch(
        fetchCompanies({
          userIds: hubspotUserIds,
          environment: environmentPreference,
        })
      );
    }
  }, [environmentPreference]);

  useEffect(() => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (portalId && path === "/environment") {
      dispatch(updateHubspotUserIds({ portalId, userId }));
    }
  }, []);

  useEffect(() => {
    if (path === "/environment") {
      dispatch(fetchCmsData());
    }
  }, []);

  useEffect(() => {
    if (allowedUsers.length > 0 && path === "/environment") {
      dispatch(onChangeIsUserAllowed({ userId: hubspotUserIds.userId }));
    }
  }, [allowedUsers]);

  const iframeBackNavigation = () => {
    if (path === "/environment") {
      const portalId = searchParams.get("portalId");
      const userId = searchParams.get("userId");
      navigate(`../connect?portalId=${portalId}&userId=${userId}`);
    }
  };

  return (
    <>
      {cmsLoading || envLoading ? (
        <Loading />
      ) : (
        <>
          {path === "/environment" && (
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
          <Container>
            <Row
              className={`d-flex ${
                path === "/environment" || path === "/connect"
                  ? "justify-content-center"
                  : "justify-content-between"
              } align-items-center`}
              style={{ height: `${path === "/environment" ? "100vh" : ""}` }}
            >
              <Col md={path === "/environment" || path === "/connect" ? 9 : 5}>
                <EnvSelection
                  cardCssName="env-selection"
                  CmsRichText={CmsRichText}
                  cmsCssName="hubspot"
                  userIds={hubspotUserIds}
                  triggerAppName="hubspot"
                  changeCurrentWindow={changeCurrentWindow}
                  isBackBtn={path === "/environment" ? true : false}
                  iframeBackNavigation={iframeBackNavigation}
                />
              </Col>
              {path !== "/environment" && (
                <Col md={6}>
                  <div>
                    <BookConsultation CmsRichText={CmsRichText} />
                  </div>
                </Col>
              )}
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

export default EnvironmentSelection;
