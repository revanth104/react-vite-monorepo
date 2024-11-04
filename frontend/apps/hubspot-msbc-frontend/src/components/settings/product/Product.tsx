import React, { useEffect } from "react";
import { Tabs, Tab, OverlayTrigger, Tooltip } from "react-bootstrap";
import ProductSyncRules from "./ProductSyncRules";
import ProductFieldMappings from "./ProductFieldMappings";
import { useSelector, useDispatch } from "react-redux";

import {
  onChangeProductActiveTab,
  clearDefaultValues,
  updateGuideSteps,
  updateSettingsStoredKey,
  updateShowSettingsTour,
} from "@cloudify/generic";

import { IMappingSlice } from "@cloudify/generic/src/types/mappingTypes";
import { IPreferenceSlice } from "@cloudify/generic/src/types/preferenceTypes";
import { IProductSlice } from "@cloudify/generic/src/types/productTypes";

import { productSyncRulesSteps } from "../../../helpers/steps/settings";

const Product = () => {
  const dispatch = useDispatch();
  const {
    productActiveTab,
    isAppConnected,
    settingsActiveTab,
    settingsStoredKey,
  } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const { isProductSyncRulesSaved, preferenceForProducts } = useSelector(
    (state: { products: IProductSlice }) => state.products
  );

  const {
    isMappingSaved,
    mapping: { loading: statusLoading },
  } = useSelector((state: { mappings: IMappingSlice }) => state.mappings);

  useEffect(() => {
    // Updates the settings stored key
    if (settingsActiveTab === "product" && productActiveTab) {
      dispatch(
        updateSettingsStoredKey({
          key: `hs_msbc_settings_${settingsActiveTab}_${productActiveTab}`,
        })
      );
    }
  }, [productActiveTab, settingsActiveTab]);

  useEffect(() => {
    // Enables or disables tour guide
    if (settingsActiveTab === "product" && productActiveTab) {
      const isTourGuide = localStorage.getItem(settingsActiveTab);

      !isTourGuide || isTourGuide === "false"
        ? dispatch(updateShowSettingsTour({ value: false }))
        : dispatch(updateShowSettingsTour({ value: true }));
    }
  }, [productActiveTab, settingsStoredKey]);

  useEffect(() => {
    // Updates the guide steps
    if (settingsActiveTab === "product") {
      if (productActiveTab === "syncRules") {
        dispatch(updateGuideSteps({ steps: productSyncRulesSteps }));
      } else {
        dispatch(updateGuideSteps({ steps: [] }));
      }
    }
  }, [productActiveTab, settingsActiveTab]);

  return (
    <div className="mt-2 settings-nested-tabs">
      <Tabs
        style={{ top: "69px" }}
        activeKey={productActiveTab}
        defaultActiveKey="syncRules"
        onSelect={(selectedKey) => {
          dispatch(clearDefaultValues());
          dispatch(
            onChangeProductActiveTab({
              selectedTab: selectedKey,
              isAppConnected,
              isProductSyncRulesSaved,
              isProductFieldMappingsSaved: isMappingSaved?.productFields,
              setupLoading: statusLoading,
            })
          );
          window.scrollTo(0, 0);
        }}
      >
        <Tab
          eventKey="syncRules"
          title={
            <span className="product-sync-rules-tab">Product sync rules</span>
          }
        >
          <ProductSyncRules />
        </Tab>
        {preferenceForProducts === "find create product" ? (
          <Tab eventKey="fieldMappings" title="Product field mappings">
            <ProductFieldMappings />
          </Tab>
        ) : (
          <Tab
            title={
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip style={{ fontSize: "12px" }}>
                    Product field mapping only applicable when Product creation
                    is selected in the case product is not found
                  </Tooltip>
                }
              >
                <span>Product field mappings</span>
              </OverlayTrigger>
            }
          ></Tab>
        )}
      </Tabs>
    </div>
  );
};

export default Product;
