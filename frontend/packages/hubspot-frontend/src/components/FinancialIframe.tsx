import React, { useState } from "react";
import { Col, Row, Dropdown, Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { getUrlInHs } from "../helpers/url";

import {
  SetupDropdown,
  onChangeContactPreferences,
  setShowErrorModal,
  setShowSuccessModal,
  fetchFinancialData,
  onChangeTime,
} from "@cloudify/generic";

import { IHubspotSlice } from "../types/types";
import { IPreferenceSlice } from "@cloudify/generic/src/types/preferenceTypes";
import { IContactSlice } from "@cloudify/generic/src/types/contactTypes";
import { IField } from "@cloudify/generic/src/types/mappingTypes";
import { IFinancialSlice } from "@cloudify/generic/src/types/financialTypes";

interface IProps {
  actionAppCustomerSearchFields: IField[];
  actionAppLoading: boolean;
  actionAppName: string;
}

const FinancialIframe = (props: IProps) => {
  const { actionAppCustomerSearchFields, actionAppLoading, actionAppName } =
    props;
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [btnLoading, setBtnLoading] = useState(false);

  // States
  const {
    hubspotUserIds,
    fields: {
      loading: triggerAppLoading,
      data: {
        companiesSearchFields: triggerAppCompanySearchFields,
        contactSearchFields: triggerAppContactsSearchFields,
      },
    },
  } = useSelector((state: { hubspot: IHubspotSlice }) => state.hubspot);

  const {
    timeDropdownFields,
    timePreference,
    financialObject,
    lastSynced,
    financialData: { loading },
  } = useSelector((state: { financial: IFinancialSlice }) => state.financial);

  const {
    triggerAppCompanyFilterPreference,
    actionAppCompanyFilterPreference,
    customerNumberPreference,
    triggerAppCompanyNumberPreference,
    triggerAppContactFilterPreference,
    actionAppContactFilterPreference,
    triggerAppContactNumberPreference,
    isContactCheckbox,
  } = useSelector((state: { contact: IContactSlice }) => state.contact);

  const { isAppConnected } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const isContactsIframe =
    searchParams.get("associatedObjectType") === "CONTACT";

  const toggleDropdownText = () => {
    if (!timePreference) {
      return "Select";
    } else {
      return timeDropdownFields.find((field) => field.value === timePreference)
        ?.name;
    }
  };

  const onUpdateFinancialData = async () => {
    try {
      setBtnLoading(true);
      const portalId = searchParams.get("portalId");
      const objectId = searchParams.get("objectId");
      const associatedObjectType = searchParams.get("associatedObjectType");
      if (!timePreference) throw new Error("Please select the time preference");
      if (!isAppConnected)
        throw new Error(`Please connect to ${actionAppName}`);

      // Save customer preferences
      await axios.post(getUrlInHs("VITE_SAVE_PREFERENCES"), {
        ...hubspotUserIds,
        preferences: {
          searchFilterOptions: {
            triggerApp: {
              companies: {
                filterProperty: triggerAppCompanyFilterPreference,
                actionApp: {
                  filterProperty: actionAppCompanyFilterPreference,
                },
              },
              contacts: {
                filterProperty: triggerAppContactFilterPreference,
                actionApp: {
                  filterProperty: actionAppContactFilterPreference,
                },
              },
            },
          },
          customerNumber: {
            direction: customerNumberPreference.value,
            mapping: {
              triggerApp: {
                companies: {
                  triggerProperty: triggerAppCompanyNumberPreference,
                },
                contacts: {
                  triggerProperty: triggerAppContactNumberPreference,
                },
              },
            },
          },
          syncOptions: {
            triggerApp: {
              useSecondarySync: isContactCheckbox,
            },
          },
        },
        preferenceType: "customerSync",
      });
      await axios.post(getUrlInHs("VITE_UPDATE_FINANCIAL_DATA"), {
        portalId,
        hsObjectId: objectId,
        time: timePreference,
        associatedObjectType: associatedObjectType,
      });
      dispatch(
        fetchFinancialData({
          userIds: hubspotUserIds,
          objectId: `${associatedObjectType}_${objectId}`,
          /* eslint-disable @typescript-eslint/no-explicit-any */
        }) as any
      );
      dispatch(
        setShowSuccessModal({ message: "Financial data updated successfully" })
      );
    } catch (error) {
      console.log(error);
      let errorMessage;
      if (error instanceof Error) errorMessage = error.message;
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data.message
      )
        errorMessage = error.response.data.message;
      dispatch(
        setShowErrorModal({
          message: errorMessage,
        })
      );
      throw error;
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <Row className="w-100 d-flex flex-row justify-content-center">
      <Col xs={12} lg={8} className="financial-window my-5 py-4 px-3">
        {loading || triggerAppLoading || actionAppLoading ? (
          <div className="d-flex flex-column justify-content-center align-items-center my-5">
            <Spinner
              animation="border"
              variant="primary"
              role="status"
            ></Spinner>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h5>Financial Report</h5>
              {lastSynced && <p>(Last Updated on {lastSynced})</p>}
            </div>
            <div className="search-params mt-5">
              <p style={{ fontSize: "16px" }} className="mb-2">
                <b>Customer Search property</b>
              </p>
              <p>
                This section consists of the search parameters based on which
                the search or sync will be performed.
              </p>
              {triggerAppCompanySearchFields &&
                actionAppCustomerSearchFields &&
                !isContactsIframe && (
                  <Row className="d-flex flex-row mt-3">
                    <Col sm={5} lg={4}>
                      {triggerAppCompanySearchFields &&
                        triggerAppCompanySearchFields.length > 0 && (
                          <div>
                            <label className="label-text">HubSpot</label>
                            <SetupDropdown
                              fieldItems={triggerAppCompanySearchFields}
                              dropdownFor="triggerAppCompanyFilterField"
                              selectedValue={triggerAppCompanyFilterPreference}
                              onChangeValue={onChangeContactPreferences}
                              cssName="settings-dropdown"
                            />
                          </div>
                        )}
                    </Col>
                    <Col sm={1} className="mx-0 sync-settings-card-direction">
                      <div></div>
                    </Col>
                    <Col sm={5} lg={4}>
                      {actionAppCustomerSearchFields &&
                        actionAppCustomerSearchFields.length > 0 && (
                          <div>
                            <label className="label-text">
                              {actionAppName}
                            </label>
                            <SetupDropdown
                              fieldItems={actionAppCustomerSearchFields}
                              dropdownFor="actionAppCompanyFilterField"
                              selectedValue={actionAppCompanyFilterPreference}
                              cssName="settings-dropdown"
                              onChangeValue={onChangeContactPreferences}
                            />
                          </div>
                        )}
                    </Col>
                  </Row>
                )}
              {triggerAppContactsSearchFields &&
                actionAppCustomerSearchFields &&
                isContactsIframe && (
                  <Row className="d-flex flex-row mt-3">
                    <Col sm={5} lg={4}>
                      {triggerAppContactsSearchFields &&
                        triggerAppCompanySearchFields.length > 0 && (
                          <div>
                            <label className="label-text">HubSpot</label>
                            <SetupDropdown
                              fieldItems={triggerAppContactsSearchFields}
                              dropdownFor="triggerAppContactFilterField"
                              selectedValue={triggerAppContactFilterPreference}
                              onChangeValue={onChangeContactPreferences}
                              cssName="settings-dropdown"
                            />
                          </div>
                        )}
                    </Col>
                    <Col sm={1} className="mx-0 sync-settings-card-direction">
                      <div></div>
                    </Col>
                    <Col sm={5} lg={4}>
                      {actionAppCustomerSearchFields &&
                        actionAppCustomerSearchFields.length > 0 && (
                          <div>
                            <label className="label-text">
                              {actionAppName}
                            </label>
                            <SetupDropdown
                              fieldItems={actionAppCustomerSearchFields}
                              dropdownFor="actionAppContactFilterField"
                              selectedValue={actionAppContactFilterPreference}
                              cssName="settings-dropdown"
                              onChangeValue={onChangeContactPreferences}
                            />
                          </div>
                        )}
                    </Col>
                  </Row>
                )}
            </div>
            <div className="d-flex flex-row align-items-center mt-4">
              <p className="m-0">
                <b>Time:</b>
              </p>
              <Dropdown className="ms-3 w-100">
                <Dropdown.Toggle className="financial-card-dropdown">
                  {toggleDropdownText()}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="dropdown-container"
                  renderOnMount={true}
                  popperConfig={{ strategy: "fixed" }}
                >
                  {timeDropdownFields &&
                    timeDropdownFields.map((field) => (
                      <Dropdown.Item
                        key={field.value}
                        onClick={() =>
                          dispatch(
                            onChangeTime({
                              selectedOption: field.value,
                            })
                          )
                        }
                      >
                        {field.name}
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <ul className="mt-5 financial-unordered-list ps-3">
              {financialObject &&
                Object.keys(financialObject).map((key) => (
                  <li key={key}>
                    <p className="d-flex flex-row justify-content-between">
                      <span>{key}</span>
                      <span>{financialObject[key]}</span>
                    </p>
                  </li>
                ))}
            </ul>
            <div className="d-flex flex-row justify-content-end mt-5">
              <Button
                className="save-changes-button"
                disabled={btnLoading}
                onClick={() => onUpdateFinancialData()}
              >
                {btnLoading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </>
        )}
      </Col>
    </Row>
  );
};

export default FinancialIframe;
