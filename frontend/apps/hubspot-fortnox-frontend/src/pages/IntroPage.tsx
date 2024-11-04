import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  onChangeCurrentWindow,
  fetchHubSpotFields,
  updateHubspotUserIds,
  HbIntroPage,
  Loading,
} from "@cloudify/hubspot-frontend";
import { fetchPipelines, setShowErrorModal } from "@cloudify/generic";
import { CmsRichText } from "@cloudify/cms";
import { fetchFortnoxFields } from "@cloudify/fortnox-frontend";

import hubspotLogo from "./../assets/hubspot-logo-69 1.svg";
import fortnoxLogo from "./../assets/logo-fortnox.svg";

import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { IPreferenceSlice } from "@cloudify/generic/src/types/preferenceTypes";

const IntroPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  const { hubspotUserIds } = useSelector(
    (state: { hubspot: IHubspotSlice }) => state.hubspot
  );

  const { isAppConnected } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const changeCurrentWindow = () => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    dispatch(onChangeCurrentWindow({ currentWindow: "Connect Window" }));
    navigate(
      `../${window.location.pathname}?portalId=${portalId}&userId=${userId}&page=connectPage`
    );
  };

  useEffect(() => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");

    if (portalId) {
      dispatch(updateHubspotUserIds({ portalId, userId }));
    }
  }, []);

  useEffect(() => {
    if (hubspotUserIds && Object.keys(hubspotUserIds).length > 0) {
      dispatch(fetchHubSpotFields({ userIds: hubspotUserIds }));
      dispatch(fetchPipelines({ userIds: hubspotUserIds }));
    }
  }, [hubspotUserIds]);

  useEffect(() => {
    if (
      hubspotUserIds &&
      Object.keys(hubspotUserIds).length > 0 &&
      isAppConnected
    ) {
      dispatch(
        fetchFortnoxFields({ userIds: hubspotUserIds, setShowErrorModal })
      );
    }
  }, [hubspotUserIds, isAppConnected]);

  return (
    <div>
      {cmsLoading ? (
        <Loading />
      ) : (
        <HbIntroPage
          triggerAppLogo={hubspotLogo}
          actionAppLogo={fortnoxLogo}
          changeCurrentWindow={changeCurrentWindow}
          CmsRichText={CmsRichText}
        />
      )}
    </div>
  );
};

export default IntroPage;
