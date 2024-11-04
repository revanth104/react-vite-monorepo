import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { setupGuideKeys, setupGuideTitles } from "../helpers/setupGuideKeys";

import { Loading, updateHubspotUserIds } from "@cloudify/hubspot-frontend";
import {
  CmsRichText,
  fetchCmsData,
  onChangeIsUserAllowed,
  CmsEditAndSave,
} from "@cloudify/cms";
import {
  setShowErrorModal,
  setShowSuccessModal,
  SetupGuideHeader,
  SetupGuide,
} from "@cloudify/generic";

import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";

const SetupGuidePage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { hubspotUserIds } = useSelector(
    (state: { hubspot: IHubspotSlice }) => state.hubspot
  );
  const {
    cmsData: { loading: cmsLoading },
    allowedUsers,
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  useEffect(() => {
    dispatch(fetchCmsData());
  }, []);

  useEffect(() => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (portalId) {
      dispatch(updateHubspotUserIds({ portalId, userId }));
    }
  }, []);

  useEffect(() => {
    if (allowedUsers.length > 0) {
      dispatch(onChangeIsUserAllowed({ userId: hubspotUserIds.userId }));
    }
  }, [allowedUsers]);

  return (
    <div>
      <SetupGuideHeader />
      {cmsLoading ? (
        <Loading />
      ) : (
        <>
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
          <SetupGuide
            CmsRichText={CmsRichText}
            contentCssName="setup-guide"
            setupGuideKeys={setupGuideKeys}
            setupGuideTitles={setupGuideTitles}
            installUrl="https://pm.cloudify.biz/hubspot-msbc/redirect"
          />
        </>
      )}
    </div>
  );
};

export default SetupGuidePage;
