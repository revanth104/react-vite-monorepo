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
import {
  onChangeMsbcDefaultFields,
  showTooltipText,
  saveContactDefaultMappings,
} from "@cloudify/msbc-frontend";
import { SetupDropdown } from "@cloudify/generic";
import { CmsRichText } from "@cloudify/cms";

import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";
import { IHubspotSlice } from "@cloudify/hubspot-frontend/src/types/types";
import { IMsbcSlice } from "@cloudify/msbc-frontend/src/types/msbcTypes";

const ContactDefaultMappings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    msbcDefaultFields: {
      loading: msbcDefaultFieldsLoading,
      data: { paymentTerms, currencies },
    },
    defaultMappings: { paymentTermsCodePreference, currencyCodePreference },
  } = useSelector((state: { msbc: IMsbcSlice }) => state.msbc);

  const { hubspotUserIds } = useSelector(
    (state: { hubspot: IHubspotSlice }) => state.hubspot
  );

  const {
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  return (
    <Container className="px-0">
      {cmsLoading || msbcDefaultFieldsLoading ? (
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
                <Col sm={5} lg={3} className="mt-4 msbc-payment-terms">
                  <TextWithTooltip
                    label="Payment Terms Code"
                    tooltipText=" This field indicates the terms of payment for a
                    customer (e.g., net 30 days, upon receipt, etc.).
                    Select a default code that will be applied to all new
                    customers"
                  />
                  {paymentTerms && paymentTerms.length > 0 && (
                    <SetupDropdown
                      fieldItems={paymentTerms}
                      selectedValue={paymentTermsCodePreference}
                      onChangeValue={onChangeMsbcDefaultFields}
                      dropdownFor="defaultFields"
                      dropdownLabel="payment terms code"
                      cssName="settings-dropdown"
                    />
                  )}
                </Col>
                <Col sm={5} lg={3} className="mt-4 msbc-currency">
                  <TextWithTooltip
                    label="Currency Code"
                    tooltipText="Define the default currency to be used when a new
                    customer is created. This will determine the currency
                    in which all transactions with the customer will be
                    conducted"
                  />
                  {currencies && currencies.length > 0 && (
                    <SetupDropdown
                      fieldItems={currencies}
                      selectedValue={currencyCodePreference}
                      onChangeValue={onChangeMsbcDefaultFields}
                      dropdownFor="defaultFields"
                      dropdownLabel="currency code"
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
            {!paymentTermsCodePreference || !currencyCodePreference ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip style={{ fontSize: "12px" }}>
                    {showTooltipText({
                      paymentTermsCodePreference,
                      currencyCodePreference,
                    })}
                  </Tooltip>
                }
              >
                <Button className="hb-disabled-btn">Save</Button>
              </OverlayTrigger>
            ) : (
              <Button
                className="hb-save-changes-btn"
                onClick={() =>
                  saveContactDefaultMappings({
                    paymentTermsCodePreference,
                    currencyCodePreference,
                    setIsLoading,
                    userIds: hubspotUserIds,
                    dispatch,
                  })
                }
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
