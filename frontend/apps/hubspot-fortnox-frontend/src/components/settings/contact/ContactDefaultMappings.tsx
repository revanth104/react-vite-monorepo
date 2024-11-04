import React, { useState } from "react";
import {
  Card,
  Col,
  Container,
  Button,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import { TextWithTooltip, Loading } from "@cloudify/hubspot-frontend";
import { SetupDropdown } from "@cloudify/generic";
import { CmsRichText } from "@cloudify/cms";
import {
  onChangeFortnoxDefaultMappings,
  saveContactDefaultMappings,
  showTooltipText,
} from "@cloudify/fortnox-frontend";

import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";
import { IFortnoxSlice } from "@cloudify/fortnox-frontend/src/types/fortnoxTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";

const ContactDefaultMappings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    fortnoxDefaultMappings: {
      loading: fortnoxLoading,
      data: {
        paymentTerms,
        currencies,
        priceLists,
        deliveryWays,
        deliveryTerms,
        vatTypes,
        languages,
      },
    },
    defaultMappings: {
      paymentTermPreference,
      currencyPreference,
      languagePreference,
      listOfPricePreference,
      termsOfDeliveryPreference,
      waysOfDeliveryPreference,
      vatTypePreference,
    },
  } = useSelector((state: { fortnox: IFortnoxSlice }) => state.fortnox);

  const { hubspotUserIds } = useSelector(
    (state: { hubspot: IHubspotSlice }) => state.hubspot
  );

  const {
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  return (
    <Container className="px-0">
      {cmsLoading || fortnoxLoading ? (
        <Loading />
      ) : (
        <>
          <Card className="sync-settings-card" style={{ marginTop: "29px" }}>
            <Card.Body className="sync-settings-card-body">
              <div>
                <CmsRichText
                  path="cmsContent.settings.contacts.defaultMappings"
                  cssName="hubspot"
                />
                <Col sm={5} lg={3} className="mt-4 fortnox-payment-terms">
                  <TextWithTooltip
                    label="Select Payment Terms"
                    tooltipText="Payment terms define the amount of time the customer has to pay the invoice. Setting a default allows for consistent, streamlined invoicing and impacts cash flow."
                  />
                  {paymentTerms && paymentTerms.length > 0 && (
                    <SetupDropdown
                      fieldItems={paymentTerms}
                      selectedValue={paymentTermPreference}
                      onChangeValue={onChangeFortnoxDefaultMappings}
                      dropdownFor="defaultFields"
                      dropdownLabel="payment terms"
                      cssName="settings-dropdown"
                    />
                  )}
                </Col>
                <Col sm={5} lg={3} className="mt-4 fortnox-currenies">
                  <TextWithTooltip
                    label="Select Currency"
                    tooltipText="Establishing a default currency is crucial to avoid discrepancies and confusion in transaction values, especially for businesses dealing with international customers."
                  />
                  {currencies && currencies.length > 0 && (
                    <SetupDropdown
                      fieldItems={currencies}
                      selectedValue={currencyPreference}
                      onChangeValue={onChangeFortnoxDefaultMappings}
                      dropdownFor="defaultFields"
                      dropdownLabel="currency"
                      cssName="settings-dropdown"
                    />
                  )}
                </Col>
                <Col sm={5} lg={3} className="mt-4 fortnox-price-list">
                  <TextWithTooltip
                    label="Select Price List"
                    tooltipText="Default price list ensures that the correct pricing structure is consistently applied to all new customers, maintaining pricing coherence and integrity."
                  />
                  {priceLists && priceLists.length > 0 && (
                    <SetupDropdown
                      fieldItems={priceLists}
                      selectedValue={listOfPricePreference}
                      onChangeValue={onChangeFortnoxDefaultMappings}
                      dropdownFor="defaultFields"
                      dropdownLabel="price list"
                      cssName="settings-dropdown"
                    />
                  )}
                </Col>
                <Col sm={5} lg={3} className="mt-4 fortnox-deliver-ways">
                  <TextWithTooltip
                    label="Select Delivery Ways"
                    tooltipText="This determines the default method by which goods or services will be delivered to the customer. Establishing this ensures that there is a standard, preferred way of delivering orders."
                  />
                  {deliveryWays && deliveryWays.length > 0 && (
                    <SetupDropdown
                      fieldItems={deliveryWays}
                      selectedValue={waysOfDeliveryPreference}
                      onChangeValue={onChangeFortnoxDefaultMappings}
                      dropdownFor="defaultFields"
                      dropdownLabel="delivery ways"
                      cssName="settings-dropdown"
                    />
                  )}
                </Col>
                <Col sm={5} lg={3} className="mt-4 fortnox-delivery-terms">
                  <TextWithTooltip
                    label="Select Delivery Terms"
                    tooltipText="Delivery terms are important for clarifying the responsibilities of the buyer and seller with regards to the delivery of goods, thus preventing any potential disputes and misunderstandings."
                  />
                  {deliveryTerms && deliveryTerms.length > 0 && (
                    <SetupDropdown
                      fieldItems={deliveryTerms}
                      selectedValue={termsOfDeliveryPreference}
                      onChangeValue={onChangeFortnoxDefaultMappings}
                      dropdownFor="defaultFields"
                      dropdownLabel="delivery terms"
                      cssName="settings-dropdown"
                    />
                  )}
                </Col>
                <Col sm={5} lg={3} className="mt-4 fortnox-vat-type">
                  <TextWithTooltip
                    label="Select Vat Type"
                    tooltipText="Assigning a default VAT type is essential for accurate tax calculations. This ensures compliance with local tax regulations and helps avoid legal complications."
                  />
                  {vatTypes && vatTypes.length > 0 && (
                    <SetupDropdown
                      fieldItems={vatTypes}
                      selectedValue={vatTypePreference}
                      onChangeValue={onChangeFortnoxDefaultMappings}
                      dropdownFor="defaultFields"
                      dropdownLabel="VAT type"
                      cssName="settings-dropdown"
                    />
                  )}
                </Col>
                <Col sm={5} lg={3} className="mt-4 fortnox-languages">
                  <TextWithTooltip
                    label="Select language"
                    tooltipText="Setting a default language ensures that all communication and documentation are clear and understandable, facilitating smoother interactions between you and your customers."
                  />
                  {languages && languages.length > 0 && (
                    <SetupDropdown
                      fieldItems={languages}
                      selectedValue={languagePreference}
                      onChangeValue={onChangeFortnoxDefaultMappings}
                      dropdownFor="defaultFields"
                      dropdownLabel="language"
                      cssName="settings-dropdown"
                    />
                  )}
                </Col>
              </div>
            </Card.Body>
          </Card>
          <div
            className="d-flex flex-row justify-content-end"
            style={{ marginTop: "27px" }}
          >
            {!paymentTermPreference ||
            !currencyPreference ||
            !listOfPricePreference ||
            !waysOfDeliveryPreference ||
            !termsOfDeliveryPreference ||
            !vatTypePreference ||
            !languagePreference ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip style={{ fontSize: "12px" }}>
                    {showTooltipText({
                      paymentTermPreference,
                      currencyPreference,
                      listOfPricePreference,
                      waysOfDeliveryPreference,
                      termsOfDeliveryPreference,
                      vatTypePreference,
                      languagePreference,
                    })}
                  </Tooltip>
                }
              >
                <Button className="hb-disabled-btn">Save</Button>
              </OverlayTrigger>
            ) : (
              <Button
                className="hb-save-changes-btn"
                onClick={() => {
                  saveContactDefaultMappings({
                    setIsLoading,
                    userIds: hubspotUserIds,
                    dispatch,
                    paymentTermPreference,
                    currencyPreference,
                    listOfPricePreference,
                    waysOfDeliveryPreference,
                    termsOfDeliveryPreference,
                    vatTypePreference,
                    languagePreference,
                  });
                }}
              >
                {isLoading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <span>Save</span>
                )}
              </Button>
            )}
          </div>
        </>
      )}
    </Container>
  );
};

export default ContactDefaultMappings;
