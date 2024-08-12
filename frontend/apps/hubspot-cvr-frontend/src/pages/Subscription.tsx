import React, { useEffect, useState } from "react";
import { Container, Col, Row, Card, Spinner, Button } from "react-bootstrap";
import { FcInfo } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  fetchCmsData,
  onChangeIsUserAllowed,
  CmsEditAndSave,
  CmsRichText,
} from "@cloudify/cms";

import {
  updateUserIds,
  setShowErrorModal,
  setShowSuccessModal,
  fetchSubscription,
  PricingCards,
  SuccessModal,
  ErrorModal,
} from "@cloudify/cvr-frontend";
import axios, { AxiosError } from "axios";
import { getStripeUrl } from "../helpers/url";

import { IPreferenceSlice } from "@cloudify/cvr-frontend/src/types/preferenceTypes";
import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";

const Subscription = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const {
    allowedUsers,
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  const {
    userIds,
    subscriptionDetails: { loading, subscription },
  } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (window.location.pathname === "/subscription") {
      dispatch(fetchCmsData());
    }
  }, []);

  useEffect(() => {
    if (
      allowedUsers.length > 0 &&
      window.location.pathname === "/subscription"
    ) {
      dispatch(
        onChangeIsUserAllowed({
          ...userIds,
          appName: "hubspot",
        })
      );
    }
  }, [allowedUsers]);

  useEffect(() => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (portalId && window.location.pathname === "/subscription") {
      dispatch(updateUserIds({ portalId, userId }));
    }
  }, []);

  useEffect(() => {
    if (userIds && Object.keys(userIds).length > 0) {
      dispatch(fetchSubscription({ userIds }));
    }
  }, [userIds]);

  const renderText = () => {
    if (subscription.plan === "basic") {
      if (parseInt(subscription.usageCount) >= 15) {
        return "The Trial period of this app has expired. To continue using it, please upgrade to the premium plan.";
      } else {
        return "You are currently subscribed to the Basic plan.";
      }
    } else if (subscription.plan === "premium") {
      return "You are currently subscribed to the Premium plan.";
    } else if (subscription.plan === "premium-cancelled") {
      return "Your Premium plan has been cancelled. Please upgrade to Premium to continue using the app";
    }
  };

  const onOpenStripeCustomerPortal = async () => {
    try {
      const portalId = searchParams.get("portalId");
      const userId = searchParams.get("userId");

      setButtonLoading(true);
      const { data: portal } = await axios.post(
        getStripeUrl("VITE_STRIPE_BILLING_PORTAL"),
        {
          customerKey: subscription.customerKey,
          returnUrl: `${window.location.origin}/redirect?portalId=${portalId}&userId=${userId}&paymentStatus=none`,
        }
      );

      if (portal.url) {
        window.open(portal.url, "_blank");
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
      setButtonLoading(false);
    }
  };

  const cardData = [
    { id: 1, name: "Basic", path: "card1" },
    { id: 2, name: "Premium", path: "card2" },
  ];

  const subscriptionData = {
    queryParams: `portalId=${searchParams.get(
      "portalId"
    )}&userId=${searchParams.get("userId")}`,
    description: `Subscription active for the company with portal ${searchParams.get(
      "portalId"
    )}`,
    metaData: {
      portalId: searchParams.get("portalId"),
    },
    postData: {
      appSlug: "hubspotCvrLookup",
      metaData: {
        hubspotUserIds: searchParams.get("userId"),
      },
    },
  };

  return (
    <>
      <SuccessModal />
      <ErrorModal />
      <div>
        {window.location.pathname === "/subscription" && (
          <div className="d-flex flex-column align-items-center my-3">
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
        )}
        <Container>
          <Row>
            <div className="pricing-page d-flex justify-content-center align-tems-center">
              <Col lg={8}>
                <div className="my-4">
                  <CmsRichText
                    path="cmsContent.subscription.headerText"
                    cssName="mapping-window-header"
                  />
                  <div className="d-flex subscription-info-container">
                    <div>
                      <FcInfo className="info-icon" />
                    </div>
                    <div>
                      <p>
                        If the popup does not appear after clicking the upgrade
                        button, please enable popups in your browser and proceed
                        with the subscription process.
                      </p>
                    </div>
                  </div>
                  {cmsLoading || loading ? (
                    <div className="d-flex flex-column justify-content-center align-items-center loading-container">
                      <div className="d-flex flex-row justify-content-center align-items-center">
                        <Spinner
                          animation="border"
                          variant="primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        {/* <p className="my-1 mx-2 loading-text">Please wait...</p> */}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Card>
                        <Card.Body>
                          <p
                            className="my-1 pricing-page-para"
                            style={{
                              color: `${
                                subscription.plan === "basic" &&
                                parseInt(subscription.usageCount) >= 15 &&
                                "#f34541"
                              }`,
                              fontWeight: `${
                                subscription.plan === "basic" &&
                                parseInt(subscription.usageCount) >= 15 &&
                                "600"
                              }`,
                            }}
                          >
                            {renderText()}
                          </p>
                          <div className="d-flex flex-row justify-content-between align-items-center">
                            <p className="my-0 pricing-page-para">
                              <b>Sync Usage: </b>
                              {subscription.usageCount}
                            </p>
                            {subscription.customerKey && (
                              <Button
                                className="add-button"
                                onClick={onOpenStripeCustomerPortal}
                              >
                                {buttonLoading ? (
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <>
                                    <span>Go to billing portal</span>{" "}
                                    <FaExternalLinkAlt
                                      style={{ marginTop: "-3px" }}
                                    />
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                      <PricingCards
                        subscriptionData={subscriptionData}
                        cardData={cardData}
                        CmsRichText={CmsRichText}
                      />
                    </div>
                  )}
                </div>
              </Col>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Subscription;
