import React from "react";
import { useSelector } from "react-redux";

import { MappingWindow } from "@cloudify/generic";
import { Loading } from "@cloudify/hubspot-frontend";

import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { IMappingSlice } from "@cloudify/generic/src/types/mappingTypes";
import { IMsbcSlice } from "@cloudify/msbc-frontend/src/types/msbcTypes";

const CustomProductMapping = () => {
  const {
    mapping: {
      loading,
      defaultMappings: { products },
    },
  } = useSelector((state: { mappings: IMappingSlice }) => state.mappings);

  const {
    fields: {
      loading: hsLoading,
      data: { products: hsProduct },
    },
    hubspotUserIds,
  } = useSelector((state: { hubspot: IHubspotSlice }) => state.hubspot);

  const {
    fields: {
      loading: msbcLoading,
      data: { products: msbcProduct },
    },
  } = useSelector((state: { msbc: IMsbcSlice }) => state.msbc);

  const triggerAppObject = {
    products: hsProduct,
  };

  const actionAppObject = {
    products: msbcProduct,
  };

  const labels: { [k: string]: string } = {
    actionApp: "MS business central items",
    triggerApp: "HubSpot products",
  };

  const toggleText = () => {
    if (
      products &&
      hsProduct &&
      hsProduct.length === 0 &&
      msbcProduct &&
      msbcProduct.length === 0
    ) {
      return "Products are not present in both HubSpot and MS Business Central";
    } else if (msbcProduct && msbcProduct.length === 0) {
      return "Products are not present in MS Business Central";
    } else if (hsProduct && hsProduct.length === 0) {
      return "Products not present in HubSpot";
    }
  };

  return (
    <div>
      {!loading || !msbcLoading || !hsLoading ? (
        <>
          {products &&
          hsProduct &&
          hsProduct.length > 0 &&
          msbcProduct &&
          msbcProduct.length > 0 ? (
            <MappingWindow
              mappings={products}
              primaryTriggerAppObjectKey="products"
              triggerAppObject={triggerAppObject}
              actionAppObject={actionAppObject}
              mappingsFor="products"
              labels={labels}
              cssClass="mapping-window"
              userIds={hubspotUserIds}
            />
          ) : (
            <div className="note-container d-flex flex-row justify-content-center">
              <h5 style={{ marginBottom: "0px", fontSize: "18px" }}>
                {toggleText()}
              </h5>
            </div>
          )}
        </>
      ) : (
        <div className="d-flex flex-row justify-content-center">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default CustomProductMapping;
