import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

import CustomProductMapping from "../../install/CustomProductMapping";

import {
  ProductSearch,
  ProductNotFound,
  ProductSyncDeal,
  ButtonWithTooltip,
} from "@cloudify/generic";
import { CmsRichText } from "@cloudify/cms";
import { Loading } from "@cloudify/hubspot-frontend";

import { IFortnoxSlice } from "@cloudify/fortnox-frontend/src/types/fortnoxTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";

const ProductSyncRules = () => {
  const {
    fields: {
      loading: fortnoxLoading,
      data: { products, productSearchFields: actionAppProductSearchFields },
    },
  } = useSelector((state: { fortnox: IFortnoxSlice }) => state.fortnox);

  const {
    hubspotUserIds,
    fields: {
      loading: hubspotLoading,
      data: {
        productSearchFields: triggerAppProductSearchFields,
        products: hubspotProducts,
      },
    },
  } = useSelector((state: { hubspot: IHubspotSlice }) => state.hubspot);

  return (
    <Container className="px-0">
      {fortnoxLoading || hubspotLoading ? (
        <Loading />
      ) : (
        <Row>
          <Col>
            <ProductSearch
              triggerAppName="HubSpot"
              actionAppName="Fortnox"
              actionAppProductSearchFields={actionAppProductSearchFields}
              triggerAppProductSearchFields={triggerAppProductSearchFields}
              CmsRichText={CmsRichText}
              cardCssName="sync-settings-card"
              dropdownCssName="settings-dropdown"
              CustomProductMapping={CustomProductMapping}
              actionAppProducts={products}
              triggerAppProducts={hubspotProducts}
            />
            <ProductNotFound
              triggerAppName="HubSpot"
              actionAppName="Fortnox"
              CmsRichText={CmsRichText}
              cardCssName="sync-settings-card"
              dropdownCssName="settings-dropdown"
              actionAppProducts={products}
              dropdownLabel="article"
            />
            <ProductSyncDeal
              triggerAppName="HubSpot"
              actionAppName="Fortnox"
              actionAppProducts={products}
              CmsRichText={CmsRichText}
              cardCssName="sync-settings-card"
              dropdownCssName="settings-dropdown"
              dropdownLabel="article"
            />
            <ButtonWithTooltip
              actionAppName="Fortnox"
              triggerAppName="HubSpot"
              savePreferencesFor="productSyncRules"
              preferenceType="productSync"
              userIds={hubspotUserIds}
              disableBtnCssName="hb-disabled-btn"
              btnCssName="hb-save-changes-btn"
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ProductSyncRules;
