import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import hubspotLogo from "./../assets/hubspot-logo-69 1.svg";
import msbcLogo from "./../assets/mircrosoftBC.svg";

import {
  onChangeCurrentWindow,
  fetchHubSpotFields,
  updateHubspotUserIds,
  HbIntroPage,
  Loading,
} from "@cloudify/hubspot-frontend";
import { CmsRichText } from "@cloudify/cms";
import { fetchPipelines } from "@cloudify/generic";

import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";

const IntroPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const changeCurrentWindow = () => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    dispatch(onChangeCurrentWindow({ currentWindow: "Connect Window" }));
    navigate(
      `../${window.location.pathname}?portalId=${portalId}&userId=${userId}&page=connectPage`
    );
  };

  const {
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  const { hubspotUserIds } = useSelector(
    (state: { hubspot: IHubspotSlice }) => state.hubspot
  );

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

  return (
    <div>
      {cmsLoading ? (
        <Loading />
      ) : (
        <HbIntroPage
          triggerAppLogo={hubspotLogo}
          actionAppLogo={msbcLogo}
          changeCurrentWindow={changeCurrentWindow}
          CmsRichText={CmsRichText}
        />
      )}
    </div>
  );
};

export default IntroPage;
