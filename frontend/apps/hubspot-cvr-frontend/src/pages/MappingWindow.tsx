import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Container, Col, Row, Spinner, Tab, Tabs } from "react-bootstrap";
import { fetchMappings, fetchAppFields } from "@cloudify/cvr-frontend";

import {
  CmsEditAndSave,
  fetchCmsData,
  onChangeIsUserAllowed,
} from "@cloudify/cms";
import {
  updateUserIds,
  setShowErrorModal,
  setShowSuccessModal,
  ErrorModal,
  SuccessModal,
  clearDefaultValues,
  storeActiveKey,
} from "@cloudify/cvr-frontend";

import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";
import { IPreferenceSlice } from "@cloudify/cvr-frontend/src/types/preferenceTypes";
import { ICvrMappingSlice } from "@cloudify/cvr-frontend/src/types/cvrMappingTypes";

import CompanyMappings from "../components/mappingWindows/CompanyMappings";
import ContactsMappings from "../components/mappingWindows/ContactsMappings";

const MappingWindow = () => {
  const dispatch = useDispatch();

  const {
    allowedUsers,
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  const {
    mappings: { loading: mappingLoading },
    activeKey: mappingsActiveTab,
  } = useSelector(
    (state: { cvrMapping: ICvrMappingSlice }) => state.cvrMapping
  );

  const { userIds } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (userIds && Object.keys(userIds).length > 0) {
      dispatch(fetchMappings({ userIds }));
    }
  }, [userIds]);

  useEffect(() => {
    if (userIds && Object.keys(userIds).length > 0) {
      dispatch(fetchAppFields({ userIds }));
    }
  }, [userIds]);

  useEffect(() => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (portalId) {
      dispatch(updateUserIds({ portalId, userId }));
    }
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/mappings") {
      dispatch(fetchCmsData());
    }
  }, []);

  useEffect(() => {
    if (allowedUsers.length > 0 && window.location.pathname === "/mappings") {
      dispatch(onChangeIsUserAllowed({ ...userIds, appName: "hubspot" }));
    }
  }, [allowedUsers]);

  return (
    <Container>
      <ErrorModal />
      <SuccessModal />
      {window.location.pathname === "/mappings" && (
        <div>
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

      <Row>
        <Col>
          {cmsLoading || mappingLoading ? (
            <div className="d-flex flex-column justify-content-center align-items-center loading-container">
              <div className="d-flex flex-row justify-content-center align-items-center">
                <Spinner animation="border" variant="primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                {/* <p className="my-1 mx-2 loading-text">Please wait...</p> */}
              </div>
            </div>
          ) : (
            <div className="sync-settings-tabs">
              <Tabs
                defaultActiveKey="companyMappings"
                activeKey={mappingsActiveTab}
                style={{
                  top: `${
                    window.location.pathname === "/setup" ? "70px" : "0px"
                  }`,
                  paddingTop: "20px",
                }}
                onSelect={(selectedKey) => {
                  dispatch(clearDefaultValues());
                  dispatch(storeActiveKey({ activeKey: selectedKey }));
                }}
              >
                <Tab eventKey="companyMappings" title="Company field mappings">
                  <CompanyMappings />
                </Tab>
                <Tab eventKey="contactMappings" title="Contact field mappings">
                  <ContactsMappings />
                </Tab>
              </Tabs>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MappingWindow;
