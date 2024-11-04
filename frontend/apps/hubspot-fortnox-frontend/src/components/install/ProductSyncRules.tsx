import React from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

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

import CustomProductMapping from "./CustomProductMapping";
import arrowIcon from "../../assets/ArrowDown.svg";

import { IProductSlice } from "@cloudify/generic/src/types/productTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { IFortnoxSlice } from "@cloudify/fortnox-frontend/src/types/fortnoxTypes";

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
        productSearchFields: actionAppProductSearchFields,
        products: fortnoxProducts,
      },
    },
  } = useSelector((state: { fortnox: IFortnoxSlice }) => state.fortnox);

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
          <div className="hs-fortnox-product-search-parameters">
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
                  <label className="">Fortnox</label>
                  <SetupDropdown
                    fieldItems={actionAppProductSearchFields}
                    selectedValue={actionAppProductFilterPreference}
                    onChangeValue={onChangeProductPreferences}
                    dropdownFor="actionAppProductFilterField"
                    dropdownLabel="Fortnox"
                    dropdownWidth="300px"
                    dropdownMenuWidth="250px"
                    cssName="install-flow-dropdown"
                  />
                </div>
              </div>
            </div>
          )}
          {hubspotProducts.length === 0 || fortnoxProducts.length === 0 ? (
            <div className="hs-fortnox-custom-product-mapping">
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip>
                    {renderToolTipContent({
                      triggerAppProducts: hubspotProducts,
                      actionAppProducts: fortnoxProducts,
                      triggerAppName: "HubSpot",
                      actionAppName: "Fortnox",
                    })}
                  </Tooltip>
                }
              >
                <span className="d-inline-block">
                  <Form.Check
                    type="radio"
                    id="setCustomMappings"
                    label="Direct Link: Connect products directly without searching."
                    name="productSearchParameters"
                    value="set custom mappings"
                    className="mt-3"
                    disabled
                  />
                </span>
              </OverlayTrigger>
            </div>
          ) : (
            <div className="hs-fortnox-custom-product-mapping">
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
              <div className="mt-3">
                <CustomProductMapping />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <CmsRichText path="cmsContent.install.productSyncRules.advancedSettings.title" />
      </div>
      <details
        className="mt-3 hs-fortnox-advanced-settings"
        onToggle={(e) =>
          dispatch(
            onUpdateAdvancedStatus({
              status: (e.target as HTMLDetailsElement).open,
            })
          )
        }
      >
        <summary>Advanced settings</summary>
        <div className="mt-3">
          <div className="my-3">
            <CmsRichText
              path="cmsContent.install.productSyncRules.advancedSettings.description"
              cssName="hubspot"
            />
          </div>
          <div className="hs-fortnox-do-not-generate-invoice">
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
          <div className="hs-fortnox-use-default-product">
            <Form.Check
              type="radio"
              id="useDefaultProduct"
              label="Use Default Article: Replace the missing not found product with a predefined Article in Fortnox."
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
              <label className="">Select article</label>
              {fortnoxProducts && fortnoxProducts.length > 0 && (
                <SetupDropdown
                  fieldItems={fortnoxProducts}
                  selectedValue={productPreference}
                  onChangeValue={onChangeProductPreferences}
                  dropdownFor="products"
                  cssName="install-flow-dropdown"
                  dropdownLabel="article"
                />
              )}
            </div>
          )}
        </div>
        <div className="mt-3">
          <div className="hs-fortnox-find-create-product">
            <Form.Check
              type="radio"
              id="findCreateProduct"
              label="Create new Article in Fortnox"
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
            <div className="mt-2 ms-4">
              <CmsRichText
                path="cmsContent.install.productSyncRules.createNewProduct"
                cssName="hubspot"
              />
            </div>
          )}
        </div>
      </details>
      <hr className="my-4" />
      <div className="my-4 hs-fortnox-deal-without-products">
        <div>
          <CmsRichText
            path="cmsContent.install.productSyncRules.missingLineItems.title"
            cssName="hubspot"
          />
        </div>
        <Form.Check
          type="checkbox"
          id="dealSyncInstall"
          label="Sync deals which do not have products associated with them"
          checked={dealsSyncCheckbox}
          onChange={() => dispatch(onChangeDealsSyncCheckbox())}
        />
        {dealsSyncCheckbox && (
          <div className="mt-4">
            <CmsRichText
              path="cmsContent.install.productSyncRules.missingLineItems.description"
              cssName="hubspot"
            />
            {fortnoxProducts && fortnoxProducts.length > 0 ? (
              <div className="mt-3">
                <SetupDropdown
                  fieldItems={fortnoxProducts}
                  dropdownFor="dealSyncProduct"
                  selectedValue={dealSyncProductPreference}
                  onChangeValue={onChangeProductPreferences}
                  cssName="install-flow-dropdown"
                />
              </div>
            ) : (
              <div className="note-container d-flex flex-row justify-content-center">
                <h5 style={{ marginBottom: "0px", fontSize: "18px" }}>
                  Products not present in Fortnox.
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
