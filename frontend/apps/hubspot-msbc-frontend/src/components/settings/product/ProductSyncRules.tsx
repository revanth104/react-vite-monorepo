import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

import {
  ProductSearch,
  ProductNotFound,
  ProductSyncDeal,
  ButtonWithTooltip,
} from "@cloudify/generic";
import { CmsRichText } from "@cloudify/cms";
import { Loading } from "@cloudify/hubspot-frontend";

import CustomProductMapping from "../../install/CustomProductMapping";

import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { IMsbcSlice } from "@cloudify/msbc-frontend/src/types/msbcTypes";

const ProductSyncRules = () => {
  const {
    fields: {
      loading: msbcLoading,
      data: { products, productsSearchFields: actionAppProductSearchFields },
    },
    msbcDefaultFields: {
      loading: defaultFieldsLoading,
      data: { generalProductPostingGroups, productTypes },
    },
  } = useSelector((state: { msbc: IMsbcSlice }) => state.msbc);

  const {
    hubspotUserIds,
    fields: {
      loading: hubspotLoading,
      data: {
        productSearchFields: triggerAppProductSearchFields,
        products: hsProducts,
      },
    },
  } = useSelector((state: { hubspot: IHubspotSlice }) => state.hubspot);

  return (
    <Container className="px-0">
      {msbcLoading || hubspotLoading || defaultFieldsLoading ? (
        <Loading />
      ) : (
        <Row>
          <Col>
            <ProductSearch
              triggerAppName="HubSpot"
              actionAppName="MS business Central"
              actionAppProductSearchFields={actionAppProductSearchFields}
              triggerAppProductSearchFields={triggerAppProductSearchFields}
              CmsRichText={CmsRichText}
              cardCssName="sync-settings-card"
              dropdownCssName="settings-dropdown"
              CustomProductMapping={CustomProductMapping}
              triggerAppProducts={hsProducts}
              actionAppProducts={products}
            />
            <ProductNotFound
              triggerAppName="HubSpot"
              actionAppName="MS business central"
              generalProductPostingGroups={generalProductPostingGroups}
              productTypes={productTypes}
              actionAppProducts={products}
              CmsRichText={CmsRichText}
              cardCssName="sync-settings-card"
              dropdownCssName="settings-dropdown"
              dropdownLabel="item"
            />
            <ProductSyncDeal
              triggerAppName="HubSpot"
              actionAppName="Business Central"
              actionAppProducts={products}
              CmsRichText={CmsRichText}
              cardCssName="sync-settings-card"
              dropdownCssName="settings-dropdown"
              dropdownLabel="Select item"
            />
            <ButtonWithTooltip
              triggerAppName="HubSpot"
              actionAppName="Business Central"
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
