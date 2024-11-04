import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  FinancialIframe,
  updateHubspotUserIds,
  fetchHubSpotFields,
} from "@cloudify/hubspot-frontend";
import { fetchMsbcFields } from "@cloudify/msbc-frontend";
import { fetchStatus, fetchFinancialData } from "@cloudify/generic";

import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { IMsbcSlice } from "@cloudify/msbc-frontend/src/types/msbcTypes";

const FinancialDataIframe = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const {
    fields: {
      loading: actionAppLoading,
      data: { customerSearchFields: actionAppCustomerSearchFields },
    },
  } = useSelector((state: { msbc: IMsbcSlice }) => state.msbc);

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
      dispatch(fetchMsbcFields({ userIds: hubspotUserIds }));
      dispatch(fetchStatus({ userIds: hubspotUserIds }));
    }
  }, [hubspotUserIds]);

  useEffect(() => {
    const objectId = searchParams.get("objectId");
    const associatedObjectType = searchParams.get("associatedObjectType");
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
          actionAppName="Microsoft Business Central"
          actionAppLoading={actionAppLoading}
          actionAppCustomerSearchFields={actionAppCustomerSearchFields}
        />
      </Container>
    </div>
  );
};

export default FinancialDataIframe;
