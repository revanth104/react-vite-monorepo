import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import InvoiceSyncRules from "../components/install/InvoiceSyncRules";
import CustomerSearchRules from "../components/install/CustomerSearchRules";
import ProductSyncRules from "../components/install/ProductSyncRules";

import {
  InstallFlowSyncRules,
  Loading,
  onChangeCurrentWindow,
  BookConsultation,
} from "@cloudify/hubspot-frontend";
import {
  saveCustomerSyncRules,
  saveProductSyncRules,
  setShowErrorModal,
  fetchStatus,
} from "@cloudify/generic";
import { CmsRichText } from "@cloudify/cms";

import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { IFortnoxSlice } from "@cloudify/fortnox-frontend/src/types/fortnoxTypes";

const SyncRules = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  const {
    fields: { loading: hubspotLoading },
    hubspotUserIds,
  } = useSelector((state: { hubspot: IHubspotSlice }) => state.hubspot);

  const {
    fields: { loading: fortnoxLoading },
  } = useSelector((state: { fortnox: IFortnoxSlice }) => state.fortnox);

  const dispatch = useDispatch();

  const page = searchParams.get("page");

  const searchFilterOptionKeys = ["companies", "contacts"];
  const triggerKeys = ["deals"];

  const labels: { [k: string]: string } = {
    "Invoice/Order Creation Rules": "Invoice Sync Rules",
    "Customer Search Rules": "Customer Preferences",
    "Product Sync Rules": "Product Sync Rules",
  };

  const onShowActiveWindow = () => {
    if (page === "invoiceSyncRules") {
      return <InvoiceSyncRules />;
    } else if (page === "customerSearchRules") {
      return <CustomerSearchRules />;
    } else {
      return <ProductSyncRules />;
    }
  };

  useEffect(() => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (page === "connectPage") {
      navigate(`../setup?portalId=${portalId}&userId=${userId}&page=connect`);
      dispatch(onChangeCurrentWindow({ currentWindow: "Connect Window" }));
    }
  }, [page]);

  useEffect(() => {
    if (hubspotUserIds && Object.keys(hubspotUserIds).length > 0) {
      dispatch(
        fetchStatus({ userIds: hubspotUserIds, triggerAppName: "HubSpot" })
      );
    }
  }, []);

  return (
    <Container>
      {cmsLoading || hubspotLoading || fortnoxLoading ? (
        <Loading />
      ) : (
        <Row className="d-flex justify-content-between">
          <InstallFlowSyncRules
            page={searchParams.get("page")}
            onShowActiveWindow={onShowActiveWindow}
            actionAppName="fortnox"
            saveCustomerSyncRules={saveCustomerSyncRules}
            saveProductSyncRules={saveProductSyncRules}
            setShowErrorModal={setShowErrorModal}
            searchFilterOptionKeys={searchFilterOptionKeys}
            triggerKeys={triggerKeys}
            progressBarLabels={labels}
          />
          <Col md={5} className="mt-5 d-flex flex-column align-items-end">
            <div style={{ width: "90%" }}>
              {(page === "invoiceSyncRules" ||
                page === "customerSearchRules" ||
                page === "productSyncRules") && (
                <CmsRichText
                  path={`cmsContent.install.${page}.guideContent`}
                  cssName="hubspot"
                />
              )}
            </div>
            <div style={{ width: "90%" }} className="mt-4">
              <BookConsultation CmsRichText={CmsRichText} />
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default SyncRules;
