import React, { useEffect, KeyboardEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { Spinner, Container } from "react-bootstrap";

import {
  fetchSubscription,
  updateUserIds,
  fetchFinancialData,
  getCompanies,
  setCompaniesData,
  setSearchInput,
  ErrorModal,
  SearchWindowTable,
  FinancialDataTable,
  setShowSuccessModal,
} from "@cloudify/cvr-frontend";
import {
  CmsEditAndSave,
  fetchCmsData,
  onChangeIsUserAllowed,
  CmsRichText,
} from "@cloudify/cms";
import { setShowErrorModal } from "@cloudify/cvr-frontend";

import { IPreferenceSlice } from "@cloudify/cvr-frontend/src/types/preferenceTypes";
import { ISearchWindowSlice } from "@cloudify/cvr-frontend/src/types/searchWindowTypes";
import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";

const SearchWindow = () => {
  const {
    subscriptionDetails: { subscription },
    userIds,
  } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const {
    searchInput,
    dataFetched,
    companies: { loading },
  } = useSelector(
    (state: { searchWindow: ISearchWindowSlice }) => state.searchWindow
  );

  const { allowedUsers } = useSelector((state: { cms: ICmsData }) => state.cms);

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const portalId = searchParams.get("portalId");
  const userId = searchParams.get("userId");
  const objectId = searchParams.get("objectId");

  const hubspotUserIds = {
    portalId,
    userId,
  };

  useEffect(() => {
    if (portalId) {
      dispatch(updateUserIds({ portalId, userId, objectId }));
    }
  }, []);

  useEffect(() => {
    if (userIds && Object.keys(userIds).length > 0) {
      dispatch(fetchSubscription({ userIds }));
    }
  }, [userIds]);

  useEffect(() => {
    const name = searchParams.get("name");
    if (name) {
      dispatch(setSearchInput({ searchKeyword: name }));
    }
  }, []);

  useEffect(() => {
    if (userIds && Object.keys(userIds).length > 0) {
      if (
        subscription &&
        Object.keys(subscription).length > 0 &&
        window.location.pathname !== "/global-search" &&
        (subscription.plan === "premium" ||
          (subscription.plan === "basic" &&
            parseInt(subscription.usageCount) < 15))
      ) {
        dispatch(fetchFinancialData({ userIds }));
      }
    }
  }, [userIds, subscription]);

  useEffect(() => {
    dispatch(fetchCmsData());
  }, []);

  useEffect(() => {
    if (allowedUsers.length > 0) {
      dispatch(onChangeIsUserAllowed({ ...userIds, appName: "hubspot" }));
    }
  }, [allowedUsers]);

  let searchString = "";
  for (const char of searchInput) {
    if (/[æøåÆØÅ]/g.test(char)) {
      searchString += char;
    } else if (/[^a-zA-Z0-9 ]/g.test(char)) {
      searchString += `\\\\${char}`;
    } else {
      searchString += char;
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      dispatch(getCompanies({ keyword: searchString }));
    } else if ((event.target as HTMLInputElement).value === "") {
      dispatch(setCompaniesData());
    }
  };

  return (
    <div className="search-window-container">
      <ErrorModal />
      <Container
        fluid={window.location.pathname === "/global-search" ? true : false}
      >
        <div className="row">
          <div className="col my-5">
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

            {window.location.pathname === "/global-search" && (
              <CmsRichText
                path="cmsContent.globalSearchWindow"
                cssName="mapping-window-header"
              />
            )}
            {window.location.pathname === "/searchwindow" && (
              <CmsRichText
                path="cmsContent.searchWindow"
                cssName="mapping-window-header"
              />
            )}
            <div>
              {subscription &&
                (subscription.plan === "premium" ||
                  (subscription.plan === "basic" &&
                    parseInt(subscription.usageCount) < 15)) &&
                window.location.pathname !== "/global-search" && (
                  <FinancialDataTable />
                )}
            </div>
            <div className="search-container px-5 mt-3">
              <div className="d-flex flex-row search-window-search-box">
                <input
                  type="search"
                  placeholder={
                    window.location.pathname === "/global-search"
                      ? `Search Company...`
                      : "Search..."
                  }
                  className="form-control search-window-search"
                  onChange={(event) =>
                    dispatch(
                      setSearchInput({ searchKeyword: event.target.value })
                    )
                  }
                  onKeyDown={(event) => handleKeyDown(event)}
                  value={searchInput}
                />
                <button
                  className="search-window-search-button"
                  onClick={() =>
                    dispatch(getCompanies({ keyword: searchString }))
                  }
                >
                  <FiSearch className="my-auto mx-3 search-window-search-icon" />
                </button>
              </div>
            </div>
            <div className="search-table-loader-container">
              {dataFetched ? (
                <SearchWindowTable userIds={hubspotUserIds} />
              ) : (
                <>
                  {loading ? (
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
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SearchWindow;
