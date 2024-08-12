import React, { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import {
  CmsRichText,
  fetchCmsData,
  onChangeIsUserAllowed,
  CmsEditAndSave,
} from "@cloudify/cms";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  setShowErrorModal,
  setShowSuccessModal,
  updateUserIds,
  ErrorModal,
  SuccessModal,
  SetupGuideHeader,
  SetupGuide,
} from "@cloudify/cvr-frontend";
import { setupGuideKeys, setupGuideTitles } from "../helpers/setupGuideKeys";

import { IPreferenceSlice } from "@cloudify/cvr-frontend/src/types/preferenceTypes";
import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";

import cloudifyLogo from "../assets/cloudifyLogo.svg";

const SetupGuidePage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const {
    allowedUsers,
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  const { userIds } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  useEffect(() => {
    dispatch(fetchCmsData());
  }, []);

  useEffect(() => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (portalId) {
      dispatch(updateUserIds({ portalId, userId }));
    }
  }, []);

  useEffect(() => {
    if (allowedUsers.length > 0) {
      dispatch(onChangeIsUserAllowed({ ...userIds }));
    }
  }, [allowedUsers]);

  return (
    <div style={{ background: "#f2f5f7", minHeight: "100vh" }}>
      <ErrorModal />
      <SuccessModal />
      <SetupGuideHeader cloudifyLogo={cloudifyLogo} />
      {cmsLoading ? (
        <div className="d-flex flex-column justify-content-center align-items-center loading-container">
          <div className="d-flex flex-row justify-content-center align-items-center">
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex flex-column align-items-center mt-5">
            <CmsEditAndSave
              userIds={userIds}
              appSlug="hubspot-cvrLookup"
              setShowErrorModal={setShowErrorModal}
              setShowSuccessModal={setShowSuccessModal}
              editNotificationPath={`userId=${searchParams.get(
                "userId"
              )}&appSlug=hubspo-cvrLookup`}
            />
          </div>
          <SetupGuide
            CmsRichText={CmsRichText}
            contentCssName="setup-guide"
            setupGuideKeys={setupGuideKeys}
            setupGuideTitles={setupGuideTitles}
          />
        </>
      )}
    </div>
  );
};

export default SetupGuidePage;
