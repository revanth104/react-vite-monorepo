import React, { useEffect } from "react";
import { Container, Col, Row, Button, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { RiArrowDropDownFill } from "react-icons/ri";

import {
  onSelectQueries,
  QueryDropdown,
  onSelectSize,
  QuerySearchMultiSelectDropdown,
  getCvrProperties,
  updateUserIds,
  SearchWindowTable,
  getSearchQueryCompanies,
  setShowInfo,
  setShowErrorModal,
  setShowSuccessModal,
  setShowIndustryTypeModal,
  IndustryTypeModal,
} from "@cloudify/cvr-frontend";
import {
  CmsEditAndSave,
  fetchCmsData,
  onChangeIsUserAllowed,
  CmsRichText,
} from "@cloudify/cms";

import { ISearchWindowSlice } from "@cloudify/cvr-frontend/src/types/searchWindowTypes";
import { IPreferenceSlice } from "@cloudify/cvr-frontend/src/types/preferenceTypes";
import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";

interface IQueries {
  type: string;
  operator: string;
  keywords: string;
  values: number | string[] | number[];
}

interface ISearchQuery {
  logicalOperator: string;
  queries: IQueries[];
}

const QuerySearchWindow = () => {
  const dispatch = useDispatch();

  const {
    dataFetched,
    companies: { loading: companiesLoading },
    location,
    locationComparison,
    sizeComparison,
    industryType,
    size,
    locationSelectedFields,
    companyStatusComparison,
    companyStatusSelectedFields,
    cvrProperties: {
      loading,
      properties: {
        companyStatus: companyStatusFields,
        municipalities,
        postalCodes,
        branchCodes,
      },
    },
    checked,
  } = useSelector(
    (state: { searchWindow: ISearchWindowSlice }) => state.searchWindow
  );

  const { userIds } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const { allowedUsers } = useSelector((state: { cms: ICmsData }) => state.cms);

  const [searchParams] = useSearchParams();

  const locationDropdown = [
    { title: "Postal code", value: "postalCode", type: "string" },
    { title: "Municipality", value: "municipality", type: "number" },
  ];

  const comparisonFields = [
    { title: "Equal to", value: "eq" },
    { title: "Not equal to", value: "neq" },
    { title: "Greater than", value: "gt" },
    { title: "Less than", value: "lt" },
  ];

  const comparisonFieldsForCompanyStatus = [
    { title: "Equal to", value: "eq" },
    { title: "Not equal to", value: "neq" },
  ];

  useEffect(() => {
    if (userIds && Object.keys(userIds).length > 0) {
      dispatch(getCvrProperties({ userIds }));
    }
  }, [userIds]);

  useEffect(() => {
    const portalId = searchParams.get("portalId");
    const userId = searchParams.get("userId");
    if (portalId) {
      dispatch(updateUserIds({ portalId, userId }));
    }
  }, []);

  useEffect(() => {
    dispatch(fetchCmsData());
  }, []);

  useEffect(() => {
    if (allowedUsers.length > 0) {
      dispatch(onChangeIsUserAllowed({ ...userIds, appName: "hubspot" }));
    }
  }, [allowedUsers]);

  useEffect(() => {
    if (dataFetched) {
      window.scrollTo(0, 620);
    }
  }, [dataFetched]);

  const getSelectedFields = ({ key }: { key: string }) => {
    const locationCodesArray = [] as number[];
    const industryTypeCodes = [] as string[];
    const companyStatusCodes = [] as string[];
    if (key === "location") {
      locationSelectedFields.forEach((field) => {
        locationCodesArray.push(parseInt(field.value));
      });
      return locationCodesArray;
    } else if (key === "industryType") {
      industryTypeCodes.push(...checked);
      return industryTypeCodes;
    } else if (key === "companyStatus") {
      companyStatusSelectedFields.forEach((field) => {
        companyStatusCodes.push(field.value);
      });
      return companyStatusCodes;
    }
    return [];
  };

  const searchQuery = () => {
    const data: ISearchQuery = {
      logicalOperator: "and",
      queries: [],
    };

    if (
      location &&
      location.value &&
      locationComparison &&
      locationComparison.value &&
      locationSelectedFields.length > 0
    ) {
      const type = "terms";
      const operator = locationComparison.value;
      const keywords = location.value;
      const values = getSelectedFields({ key: "location" });

      data.queries.push({ type, operator, keywords, values });
    }
    if (sizeComparison && sizeComparison.value && size) {
      const type =
        sizeComparison.value === "eq" || sizeComparison.value === "neq"
          ? "term"
          : "range";
      const operator = sizeComparison.value;
      const keywords = "numberOfEmployee";
      const values = size;
      data.queries.push({ type, operator, keywords, values });
    }
    if (industryType && industryType.value && checked.length > 0) {
      const type = "terms";
      const operator = industryType.value;
      const keywords = "industryType";
      const values = getSelectedFields({ key: "industryType" });

      data.queries.push({ type, operator, keywords, values });
    }
    if (
      companyStatusComparison &&
      companyStatusComparison.value &&
      companyStatusSelectedFields.length > 0
    ) {
      const type = "match";
      const operator = companyStatusComparison.value;
      const keywords = "companyStatus";
      const values = getSelectedFields({ key: "companyStatus" });
      data.queries.push({ type, operator, keywords, values });
    }
    return data;
  };

  return (
    <div className="query-search-window-container">
      <IndustryTypeModal nodes={branchCodes} />
      <Container fluid>
        <Row>
          <Col>
            <div className="d-flex justify-content-center">
              <CmsEditAndSave
                userIds={userIds}
                appSlug="hubspot-cvrLookup"
                setShowErrorModal={setShowErrorModal}
                setShowSuccessModal={setShowSuccessModal}
                editNotificationPath={`userId=${searchParams.get(
                  "userId"
                )}&appSlug=hubspo-cvrLookup`}
              />
            </div>
            {loading ? (
              <div className="d-flex flex-column justify-content-center align-items-center loading-container">
                <div className="d-flex flex-row justify-content-center align-items-center">
                  <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  {/* <p className="my-1 mx-2 loading-text">Please wait...</p> */}
                </div>
              </div>
            ) : (
              <div className="mt-5">
                <CmsRichText
                  path="cmsContent.querySearchWindow"
                  cssName="mapping-window-header"
                />
                <div className="query-search-container mb-5 mt-3 p-4">
                  <Row>
                    <Col sm={4} lg={3}>
                      <label>Location</label>
                      <QueryDropdown
                        dropdownFor="location"
                        selectedValue={location}
                        dropdownLabel="location"
                        fieldItems={locationDropdown}
                        onChangeValue={onSelectQueries}
                        cssName="query-dropdown"
                        dropdownMenuHeight="85px"
                      />
                    </Col>
                    <Col sm={4} lg={3}>
                      <label></label>
                      <QueryDropdown
                        dropdownFor="locationComparison"
                        selectedValue={locationComparison}
                        dropdownLabel="comparison"
                        fieldItems={comparisonFieldsForCompanyStatus}
                        onChangeValue={onSelectQueries}
                        cssName="query-dropdown"
                        dropdownMenuHeight="85px"
                      />
                    </Col>
                    {location && (
                      <Col sm={4} lg={3}>
                        <label></label>
                        <QuerySearchMultiSelectDropdown
                          dropdownFor={location && location.value}
                          fieldItems={
                            location && location.value === "postalCode"
                              ? postalCodes
                              : municipalities
                          }
                          cssName="query-dropdown"
                          selectedItems={locationSelectedFields}
                          dropdownLabel={location && location.title}
                          dropdownMenuHeight="285px"
                          dropdownMenuWidth="275px"
                        />
                      </Col>
                    )}
                  </Row>
                  <Row className="mt-3">
                    <Col sm={4} lg={3}>
                      <label>Number of employees</label>
                      <QueryDropdown
                        dropdownFor="sizeComparison"
                        selectedValue={sizeComparison}
                        dropdownLabel="comparison"
                        fieldItems={comparisonFields}
                        onChangeValue={onSelectQueries}
                        cssName="query-dropdown"
                        dropdownMenuHeight="140px"
                      />
                    </Col>
                    <Col sm={4} lg={3} className="">
                      <input
                        type="number"
                        placeholder="Size...."
                        className="size-input"
                        value={size}
                        min="0"
                        onChange={(event) =>
                          dispatch(onSelectSize({ size: event.target.value }))
                        }
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col sm={4} lg={3}>
                      <label>Industry type</label>
                      <QueryDropdown
                        dropdownFor="industryTypeComparison"
                        selectedValue={industryType}
                        dropdownLabel="comparison"
                        fieldItems={comparisonFieldsForCompanyStatus}
                        onChangeValue={onSelectQueries}
                        cssName="query-dropdown"
                        dropdownMenuHeight="85px"
                      />
                    </Col>
                    <Col sm={4} lg={3}>
                      <label></label>
                      <div
                        className="industry-type-box mt-2"
                        onClick={() => dispatch(setShowIndustryTypeModal())}
                      >
                        {checked.length > 0 ? (
                          <p>Click to see {checked.length} selected</p>
                        ) : (
                          <p>Click to select</p>
                        )}

                        <RiArrowDropDownFill size={"24"} />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col sm={4} lg={3}>
                      <label>Company status</label>
                      <QueryDropdown
                        dropdownFor="companyStatusComparison"
                        selectedValue={companyStatusComparison}
                        dropdownLabel="comparison"
                        cssName="query-dropdown"
                        onChangeValue={onSelectQueries}
                        fieldItems={comparisonFieldsForCompanyStatus}
                        dropdownMenuHeight="85px"
                      />
                    </Col>
                    <Col sm={4} lg={3}>
                      <label></label>
                      <QuerySearchMultiSelectDropdown
                        dropdownFor="companyStatus"
                        fieldItems={companyStatusFields}
                        cssName="query-dropdown"
                        selectedItems={companyStatusSelectedFields}
                        dropdownLabel="company status"
                        dropdownMenuHeight="285px"
                        dropdownMenuWidth="275px"
                      />
                    </Col>
                  </Row>

                  {((location &&
                    locationComparison &&
                    locationSelectedFields.length > 0) ||
                    (sizeComparison && size !== null) ||
                    (industryType && checked.length > 0) ||
                    (companyStatusComparison &&
                      companyStatusSelectedFields.length > 0)) && (
                    <div
                      className={`d-flex flex-row justify-content-end align-items-center mt-3`}
                    >
                      <Button
                        className="bulk-update-button"
                        onClick={() => {
                          dispatch(
                            getSearchQueryCompanies({
                              userIds,
                              data: searchQuery(),
                            })
                          );
                          dispatch(setShowInfo({ showInfo: true }));
                        }}
                      >
                        Show Result
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="search-table-loader-container">
              {dataFetched ? (
                <SearchWindowTable searchQuery={searchQuery} />
              ) : (
                <>
                  {companiesLoading ? (
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      <div className="d-flex flex-row justify-content-center align-items-center">
                        <Spinner
                          animation="border"
                          variant="primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default QuerySearchWindow;
