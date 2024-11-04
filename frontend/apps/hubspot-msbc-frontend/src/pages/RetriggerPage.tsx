import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import hsEcoLogo from "./../assets/hs-eco-logo 3.svg";

import {
  Loading,
  HbNavbar,
  updateHubspotUserIds,
} from "@cloudify/hubspot-frontend";
import {
  setShowErrorModal,
  setShowSuccessModal,
  Retrigger,
} from "@cloudify/generic";
import {
  fetchCmsData,
  onChangeIsUserAllowed,
  CmsEditAndSave,
  CmsRichText,
} from "@cloudify/cms";

import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";

const RetriggerPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { hubspotUserIds } = useSelector(
    (state: { hubspot: IHubspotSlice }) => state.hubspot
  );
  const {
    allowedUsers,
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  const retriggerStages: { [k: string]: { [k: string]: unknown } } = {
    triggered: {
      label: "stage1",
      value: undefined,
    },
    findCreateCompanies: {
      label: "stage2",
      value: undefined,
    },
    findCreateProducts: {
      label: "stage3",
      value: undefined,
    },
    syncDeal: {
      label: "stage4",
      value: undefined,
    },
  };

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

  const generate = searchParams.get("generate");

  const retriggerBody = {
    ...hubspotUserIds,
    dealId: searchParams.get("objectId"),
    generate:
      generate === "invoice" || generate === "order" ? generate : "invoice",
  };

  return (
    <div>
      <HbNavbar
        logo={hsEcoLogo}
        altText="Microsoft business central sync"
        text="Microsoft business central sync"
      />
      {cmsLoading ? (
        <Loading />
      ) : (
        <>
          <div className="d-flex justify-content-center my-5">
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
          <Retrigger
            CmsRichText={CmsRichText}
            actionAppName="Microsoft Business Central"
            retriggerStages={retriggerStages}
            triggerAppName="HubSpot"
            retriggerBody={retriggerBody}
          />
        </>
      )}
    </div>
  );
};

export default RetriggerPage;
