import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Spinner, Container } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";

import {
  connectApp,
  setShowErrorModal,
  setShowSuccessModal,
} from "@cloudify/generic";
import { HbNavbar } from "@cloudify/hubspot-frontend";

import { getUrl } from "../helpers/url";

import hsLogo from "./../assets/hs-eco-logo 3.svg";

const Redirect = () => {
  const [searchParams] = useSearchParams();
  const [oauthLoading, setOauthLoading] = useState(false);

  const dispatch = useDispatch();

  const storeFortnoxCreds = async ({
    code,
    token,
    parameters,
    error,
  }: {
    code?: string;
    token?: string;
    parameters?: string | { [k: string]: unknown };
    error?: string;
  }) => {
    setOauthLoading(true);

    const extractIds = token?.match(/\d+/g);
    let portalId: string | number = "";
    let userId: string | number = "";

    if (extractIds && extractIds.length >= 2) {
      portalId = extractIds[0];
      userId = extractIds[1];
    }

    try {
      if (code !== "") {
        const res = await axios.post(getUrl("VITE_SAVE_FORTNOX_CREDS"), {
          code,
          portalId,
          parameters,
        });
        if (res.status === 200) {
          dispatch(connectApp());
        }
        dispatch(
          setShowSuccessModal({
            message: "Fortnox connected successfully.",
          })
        );
      } else {
        await axios.post(getUrl("VITE_SAVE_FORTNOX_CREDS"), {
          parameters,
        });
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
          slug: "redirect",
        })
      );
    } finally {
      if (error === "error") {
        const timeoutId = setTimeout(() => {
          if (window.opener) {
            window.opener.postMessage(
              {
                message: "code or token not received",
                companyId: "",
                userId: "",
              },
              "*"
            );
          }
          clearTimeout(timeoutId);
        }, 3000);
      } else {
        const timeoutId = setTimeout(() => {
          window.opener?.postMessage(
            { message: "closeTheTab", portalId, userId },
            "*"
          );
          clearTimeout(timeoutId);
        }, 3000);
      }
      setOauthLoading(false);
    }
  };

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const params: { [k: string]: unknown } = {};
    const queryParams = window.location.search.substring(1);
    const keyValuePairs = queryParams.split("&");
    keyValuePairs.forEach((keyValue) => {
      const [key, value] = keyValue.split("=");
      params[key] = value;
    });
    if (code && state) {
      storeFortnoxCreds({ code, token: state, parameters: params });
    } else {
      const error = "error";
      storeFortnoxCreds({ parameters: params, error });
    }
  }, []);

  useEffect(() => {
    const paymentStatus = searchParams.get("paymentStatus");
    const plan = searchParams.get("plan");

    if (paymentStatus && plan) {
      window.opener.postMessage({ paymentStatus, plan }, "*");
      window.close();
    } else if (paymentStatus) {
      window.opener.postMessage({ paymentStatus }, "*");
      window.close();
    }
  }, []);
  return (
    <div>
      <HbNavbar logo={hsLogo} altText="Fortnox sync" text="Fortnox sync" />
      <Container className="components-container" style={{ height: "100vh" }}>
        {oauthLoading && (
          <div
            className="d-flex flex-row justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex flex-row justify-content-center align-items-center">
                <Spinner animation="border" variant="success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Redirect;
