import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  PricingCards,
  setShowErrorModal,
  setShowSuccessModal,
  fetchStatus,
} from "@cloudify/generic";
import {
  fetchCmsData,
  onChangeIsUserAllowed,
  CmsEditAndSave,
  CmsRichText,
} from "@cloudify/cms";
import {
  updateHubspotUserIds,
  Loading,
  onChangeCurrentWindow,
} from "@cloudify/hubspot-frontend";

import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";

interface ICardData {
  id: number;
  path: string;
  name: string;
}

const Subscription = () => {
  const cardsData: ICardData[] = [
    {
      id: 1,
      path: "card1",
      name: "Free Trial",
    },
    {
      id: 2,
      path: "card2",
      name: "Basic",
    },
    {
      id: 3,
      path: "card3",
      name: "Premium",
    },
    {
      id: 4,
      path: "card4",
      name: "Custom",
    },
  ];

  const {
    allowedUsers,
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);
  const { hubspotUserIds } = useSelector(
    (state: { hubspot: IHubspotSlice }) => state.hubspot
  );

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const portalId = searchParams.get("portalId");
  const userId = searchParams.get("userId");

  const subscriptionData = {
    queryParams: `portalId=${portalId}&userId=${userId}`,
    createCustomerMetaData: {
      hubspotUserId: userId,
    },
    checkoutMetaData: {
      portalId,
    },
    checkoutDescription: `Subscription active for the company with the portalId ${portalId}`,
  };

  useEffect(() => {
    if (window.location.pathname === "/subscription") {
      dispatch(fetchCmsData());
    }
  }, []);

  useEffect(() => {
    if (allowedUsers.length > 0) {
      dispatch(onChangeIsUserAllowed({ userId: hubspotUserIds.userId }));
    }
  }, [allowedUsers]);

  useEffect(() => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (portalId) {
      dispatch(updateHubspotUserIds({ portalId, userId }));
    }
  }, []);

  useEffect(() => {
    if (hubspotUserIds && Object.keys(hubspotUserIds).length > 0) {
      dispatch(fetchStatus({ userIds: hubspotUserIds }));
    }
  }, [hubspotUserIds]);

  const changeCurrentWindow = () => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    navigate(
      `../${window.location.pathname}?portalId=${portalId}&userId=${userId}&page=invoiceSyncRules`
    );
    dispatch(onChangeCurrentWindow({ currentWindow: "Sync Window" }));
  };

  return (
    <div>
      {window.location.pathname === "/subscription" && (
        <div className="d-flex flex-column align-items-center my-3">
          <CmsEditAndSave
            userIds={hubspotUserIds}
            appSlug="hubspotEconomic-quick-install"
            setShowErrorModal={setShowErrorModal}
            setShowSuccessModal={setShowSuccessModal}
            editNotificationPath={`userId=${searchParams.get(
              "userId"
            )}&appSlug=hubspotMsbc-quick-install`}
          />
        </div>
      )}
      <Container className="mt-4 mb-5">
        {cmsLoading ? (
          <Loading />
        ) : (
          <Row className="d-flex flex-row justify-content-center">
            <Col xs={12} className="px-0">
              <div className="subscription-container">
                <CmsRichText
                  path="cmsContent.subscriptionPage.text"
                  cssName="hubspot"
                />
              </div>

              <div>
                <PricingCards
                  cardsData={cardsData}
                  appSlug="hubspotMsbc"
                  userIds={hubspotUserIds}
                  CmsRichText={CmsRichText}
                  subscriptionData={subscriptionData}
                  customUrl="https://www.cloudify.biz/marketplace/packages/hubspot-msbusinesscentral"
                />
                {window.location.pathname === "/setup" && (
                  <div className="mt-5 d-flex justify-content-end">
                    <Button
                      className="hb-button"
                      onClick={() => changeCurrentWindow()}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Subscription;
