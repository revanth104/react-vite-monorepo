import React from "react";
import { useSelector } from "react-redux";

import { HbSideBar } from "@cloudify/hubspot-frontend";
import { CmsRichText } from "@cloudify/cms";
import { MappingWindow } from "@cloudify/generic";

import { IMappingSlice } from "@cloudify/generic/src/types/mappingTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { IMsbcSlice } from "@cloudify/msbc-frontend/src/types/msbcTypes";

const ProductFieldMappings = () => {
  const {
    mapping: {
      defaultMappings: { productFields },
    },
  } = useSelector((state: { mappings: IMappingSlice }) => state.mappings);

  const {
    fields: {
      data: { productFields: productFieldMappings },
    },
    hubspotUserIds,
  } = useSelector((state: { hubspot: IHubspotSlice }) => state.hubspot);

  const {
    fields: {
      data: { productFieldMappings: msbcProductFields },
    },
  } = useSelector((state: { msbc: IMsbcSlice }) => state.msbc);

  const triggerAppObject = {
    products: productFieldMappings,
  };

  const actionAppObject = {
    products: msbcProductFields,
  };

  const labels: { [k: string]: string } = {
    actionApp: "MS business central items",
    triggerApp: "HubSpot products",
  };

  return (
    <div>
      <div className="my-4">
        <CmsRichText
          path="cmsContent.settings.products.productFieldMappings"
          cssName="hubspot"
        />
      </div>
      {productFields &&
        productFieldMappings &&
        productFieldMappings.length > 0 &&
        msbcProductFields &&
        msbcProductFields.length > 0 && (
          <MappingWindow
            mappings={productFields}
            primaryTriggerAppObjectKey="products"
            triggerAppObject={triggerAppObject}
            actionAppObject={actionAppObject}
            mappingsFor="productFields"
            labels={labels}
            cssClass="mapping-window"
            SideBar={HbSideBar}
            userIds={hubspotUserIds}
          />
        )}
    </div>
  );
};

export default ProductFieldMappings;
