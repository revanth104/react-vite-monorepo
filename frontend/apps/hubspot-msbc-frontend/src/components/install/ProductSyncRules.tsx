import React from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import CustomProductMapping from "./CustomProductMapping";
import arrowIcon from "../../assets/ArrowDown.svg";

import {
  onChangePreferenceForSearchParameters,
  onChangeProductPreferences,
  onChangePreferenceForProducts,
  SetupDropdown,
  onUpdateAdvancedStatus,
  onChangeDealsSyncCheckbox,
  renderToolTipContent,
} from "@cloudify/generic";
import { CmsRichText } from "@cloudify/cms";

import { IProductSlice } from "@cloudify/generic/src/types/productTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { IMsbcSlice } from "@cloudify/msbc-frontend/src/types/msbcTypes";

const ProductSyncRules = () => {
  const dispatch = useDispatch();

  const {
    preferenceForProducts,
    preferenceForSearchParameters,
    productPreference,
    triggerAppProductFilterPreference,
    actionAppProductFilterPreference,
    dealsSyncCheckbox,
    dealSyncProductPreference,
    generalProductPostingGroupPreference,
    productTypePreference,
  } = useSelector((state: { products: IProductSlice }) => state.products);

  const {
    fields: {
      data: {
        productSearchFields: triggerAppProductSearchFields,
        products: hubspotProducts,
      },
    },
  } = useSelector((state: { hubspot: IHubspotSlice }) => state.hubspot);

  const {
    fields: {
      data: {
        productsSearchFields: actionAppProductSearchFields,
        products: msbcProducts,
      },
    },
    msbcDefaultFields: {
      data: { generalProductPostingGroups, productTypes },
    },
  } = useSelector((state: { msbc: IMsbcSlice }) => state.msbc);

  return (
    <div>
      <div>
        <CmsRichText
          path="cmsContent.install.productSyncRules.headerContent"
          cssName="hubspot"
        />
      </div>
      <div className="mt-4">
        <div>
          <div className="install-product-search-parameters">
            <Form.Check
              type="radio"
              id="selectSearchParameters"
              label="Simple Search: Match products using a specific field."
              name="productSearchParameters"
              value="select search parameters"
              className="mb-2"
              checked={
                preferenceForSearchParameters === "select search parameters"
              }
              onChange={(e) => {
                dispatch(
                  onChangePreferenceForSearchParameters({
                    selected: e.target.value,
                  })
                );
              }}
            />
          </div>
          {preferenceForSearchParameters === "select search parameters" && (
            <div className="ms-4">
              <CmsRichText
                path="cmsContent.install.productSyncRules.searchParameters"
                cssName="hubspot"
              />
              <div className="d-flex flex-row mt-3">
                <div>
                  <label className="">Hubspot</label>
                  <SetupDropdown
                    fieldItems={triggerAppProductSearchFields}
                    selectedValue={triggerAppProductFilterPreference}
                    onChangeValue={onChangeProductPreferences}
                    dropdownFor="triggerAppProductFilterField"
                    dropdownLabel="HubSpot"
                    dropdownWidth="300px"
                    dropdownMenuWidth="250px"
                    cssName="install-flow-dropdown"
                  />
                </div>
                <div className="mx-3" style={{ marginTop: "38px" }}>
                  <img src={arrowIcon} alt="arrow icon" className="mt-2" />
                </div>
                <div>
                  <label className="">MS business central</label>
                  <SetupDropdown
                    fieldItems={actionAppProductSearchFields}
                    selectedValue={actionAppProductFilterPreference}
                    onChangeValue={onChangeProductPreferences}
                    dropdownFor="actionAppProductFilterField"
                    dropdownLabel="Business Central"
                    dropdownWidth="300px"
                    dropdownMenuWidth="250px"
                    cssName="install-flow-dropdown"
                  />
                </div>
              </div>
            </div>
          )}
          {hubspotProducts.length === 0 || msbcProducts.length === 0 ? (
            <div className="install-custom-product-mapping">
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip>
                    {renderToolTipContent({
                      triggerAppProducts: hubspotProducts,
                      actionAppProducts: msbcProducts,
                      triggerAppName: "HubSpot",
                      actionAppName: "Business Central",
                    })}
                  </Tooltip>
                }
              >
                <Form.Check
                  type="radio"
                  id="setCustomMappings"
                  label="Direct Link: Connect products directly without searching."
                  name="productSearchParameters"
                  value="set custom mappings"
                  className="mt-3"
                  disabled
                />
              </OverlayTrigger>
            </div>
          ) : (
            <div className="install-custom-product-mapping">
              <Form.Check
                type="radio"
                id="setCustomMappings"
                label="Direct Link: Connect products directly without searching."
                name="productSearchParameters"
                value="set custom mappings"
                className="mt-3"
                checked={
                  preferenceForSearchParameters === "set custom mappings"
                }
                onChange={(e) => {
                  dispatch(
                    onChangePreferenceForSearchParameters({
                      selected: e.target.value,
                    })
                  );
                }}
              />
            </div>
          )}

          {preferenceForSearchParameters === "set custom mappings" && (
            <div className="ms-4 my-2">
              <CmsRichText
                path="cmsContent.install.productSyncRules.customProductMapping"
                cssName="hubspot"
              />
              <CustomProductMapping />
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <CmsRichText path="cmsContent.install.productSyncRules.advancedSettings.title" />
      </div>
      <details
        className="mt-4 install-advanced-settings"
        onToggle={(e) =>
          dispatch(
            onUpdateAdvancedStatus({
              status: (e.target as HTMLDetailsElement).open,
            })
          )
        }
      >
        <summary>Advanced settings</summary>
        <div className="my-3">
          <CmsRichText
            path="cmsContent.install.productSyncRules.advancedSettings.description"
            cssName="hubspot"
          />
        </div>
        <div className="mt-3">
          <div className="install-do-not-generate-invoice">
            <Form.Check
              type="radio"
              id="doNotGenerateInvoice"
              label="Skip Invoice Generation: Don't create an invoice if the product isn't found."
              name="productPreference"
              value="do not generate invoice"
              checked={preferenceForProducts === "do not generate invoice"}
              onChange={(e) => {
                dispatch(
                  onChangePreferenceForProducts({
                    selected: e.target.value,
                  })
                );
              }}
            />
          </div>
          {preferenceForProducts === "do not generate invoice" && (
            <div className="ms-4">
              <CmsRichText
                path="cmsContent.install.productSyncRules.invoiceGeneration"
                cssName="hubspot"
              />
            </div>
          )}
        </div>
        <div className="mt-3">
          <div className="install-use-default-product">
            <Form.Check
              type="radio"
              id="useDefaultProduct"
              label="Use a Default item: Replace the not-found product with a predefined item in Microsoft Business Central."
              name="productPreference"
              value="select product"
              checked={preferenceForProducts === "select product"}
              onChange={(e) => {
                dispatch(
                  onChangePreferenceForProducts({
                    selected: e.target.value,
                  })
                );
              }}
            />
          </div>
          {preferenceForProducts === "select product" && (
            <div className="mt-2 ms-4">
              <CmsRichText
                path="cmsContent.install.productSyncRules.defaultProduct"
                cssName="hubspot"
              />
              <label className="">Select item</label>
              {msbcProducts && msbcProducts.length > 0 && (
                <SetupDropdown
                  fieldItems={msbcProducts}
                  selectedValue={productPreference}
                  onChangeValue={onChangeProductPreferences}
                  dropdownFor="products"
                  cssName="install-flow-dropdown"
                  dropdownLabel="Select item"
                />
              )}
            </div>
          )}
        </div>
        <div className="mt-3">
          <div className="install-find-create-product">
            <Form.Check
              type="radio"
              id="findCreateProduct"
              label="Create a new item in Microsoft Business Central"
              name="productPreference"
              value="find create product"
              checked={preferenceForProducts === "find create product"}
              onChange={(e) => {
                dispatch(
                  onChangePreferenceForProducts({
                    selected: e.target.value,
                  })
                );
              }}
            />
          </div>
          {preferenceForProducts === "find create product" && (
            <>
              <div className="ms-4 mt-2">
                <CmsRichText
                  path="cmsContent.install.productSyncRules.createNewProduct"
                  cssName="hubspot"
                />
                {generalProductPostingGroups && (
                  <div className="mt-2">
                    <label>Select General Product Posting Groups</label>
                    <SetupDropdown
                      fieldItems={generalProductPostingGroups}
                      selectedValue={generalProductPostingGroupPreference}
                      dropdownFor="defaultFields"
                      dropdownLabel="general product posting group"
                      onChangeValue={onChangeProductPreferences}
                      cssName="install-flow-dropdown"
                    />
                  </div>
                )}
              </div>
              <div className="ms-4 mt-3">
                {productTypes && (
                  <div className="mt-2">
                    <label>Select Product Types</label>
                    <SetupDropdown
                      fieldItems={productTypes}
                      selectedValue={productTypePreference}
                      dropdownFor="defaultFields"
                      dropdownLabel="product type"
                      onChangeValue={onChangeProductPreferences}
                      cssName="install-flow-dropdown"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </details>
      <hr className="my-4" />
      <div className="my-4 install-deal-without-products">
        <div>
          <CmsRichText
            path="cmsContent.install.productSyncRules.missingLineItems.title"
            cssName="hubspot"
          />
        </div>
        <Form.Check
          type="checkbox"
          id="dealSyncInstall"
          label="Sync deals which do not have products associated with the them"
          checked={dealsSyncCheckbox}
          onChange={() => dispatch(onChangeDealsSyncCheckbox())}
        />
        {dealsSyncCheckbox && (
          <div className="mt-3">
            <CmsRichText
              path="cmsContent.install.productSyncRules.missingLineItems.description"
              cssName="hubspot"
            />
            {msbcProducts && msbcProducts.length > 0 ? (
              <div className="mt-3">
                <SetupDropdown
                  fieldItems={msbcProducts}
                  dropdownFor="dealSyncProduct"
                  selectedValue={dealSyncProductPreference}
                  onChangeValue={onChangeProductPreferences}
                  cssName="install-flow-dropdown"
                  dropdownLabel="Select item"
                />
              </div>
            ) : (
              <div className="note-container d-flex flex-row justify-content-center">
                <h5 style={{ marginBottom: "0px", fontSize: "18px" }}>
                  Products not present in MS Business Central.
                </h5>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSyncRules;
