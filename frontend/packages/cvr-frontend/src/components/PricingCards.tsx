import React, { useState, useEffect } from "react";
import { Button, Spinner, Row, Col } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import {
  setShowSuccessModal,
  setShowErrorModal,
  fetchSubscription,
  setSubScriptionDetails,
} from "../slice/preferenceSlice";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUrlInCvr, getStripeUrl } from "../helpers/url";

import { IPreferenceSlice } from "../types/preferenceTypes";

interface ISubscriptionData {
  queryParams: string;
  description: string;
  metaData: {
    portalId: string | null;
  };
  postData: {
    appSlug: string;
    metaData: {
      hubspotUserIds: string | null;
    };
  };
}

interface ICardData {
  id: number;
  name: string;
  path: string;
}

interface IProps {
  subscriptionData: ISubscriptionData;
  cardData: ICardData[];
  CmsRichText: React.ComponentType<{ path: string; cssName?: string }>;
}

const PricingCards = (props: IProps) => {
  const { subscriptionData, cardData, CmsRichText } = props;
  const { queryParams, description, metaData, postData } = subscriptionData;

  const {
    subscriptionDetails: { subscription },
    userIds,
  } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [downgradeLoading, setDowngradeLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [customerKey, setCustomerKey] = useState("");

  const openNewWindow = () => {
    window.addEventListener("message", (e) => {
      if (e.data?.paymentStatus) {
        console.log(e.data?.paymentStatus);
        setPaymentStatus(e.data?.paymentStatus);
      }
    });
  };

  const onUpgradePlan = async () => {
    try {
      setUpgradeLoading(true);
      const { data: customer } = await axios.post(
        getStripeUrl("VITE_FIND_CREATE_CUSTOMER"),
        postData
      );
      setCustomerKey(customer.id);

      const { data: res } = await axios.post(
        getStripeUrl("VITE_STRIPE_CHECKOUT"),
        {
          customerKey: customer.id,
          appSlug: "hubspotCvrLookup",
          plan: "premium",
          successUrl: `${window.location.origin}/redirect?${queryParams}&paymentStatus=cardAdded`,
          cancelUrl: `${window.location.origin}/redirect?${queryParams}&paymentStatus=failed`,
          subscriptionData: {
            description,
            metaData,
          },
        }
      );
      if (res.url) {
        window.open(res.url, "_blank");
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
      dispatch(setShowErrorModal({ message: errorMessage }));
    } finally {
      setUpgradeLoading(false);
    }
  };

  const onCancelSubscription = async () => {
    try {
      setDowngradeLoading(true);
      await axios.post(getUrlInCvr("VITE_SUBSCRIPTION_CANCEL"), {
        ...userIds,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(fetchSubscription({ userIds }) as any);
      dispatch(
        setShowSuccessModal({ message: "Subscription cancelled successfully." })
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
      dispatch(setShowErrorModal({ message: errorMessage }));
    } finally {
      setDowngradeLoading(false);
    }
  };

  const paymentStatusCheck = async () => {
    if (paymentStatus === "cardAdded") {
      dispatch(
        setSubScriptionDetails({
          plan: "premium",
          usageCount: "0",
          customerKey: customerKey,
        })
      );
      navigate(
        `..${window.location.pathname}?${queryParams}&paymentStatus=none`
      );
      dispatch(
        setShowSuccessModal({ message: "Subscription upgraded successfully." })
      );
    } else if (paymentStatus === "failed") {
      dispatch(setShowErrorModal({ message: "Payment failed." }));
    }
    setPaymentStatus("");
  };

  useEffect(() => {
    openNewWindow();
    if (paymentStatus) {
      paymentStatusCheck();
    }
  }, [paymentStatus]);

  const renderButtons = (card: ICardData) => {
    if (subscription.plan === "basic" && card.name === "Basic") {
      return (
        <>
          {parseInt(subscription.usageCount) >= 15 ? (
            <Button className="pricing-card-cancel-button mt-3 mb-3" disabled>
              Trial Expired
            </Button>
          ) : (
            <Button className="pricing-card-button-disable mt-3 mb-3" disabled>
              Selected
            </Button>
          )}
        </>
      );
    } else if (subscription.plan === "basic" && card.name === "Premium") {
      return (
        <Button
          disabled={upgradeLoading}
          className="pricing-card-button mt-3 mb-3"
          onClick={onUpgradePlan}
        >
          {upgradeLoading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <span>Upgrade</span>
          )}
        </Button>
      );
    } else if (subscription.plan === "premium" && card.name === "Premium") {
      return (
        <div className="d-flex flex-column mt-3 mb-3">
          <Button className="pricing-card-button-disable " disabled>
            Selected
          </Button>
          <Button
            className="pricing-card-cancel-button mt-2"
            onClick={onCancelSubscription}
            disabled={downgradeLoading}
          >
            {downgradeLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              <span>Cancel Subscription</span>
            )}
          </Button>
        </div>
      );
    } else if (
      subscription.plan === "premium-cancelled" &&
      card.name === "Premium"
    ) {
      return (
        <Button
          disabled={upgradeLoading}
          className="pricing-card-button mt-3 mb-3"
          onClick={onUpgradePlan}
        >
          {upgradeLoading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <span>Upgrade</span>
          )}
        </Button>
      );
    }
  };

  return (
    <Row className="pricing-cards-container">
      {cardData &&
        subscription.plan &&
        cardData.map((card) => (
          <Col
            md={5}
            sm={8}
            key={card.id}
            className={`pricing-list mt-3 h-100 ${
              (subscription.plan === "premium" ||
                subscription.plan === "premium-cancelled") &&
              card.name === "Basic" &&
              "d-none"
            }`}
          >
            <div>
              <div className="pricing-card-header px-2">
                <CmsRichText
                  path={`cmsContent.subscription.${card.path}.plan`}
                />
              </div>
              <div className="pricing-card-price-container">
                <CmsRichText
                  path={`cmsContent.subscription.${card.path}.price`}
                />
                <div style={{ padding: "0 20px 0 20px" }}>
                  {renderButtons(card)}
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <CmsRichText
                    path={`cmsContent.subscription.${card.path}.points`}
                  />
                </div>
              </div>
            </div>
          </Col>
        ))}
    </Row>
  );
};

export default PricingCards;
