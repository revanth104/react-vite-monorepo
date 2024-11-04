import React from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  FinancialIframe,
  updateHubspotUserIds,
  fetchHubSpotFields,
} from "@cloudify/hubspot-frontend";
import { fetchFortnoxFields } from "@cloudify/fortnox-frontend";
import { fetchStatus, fetchFinancialData } from "@cloudify/generic";

import { IFortnoxSlice } from "@cloudify/fortnox-frontend/src/types/fortnoxTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";

const FinancialDataIframe = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const {
    fields: {
      loading: actionAppLoading,
      data: { customerSearchFields: actionAppCustomerSearchFields },
    },
  } = useSelector((state: { fortnox: IFortnoxSlice }) => state.fortnox);

  const { hubspotUserIds } = useSelector(
    (state: { hubspot: IHubspotSlice }) => state.hubspot
  );

  useEffect(() => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (portalId) {
      dispatch(updateHubspotUserIds({ portalId, userId }));
    }
  }, []);

  useEffect(() => {
    if (hubspotUserIds && Object.keys(hubspotUserIds).length > 0) {
      dispatch(fetchHubSpotFields({ userIds: hubspotUserIds }));
      dispatch(fetchFortnoxFields({ userIds: hubspotUserIds }));
      dispatch(fetchStatus({ userIds: hubspotUserIds }));
    }
  }, [hubspotUserIds]);

  useEffect(() => {
    const associatedObjectType = searchParams.get("associatedObjectType");
    const objectId = searchParams.get("objectId");
    if (
      hubspotUserIds &&
      Object.keys(hubspotUserIds).length > 0 &&
      objectId &&
      associatedObjectType
    ) {
      dispatch(
        fetchFinancialData({
          userIds: hubspotUserIds,
          objectId: `${associatedObjectType}_${objectId}`,
        })
      );
    }
  }, [hubspotUserIds]);

  return (
    <div>
      <Container className="d-flex flex-row justify-content-center">
        <FinancialIframe
          actionAppName="Fortnox"
          actionAppLoading={actionAppLoading}
          actionAppCustomerSearchFields={actionAppCustomerSearchFields}
        />
      </Container>
    </div>
  );
};

export default FinancialDataIframe;
