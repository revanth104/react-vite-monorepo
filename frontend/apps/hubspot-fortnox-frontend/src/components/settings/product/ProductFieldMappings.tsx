import React from "react";
import { useSelector } from "react-redux";

import { MappingWindow } from "@cloudify/generic";
import { HbSideBar } from "@cloudify/hubspot-frontend";
import { CmsRichText } from "@cloudify/cms";

import { IMappingSlice } from "@cloudify/generic/src/types/mappingTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { IFortnoxSlice } from "@cloudify/fortnox-frontend/src/types/fortnoxTypes";

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
      data: { productFieldMappings: fortnoxProductFields },
    },
  } = useSelector((state: { fortnox: IFortnoxSlice }) => state.fortnox);

  const triggerAppObject = {
    products: productFieldMappings,
  };

  const actionAppObject = {
    products: fortnoxProductFields,
  };

  const labels: { [k: string]: string } = {
    actionApp: "Fortnox Fields",
    triggerApp: "HubSpot Fields",
  };

  return (
    <div>
      <div className="my-4">
        <CmsRichText
          path="cmsContent.settings.products.fieldMappings"
          cssName="hubspot"
        />
      </div>
      {productFields &&
        productFieldMappings &&
        productFieldMappings.length > 0 &&
        fortnoxProductFields &&
        fortnoxProductFields.length > 0 && (
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
