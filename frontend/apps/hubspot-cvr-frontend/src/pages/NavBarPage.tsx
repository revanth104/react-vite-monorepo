import React, { useState, useEffect } from "react";
import { Navbar, Button, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

import { getUrl } from "../helpers/url";
import {
  ErrorModal,
  setShowErrorModal,
  setShowSuccessModal,
  updateUserIds,
  SaveModal,
  showSaveModal,
} from "@cloudify/cvr-frontend";
import {
  fetchCmsData,
  onChangeIsUserAllowed,
  CmsEditAndSave,
  CmsRichText,
} from "@cloudify/cms";

import { IPreferenceSlice } from "@cloudify/cvr-frontend/src/types/preferenceTypes";
import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";
import { ICvrMappingSlice } from "@cloudify/cvr-frontend/src/types/cvrMappingTypes";

import MappingWindow from "./MappingWindow";
import Subscription from "./Subscription";
import Confirmation from "./Confirmation";

const WINDOW = Object.freeze({
  MAPPING_WINDOW: "Mapping Window",
  SUBSCRIPTION: "Subscription Window",
  CONFIRMATION: "Confirmation Window",
});

const windowObject = {
  "Mapping Window": <MappingWindow />,
  "Subscription Window": <Subscription />,
  "Confirmation Window": <Confirmation />,
};

const NavBarPage = () => {
  const [currentWindow, setCurrentWindow] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userIds } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );
  const {
    allowedUsers,
    cmsData: { loading: cmsLoading },
    isEdit,
  } = useSelector((state: { cms: ICmsData }) => state.cms);
  const { isCvrCheck, deletedProperties, isMappingsSaved } = useSelector(
    (state: { cvrMapping: ICvrMappingSlice }) => state.cvrMapping
  );

  const nextNavigation = () => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (currentWindow === WINDOW.MAPPING_WINDOW) {
      navigate(
        `${window.location.pathname}?portalId=${portalId}&userId=${userId}&paymentStatus=none`
      );
      setCurrentWindow(WINDOW.SUBSCRIPTION);
    }
    if (currentWindow === WINDOW.SUBSCRIPTION) {
      navigate(
        `${window.location.pathname}?portalId=${portalId}&userId=${userId}&confirmation=true`
      );
      setCurrentWindow(WINDOW.CONFIRMATION);
    }
  };

  const backNavigation = () => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (currentWindow === WINDOW.SUBSCRIPTION) {
      navigate(
        `${window.location.pathname}?portalId=${portalId}&userId=${userId}`
      );
      setCurrentWindow(WINDOW.MAPPING_WINDOW);
    }
    if (currentWindow === WINDOW.CONFIRMATION) {
      navigate(
        `${window.location.pathname}?portalId=${portalId}&userId=${userId}&paymentStatus=none`
      );
      setCurrentWindow(WINDOW.SUBSCRIPTION);
    }
  };

  const goBackToHubspot = () => {
    const portalId = searchParams.get("portalId");
    window.open(
      `https://app.hubspot.com/contacts/${portalId}/companies`,
      "_self"
    );
  };

  const install = async () => {
    try {
      const code = searchParams.get("code");
      const portalId = searchParams.get("portalId");
      const userId = searchParams.get("userId");
      const paymentStatus = searchParams.get("paymentStatus");
      const confirmation = searchParams.get("confirmation");
      if (code) {
        setLoading(true);
        const { data: res } = await axios.get(getUrl("REACT_APP_INSTALL_URL"), {
          params: {
            code,
          },
        });
        setCurrentWindow(WINDOW.MAPPING_WINDOW);
        setLoading(false);
        navigate(`../setup?portalId=${res.portalId}&userId=${res.userId}`);
      } else if (portalId && userId && paymentStatus) {
        setCurrentWindow(WINDOW.SUBSCRIPTION);
      } else if (portalId && userId && confirmation) {
        setCurrentWindow(WINDOW.CONFIRMATION);
      } else if (portalId && userId) {
        setCurrentWindow(WINDOW.MAPPING_WINDOW);
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
    }
  };

  useEffect(() => {
    dispatch(fetchCmsData());
  }, []);

  useEffect(() => {
    install();
  }, []);

  useEffect(() => {
    if (allowedUsers.length > 0) {
      dispatch(onChangeIsUserAllowed({ ...userIds, appName: "hubspot" }));
    }
  }, [allowedUsers]);

  useEffect(() => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (portalId) {
      dispatch(updateUserIds({ portalId, userId }));
    }
  }, []);

  return (
    <div>
      <ErrorModal />
      <SaveModal />
      {loading || cmsLoading ? (
        <div className="d-flex flex-column justify-content-center align-items-center nav-loading-container">
          <div className="d-flex flex-row justify-content-center align-items-center">
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </div>
      ) : (
        <div>
          <Navbar fixed="top" className="px-4 py-3 navbar">
            <div className="d-flex justify-content-between w-100">
              {currentWindow !== "Mapping Window" ? (
                <Button
                  className="navbar-back-button my-auto"
                  onClick={backNavigation}
                >
                  Back
                </Button>
              ) : (
                <p className="disable-para"></p>
              )}

              <div className="text-center">
                <CmsRichText
                  path="cmsContent.header.text"
                  cssName="header-text"
                />
              </div>

              {currentWindow !== "Confirmation Window" ? (
                <>
                  {(isCvrCheck ||
                    deletedProperties.length > 0 ||
                    isMappingsSaved) &&
                  currentWindow === "Mapping Window" ? (
                    <Button
                      className="navbar-next-button my-auto"
                      onClick={() => dispatch(showSaveModal())}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      className="navbar-next-button my-auto"
                      onClick={nextNavigation}
                    >
                      Next
                    </Button>
                  )}
                </>
              ) : (
                // <p className="disable-para"></p>
                <Button
                  className="navbar-next-button my-auto"
                  onClick={goBackToHubspot}
                >
                  Finish
                </Button>
              )}
            </div>
          </Navbar>
          <div className="container components-container">
            <div
              className="d-flex flex-column align-items-center"
              style={{
                marginTop:
                  isEdit && window.location.pathname === "/setup"
                    ? "200px"
                    : "",
              }}
            >
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
            <div>
              {windowObject[currentWindow as keyof typeof windowObject]}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBarPage;
