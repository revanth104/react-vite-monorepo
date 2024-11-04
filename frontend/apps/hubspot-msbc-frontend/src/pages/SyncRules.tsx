import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import CustomerSearchRules from "../components/install/CustomerSearchRules";
import ProductSyncRules from "../components/install/ProductSyncRules";
import InvoiceSyncRules from "../components/install/InvoiceSyncRules";

import {
  InstallFlowSyncRules,
  Loading,
  BookConsultation,
} from "@cloudify/hubspot-frontend";
import {
  saveCustomerSyncRules,
  saveProductSyncRules,
  setShowErrorModal,
  fetchStatus,
} from "@cloudify/generic";
import {
  fetchMsbcFields,
  getDefaultMappingFields,
} from "@cloudify/msbc-frontend";
import { CmsRichText } from "@cloudify/cms";

import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { IMsbcSlice } from "@cloudify/msbc-frontend/src/types/msbcTypes";
import { IPreferenceSlice } from "@cloudify/generic/src/types/preferenceTypes";

const SyncRules = () => {
  const [searchParams] = useSearchParams();

  const {
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  const { isAppConnected } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const {
    fields: { loading: hubspotLoading },
    hubspotUserIds,
  } = useSelector((state: { hubspot: IHubspotSlice }) => state.hubspot);

  const {
    fields: { loading: msbcLoading },
  } = useSelector((state: { msbc: IMsbcSlice }) => state.msbc);

  const dispatch = useDispatch();
  const page = searchParams.get("page");

  const searchFilterOptionKeys: string[] = ["companies", "contacts"];
  const triggerKeys: string[] = ["deals"];

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
    if (
      hubspotUserIds &&
      Object.keys(hubspotUserIds).length > 0 &&
      isAppConnected
    ) {
      dispatch(fetchMsbcFields({ userIds: hubspotUserIds }));
      dispatch(getDefaultMappingFields({ userIds: hubspotUserIds }));
    }
  }, [isAppConnected]);

  useEffect(() => {
    if (hubspotUserIds && Object.keys(hubspotUserIds).length > 0) {
      dispatch(
        fetchStatus({ userIds: hubspotUserIds, triggerAppName: "HubSpot" })
      );
    }
  }, []);

  return (
    <Container>
      {cmsLoading || hubspotLoading || msbcLoading ? (
        <Loading />
      ) : (
        <Row className="d-flex justify-content-between">
          <InstallFlowSyncRules
            page={searchParams.get("page")}
            onShowActiveWindow={onShowActiveWindow}
            actionAppName="Business Central"
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
