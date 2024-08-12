import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Spinner } from "react-bootstrap";

import { useSelector, useDispatch } from "react-redux";
import axios, { AxiosError } from "axios";
import { FaSearch } from "react-icons/fa";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";
import {
  setShowErrorModal,
  setShowSuccessModal,
  setBulkFeatureStats,
  setShowProgressBar,
  setShowBulkFeatureModal,
} from "../slice/preferenceSlice";
import { setPaginationSearchResults } from "../slice/preferenceSlice";

import { ICompaniesData, ISearchWindowSlice } from "../types/searchWindowTypes";
import { IPreferenceSlice, ICompanies } from "../types/preferenceTypes";

import { getUrlInCvr } from "../helpers/url";

import {
  handleSelectAll,
  onSelectCompany,
  setValuesToDefault,
  fetchFinancialData,
} from "../slice/searchWindowslice";

import Pagination from "./Pagination";
import CompanyList from "./CompanyList";

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

interface IProps {
  searchQuery?: () => ISearchQuery;
}

const SearchWindowTable = (props: IProps) => {
  const { searchQuery } = props;
  const dispatch = useDispatch();

  const {
    companies: { companiesData },
    searchInput,
    isAllSelected,
    selectedCompanies,
    showInfo,
    checked,
  } = useSelector(
    (state: { searchWindow: ISearchWindowSlice }) => state.searchWindow
  );

  const {
    slicedCompanies,
    paginationSearchResults,
    paginationSearchInput,
    userIds,
  } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const [loading, setLoading] = useState(false);
  const [multiSelectLoading, setMultiSelectLoading] = useState(false);
  const [storedId, setStoredId] = useState<string>("");
  const [showLink, setShowLink] = useState(false);

  const [delayTime, setDelayTime] = useState<number | string>(0);
  const currentTime = useRef();
  const timeIntervalId = useRef<NodeJS.Timeout | undefined>(undefined);
  const intervalId = useRef<NodeJS.Timeout | undefined>(undefined);

  const path = window.location.pathname;

  const getUrl = () => {
    if (path === "/global-search" || path === "/query-search") {
      return "VITE_CREATE_COMPANIES_URL";
    } else if (path === "/searchwindow") {
      return "VITE_UPDATE_COMPANIES_URL";
    }
    return "";
  };

  const addCompany = async (el: ICompanies | ICompaniesData) => {
    try {
      setStoredId(el["_id"] as string);
      setLoading(true);
      let cvrNumbers = [];
      if (path === "/query-search" || path === "/global-search") {
        cvrNumbers = [el["_source"]?.Vrvirksomhed?.cvrNummer];
      } else {
        cvrNumbers = [
          {
            cvrNumber: el["_source"]?.Vrvirksomhed?.cvrNummer,
            objectId: userIds.objectId,
          },
        ];
      }
      const body = {
        ...userIds,
        cvrNumbers,
        queries:
          path === "/query-search" && searchQuery ? searchQuery().queries : [],
      };
      const res = await axios.post(getUrlInCvr(getUrl()), body);
      const { message, status } = res.data;
      if (path === "/query-search" || path === "/global-search") {
        if (status === "failure" && message) {
          dispatch(setShowErrorModal({ message }));
        } else if (message) {
          dispatch(setShowSuccessModal({ message }));
        } else {
          dispatch(
            setShowSuccessModal({ message: "Company is created successfully." })
          );
        }
      } else {
        dispatch(
          setShowSuccessModal({ message: "Organization Updated Successfully." })
        );
      }

      dispatch(setValuesToDefault(""));
      if (path === "/searchwindow") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(fetchFinancialData({ userIds }) as any);
      }
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
      dispatch(setShowErrorModal({ message: errorMessage }));
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.status === 402
      ) {
        setShowLink(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const getTime = async () => {
    const { data: timeData } = await axios.get(
      `${getUrlInCvr("VITE_GET_CURRENT_TIME")}?timeZone=Europe/Copenhagen`
    );
    currentTime.current = timeData.dateTime;
  };

  const intervalToGetTime = () => {
    timeIntervalId.current = setInterval(async () => {
      await getTime();
    }, 60000);
  };

  const updationDelay = (
    startTime: number | Date | string,
    currentTime: number | Date | string
  ) => {
    const currentDate = new Date(currentTime);
    const storedDate = new Date(startTime);
    let delayMin = (currentDate.getTime() - storedDate.getTime()) / 1000;
    delayMin = delayMin / 60;
    return Math.abs(Math.round(delayMin));
  };

  const delayTimeCalculation = (records: number) => {
    const calculatedDelay = Math.ceil((2 * records) / 20);
    return calculatedDelay;
  };

  const getBulkCreateStats = async () => {
    const { data: stats } = await axios.get(
      getUrlInCvr("VITE_GET_BULK_UPDATE_STATS"),
      {
        params: {
          ...userIds,
        },
      }
    );
    return stats;
  };

  const settingIntervals = () => {
    intervalId.current = setInterval(async () => {
      const stats = await getBulkCreateStats();
      const { bulkCreate } = stats;
      const { failedRecords, processedRecords, pushedRecords, startTime } =
        bulkCreate;
      dispatch(
        setBulkFeatureStats({ bulkStatsKey: "bulkCreate", stats: bulkCreate })
      );
      if (!timeIntervalId.current) {
        intervalToGetTime();
      }

      const delayInMins = updationDelay(
        startTime,
        currentTime.current ? currentTime.current : ""
      );
      setDelayTime(delayInMins);
      if (
        pushedRecords === processedRecords + failedRecords ||
        delayInMins >= delayTimeCalculation(pushedRecords)
      ) {
        clearInterval(intervalId.current);
        intervalId.current = undefined;
        clearInterval(timeIntervalId.current);
        timeIntervalId.current = undefined;
      }
    }, 3000);
  };

  const onShowBulkCreateModal = async () => {
    try {
      setMultiSelectLoading(true);
      if (selectedCompanies.length === 0)
        throw new Error(
          "No companies selected. Please select the companies to use this feature."
        );
      const stats = await getBulkCreateStats();

      const { bulkCreate } = stats;
      if (
        Object.keys(stats).length === 0 ||
        (bulkCreate && Object.keys(bulkCreate).length === 0)
      ) {
        dispatch(setShowBulkFeatureModal({ showModal: true }));
        dispatch(setShowProgressBar({ show: false }));
      } else {
        const { failedRecords, processedRecords, pushedRecords, startTime } =
          bulkCreate;
        await getTime();
        intervalToGetTime();
        const delayInMins = updationDelay(
          startTime,
          currentTime.current ? currentTime.current : ""
        );
        if (
          pushedRecords === failedRecords + processedRecords ||
          delayInMins >= delayTimeCalculation(pushedRecords)
        ) {
          clearInterval(timeIntervalId.current);
          timeIntervalId.current = undefined;

          dispatch(setShowBulkFeatureModal({ showModal: true }));
          dispatch(setShowProgressBar({ show: false }));
        } else {
          dispatch(setShowBulkFeatureModal({ showModal: true }));

          dispatch(
            setBulkFeatureStats({
              bulkStatsKey: "bulkCreate",
              stats: bulkCreate,
            })
          );
          dispatch(setShowProgressBar({ show: true }));
          settingIntervals();
        }
      }
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
    } finally {
      setMultiSelectLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
      if (timeIntervalId.current) {
        clearInterval(timeIntervalId.current);
      }
      intervalId.current = undefined;
      timeIntervalId.current = undefined;
    };
  }, []);

  return (
    <>
      <SuccessModal />
      <ErrorModal displayUrl={showLink} />

      <CompanyList
        searchSelectedCompanies={selectedCompanies}
        getTime={getTime}
        settingIntervals={settingIntervals}
        delayTime={delayTime}
        delayTimeCalculation={delayTimeCalculation}
        intervalId={intervalId}
        timeIntervalId={timeIntervalId}
        userIds={userIds}
        bulkStatsKey="bulkCreate"
        searchQuery={searchQuery}
      />
      {path !== "/searchwindow" && (
        <div
          className={`mb-4 d-flex flex-row align-items-center ${
            selectedCompanies.length >= 1 && "justify-content-between flex-wrap"
          }`}
        >
          {path !== "/searchwindow" &&
            companiesData &&
            companiesData.length > 0 && (
              <div
                className={`d-flex flex-row align-items-center mb-3 ${
                  selectedCompanies.length >= 1 && "flex-wrap"
                }`}
              >
                <div className="mapping-search">
                  <input
                    type="search"
                    placeholder="Search.."
                    className="input-search"
                    onChange={(event) =>
                      dispatch(
                        setPaginationSearchResults({
                          searchKeyword: event.target.value,
                          searchFor: "searchResults",
                          searchResults: companiesData,
                        })
                      )
                    }
                  />
                  <span className="my-auto">
                    <FaSearch size={15} className="me-3 search-icon" />
                  </span>
                </div>

                <p className="ms-2 mb-0">
                  {companiesData.length} search results were found{" "}
                  {path === "/query-search" && "for the selected queries"}.
                </p>
              </div>
            )}

          {selectedCompanies.length >= 1 && (
            <Button
              className="bulk-update-button mb-3"
              onClick={() => onShowBulkCreateModal()}
              style={{ height: "40px" }}
            >
              {multiSelectLoading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <span>Create</span>
              )}
            </Button>
          )}
        </div>
      )}
      {paginationSearchResults.length === 0 &&
      paginationSearchInput.length > 0 ? (
        <p>No search results found</p>
      ) : (
        <div
          className={`search-table-container pb-1`}
          style={{
            background: "#fff",
          }}
        >
          {(path === "/query-search" && companiesData.length > 0) ||
          (searchInput.length > 0 && companiesData.length > 0) ? (
            <>
              <Table responsive className="search-table">
                <thead className="search-table-header">
                  <tr className="row-12">
                    {(path === "/global-search" ||
                      path === "/query-search") && (
                      <th className="py-3 col-1 ps-3">
                        <input
                          type="checkbox"
                          id="globalSearchSelectAll"
                          checked={isAllSelected}
                          onChange={(event) =>
                            dispatch(
                              handleSelectAll({
                                isChecked: event.target.checked,
                              })
                            )
                          }
                          className="company-table-checkbox"
                        />
                      </th>
                    )}

                    <th
                      className={`py-3 col-2 ${
                        path === "/searchwindow" ? "ps-3" : ""
                      }`}
                    >
                      <p className="my-auto">COMPANY NAME</p>
                    </th>

                    <th className="py-3 col-2">
                      <p className="text-center my-auto">CVR NUMMER</p>
                    </th>

                    <th className="py-3 col-3">
                      <p className="text-center my-auto">STATUS</p>
                    </th>

                    {checked.length > 0 ? (
                      <th className="py-3 col-2">
                        <p className="text-center my-auto">branchekode</p>
                      </th>
                    ) : (
                      <th className="py-3 col-2">
                        <p className="text-center my-auto">VIRKSOMHEDSFORM</p>
                      </th>
                    )}

                    <th className="py-3 col-2"></th>
                  </tr>
                </thead>
                <tbody className="search-table-body">
                  {slicedCompanies.map(
                    (el: ICompaniesData | ICompanies, index: number) => (
                      <tr key={index} className="row-12">
                        {(path === "/global-search" ||
                          path === "/query-search") && (
                          <td className="col-1 py-3 ps-3">
                            <input
                              type="checkbox"
                              id={String(el._id)}
                              className="company-table-checkbox"
                              checked={el.isChecked}
                              onChange={(event) =>
                                dispatch(
                                  onSelectCompany({
                                    isChecked: event.target.checked,
                                    id: el._id,
                                    cvrNumber:
                                      el?._source?.Vrvirksomhed.cvrNummer,
                                    companyName:
                                      el?._source?.Vrvirksomhed
                                        ?.virksomhedMetadata?.nyesteNavn?.navn,
                                  })
                                )
                              }
                            />
                          </td>
                        )}

                        <td className="py-3 col-2">
                          <div className="d-flex flex-row">
                            <p
                              className={`search-table-body-para my-auto ${
                                path === "/searchwindow" ? "ps-3" : ""
                              }`}
                            >
                              <span className="search-table-company-name">
                                {
                                  el["_source"]?.Vrvirksomhed
                                    ?.virksomhedMetadata?.nyesteNavn?.navn
                                }
                              </span>
                              <br></br>
                              <span>
                                {
                                  el["_source"]?.Vrvirksomhed
                                    ?.virksomhedMetadata
                                    ?.nyesteBeliggenhedsadresse?.vejnavn
                                }{" "}
                                {
                                  el["_source"]?.Vrvirksomhed
                                    ?.virksomhedMetadata
                                    ?.nyesteBeliggenhedsadresse?.husnummerFra
                                }
                              </span>
                              <br></br>
                              <span>
                                {
                                  el["_source"]?.Vrvirksomhed
                                    ?.virksomhedMetadata
                                    ?.nyesteBeliggenhedsadresse?.postnummer
                                }{" "}
                                {
                                  el["_source"]?.Vrvirksomhed
                                    ?.virksomhedMetadata
                                    ?.nyesteBeliggenhedsadresse?.postdistrikt
                                }
                              </span>
                            </p>
                          </div>
                        </td>
                        <td className="py-3 col-2">
                          <p className="search-table-body-para text-center my-auto">
                            {el["_source"]?.Vrvirksomhed?.cvrNummer}
                          </p>
                        </td>
                        <td className="py-3 col-3">
                          <p
                            className="search-table-body-para text-center my-auto"
                            style={{ wordBreak: "break-all" }}
                          >
                            {
                              el["_source"]?.Vrvirksomhed?.virksomhedMetadata
                                ?.sammensatStatus
                            }
                          </p>
                        </td>
                        {checked.length > 0 ? (
                          <td className="py-3 col-2">
                            <p className="search-table-body-para text-center my-auto">
                              {
                                el["_source"]?.Vrvirksomhed?.virksomhedMetadata
                                  ?.nyesteHovedbranche?.branchekode
                              }
                            </p>
                          </td>
                        ) : (
                          <td className="py-3 col-2">
                            <p
                              className="search-table-body-para text-center my-auto"
                              style={{ wordBreak: "break-all" }}
                            >
                              {
                                el["_source"]?.Vrvirksomhed?.virksomhedMetadata
                                  ?.nyesteVirksomhedsform?.langBeskrivelse
                              }
                            </p>
                          </td>
                        )}

                        <td className="py-3 col-2">
                          <Button
                            onClick={() => addCompany(el)}
                            className={`search-table-btn my-auto ${
                              path === "/searchwindow" ? "mx-5" : "mx-2"
                            }`}
                            disabled={loading || selectedCompanies.length >= 1}
                          >
                            {loading && storedId === el["_id"] ? (
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                            ) : (
                              <span>
                                {path === "/global-search" ||
                                path === "/query-search"
                                  ? "create"
                                  : "add"}
                              </span>
                            )}
                          </Button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>

              <div className="mt-3">
                <Pagination paginationData={companiesData} itemsPerPage={10} />
              </div>
            </>
          ) : (
            <>
              {path === "/query-search" &&
                companiesData.length === 0 &&
                showInfo && (
                  <div
                    className="d-flex flex-column justify-content-center align-items-center my-5 pt-4 pb-2"
                    style={{ background: "#fff" }}
                  >
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      <h2>No Companies Found</h2>
                      <p>Try changing your search filters.</p>
                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SearchWindowTable;
