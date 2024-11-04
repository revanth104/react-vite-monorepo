import React, { useState } from "react";
import { Col, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { PiCaretRightBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { onChangeProgress } from "../slice/hubspotSlice";
import { IHubspotSlice } from "../types/types";
import HorizontalProgressBar from "./HorizontalProgressbar";
import HbButton from "./HbButton";

import {
  invoiceSyncRulesSave,
  saveCustomerSyncRules,
  saveProductSyncRules,
  checkProductMappingsCount,
} from "@cloudify/generic";
import { IMappingSlice } from "@cloudify/generic/src/types/mappingTypes";
import installFlowTooltip from "../helpers/installFlowTooltip";

import { IInvoiceSlice } from "@cloudify/generic/src/types/invoiceTypes";
import { IContactSlice } from "@cloudify/generic/src/types/contactTypes";
import { IProductSlice } from "@cloudify/generic/src/types/productTypes";

type TInstallFlowSyncRulesProps = {
  onShowActiveWindow: () => JSX.Element;
  page: string;
  actionAppName: string;
  searchFilterOptionKeys: string[];
  triggerKeys: string[];
  progressBarLabels: {
    [key: string]: string;
  };
};

const InstallFlowSyncRules = (props: TInstallFlowSyncRulesProps) => {
  const {
    onShowActiveWindow,
    page,
    actionAppName,
    searchFilterOptionKeys,
    triggerKeys,
    progressBarLabels,
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const { progress, hubspotUserIds } = useSelector(
    (state: { hubspot: IHubspotSlice }) => state.hubspot
  );

  const { selectedPipelines, attachPDFToInvoice } = useSelector(
    (state: { invoice: IInvoiceSlice }) => state.invoice
  );

  const {
    actionAppCompanyFilterPreference,
    triggerAppCompanyFilterPreference,
    customerNumberPreference,
    triggerAppCompanyNumberPreference,
    triggerAppContactFilterPreference,
    actionAppContactFilterPreference,
    triggerAppContactNumberPreference,
    isContactCheckbox,
    isVatIncluded,
  } = useSelector((state: { contact: IContactSlice }) => state.contact);

  const {
    preferenceForProducts,
    productPreference,
    preferenceForCreatingProduct,
    defaultProductForCreating,
    preferenceForSearchParameters,
    triggerAppProductFilterPreference,
    actionAppProductFilterPreference,
    productGroupPreference,
    generalProductPostingGroupPreference,
    productTypePreference,
    dealSyncProductPreference,
    dealsSyncCheckbox,
  } = useSelector((state: { products: IProductSlice }) => state.products);

  const {
    mapping: {
      defaultMappings: { products: productMappings },
    },
  } = useSelector((state: { mappings: IMappingSlice }) => state.mappings);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const nextNavigation = () => {
    const portalId = hubspotUserIds.portalId;
    const userId = hubspotUserIds.userId;
    if (page === "invoiceSyncRules") {
      navigate(
        `../${window.location.pathname}?portalId=${portalId}&userId=${userId}&page=customerSearchRules`
      );
      dispatch(
        onChangeProgress({
          "Customer Preferences": true,
        })
      );
    } else if (page === "customerSearchRules") {
      navigate(
        `../${window.location.pathname}?portalId=${portalId}&userId=${userId}&page=productSyncRules`
      );
      dispatch(
        onChangeProgress({
          "Product Sync Rules": true,
        })
      );
    }
  };

  const backNavigation = () => {
    const portalId = hubspotUserIds.portalId;
    const userId = hubspotUserIds.userId;
    if (page === "productSyncRules") {
      navigate(
        `../${window.location.pathname}?portalId=${portalId}&userId=${userId}&page=customerSearchRules`
      );
      dispatch(
        onChangeProgress({
          "Product Sync Rules": false,
        })
      );
    } else {
      navigate(
        `../${window.location.pathname}?portalId=${portalId}&userId=${userId}&page=invoiceSyncRules`
      );
      dispatch(
        onChangeProgress({
          "Customer Preferences": false,
        })
      );
    }
  };
  const goToHubspot = () => {
    window.open(
      `https://app.hubspot.com/contacts/${hubspotUserIds.portalId}/companies`,
      "_self"
    );
  };
  const onSavePreferences = async () => {
    if (page === "invoiceSyncRules") {
      await invoiceSyncRulesSave({
        setIsLoading,
        dispatch,
        selectedPipelines,
        attachPDFToInvoice,
        triggerKeys,
        userIds: hubspotUserIds,
        notification: false,
      });
    } else if (page === "customerSearchRules") {
      await saveCustomerSyncRules({
        setIsLoading,
        userIds: hubspotUserIds,
        actionAppCompanyFilterPreference,
        triggerAppCompanyFilterPreference,
        customerNumberPreference,
        triggerAppCompanyNumberPreference,
        triggerAppContactFilterPreference,
        actionAppContactFilterPreference,
        triggerAppContactNumberPreference,
        isContactCheckbox,
        isVatIncluded,
        searchFilterOptionKeys,
        dispatch,
        notification: false,
      });
    } else if (page === "productSyncRules") {
      await saveProductSyncRules({
        setIsLoading,
        userIds: hubspotUserIds,
        preferenceForProducts,
        productPreference,
        preferenceForCreatingProduct,
        defaultProductForCreating,
        preferenceForSearchParameters,
        triggerAppProductFilterPreference,
        actionAppProductFilterPreference,
        dealsSyncCheckbox,
        dealSyncProductPreference,
        actionAppName,
        dispatch,
        notification: false,
        ...(actionAppName === "e-conomic" ? { productGroupPreference } : {}),
        ...(actionAppName === "Business Central"
          ? { generalProductPostingGroupPreference, productTypePreference }
          : {}),
      });
      goToHubspot();
    }
  };

  return (
    <Col md={7} className="sync-rules-container p-5">
      <HorizontalProgressBar
        progress={progress}
        progressBarLabels={progressBarLabels}
      />
      {onShowActiveWindow()}
      <div
        className={`d-flex mt-5 ${
          page === "invoiceSyncRules"
            ? "justify-content-end"
            : "justify-content-between"
        }`}
      >
        {page !== "invoiceSyncRules" && (
          <HbButton
            text="Back"
            click={backNavigation}
            withArrow={true}
            outlineButton={true}
          />
        )}
        {page === "productSyncRules" &&
        ((preferenceForSearchParameters === "set custom mappings" &&
          checkProductMappingsCount({ productMappings }) === 0) ||
          (preferenceForProducts === "select product" && !productPreference) ||
          (preferenceForProducts === "find create product" &&
            actionAppName === "e-conomic" &&
            !productGroupPreference) ||
          (dealsSyncCheckbox && !dealSyncProductPreference)) ? (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip style={{ fontSize: "12px" }}>
                {installFlowTooltip({
                  page,
                  preferenceForProducts,
                  productPreference,
                  actionAppName,
                  productGroupPreference,
                  preferenceForSearchParameters,
                  checkProductMappingsCount,
                  productMappings,
                  dealsSyncCheckbox,
                  dealSyncProductPreference,
                })}
              </Tooltip>
            }
          >
            <Button className="hb-button hb-button-disabled">
              {page !== "productSyncRules" ? "Next" : "Finish"}
              {page !== "productSyncRules" && (
                <PiCaretRightBold size={16} color="#fff" className="ms-2" />
              )}
            </Button>
          </OverlayTrigger>
        ) : (
          <Button
            onClick={() => {
              nextNavigation();
              onSavePreferences();
            }}
            className="hb-button"
          >
            {page !== "productSyncRules" ? "Next" : "Finish"}
            {page !== "productSyncRules" && (
              <PiCaretRightBold size={16} color="#fff" className="ms-2" />
            )}
          </Button>
        )}
      </div>
    </Col>
  );
};

export default InstallFlowSyncRules;
