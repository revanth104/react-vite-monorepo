import React, { useEffect, useState, useRef } from "react";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import axios, { AxiosError } from "axios";
import SearchResultsNotFound from "../components/SearchResultsNotFound";
import { getUrl } from "../helpers/url";
import { BulkUpdateData, HubspotCompanies } from "../types/bulkUpdateTypes";

import {
  CmsEditAndSave,
  fetchCmsData,
  onChangeIsUserAllowed,
  CmsRichText,
} from "@cloudify/cms";
import {
  ErrorModal,
  setShowErrorModal,
  Pagination,
  setPaginationSearchResults,
  CompanyList,
  setBulkFeatureStats,
  setShowProgressBar,
  setShowBulkFeatureModal,
  setShowSuccessModal,
} from "@cloudify/cvr-frontend";

import { IPreferenceSlice } from "@cloudify/cvr-frontend/src/types/preferenceTypes";
import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";

const BulkUpdate = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bulkUpdateData, setBulkUpdateData] = useState<BulkUpdateData>({
    cvrNumberKey: "",
    hsCompanies: [],
  });

  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

  const [selectedCompanies, setSelectedCompanies] = useState<
    HubspotCompanies[]
  >([]);

  const [delayTime, setDelayTime] = useState<number | string>(0);
  const currentTime = useRef();
  const timeIntervalId = useRef<NodeJS.Timeout | undefined>(undefined);
  const intervalId = useRef<NodeJS.Timeout | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const { slicedCompanies, paginationSearchResults, paginationSearchInput } =
    useSelector((state: { preference: IPreferenceSlice }) => state.preference);

  const { allowedUsers } = useSelector((state: { cms: ICmsData }) => state.cms);

  const dispatch = useDispatch();

  /**
   * @description This function is responsible for fetching hs companies with CVR Number
   */
  const fetchHSCompanies = async () => {
    try {
      setIsLoading(true);
      const portalId = searchParams.get("portalId");

      if (!portalId) throw new Error("Portal Id is missing");

      // Fetch Mappings
      const { data } = await axios.get(getUrl("VITE_FETCH_MAPPINGS"), {
        params: { portalId },
      });

      const cvrNumberKey = data?.basicMappings["CVR Number"].value;
      if (!cvrNumberKey || cvrNumberKey === "undefined")
        throw new Error(
          "Please map the CVR Number in the mapping window to use this feature."
        );

      const companiesList = [];

      // Parameters required for fetching HS companies having CVR Numbers
      let after = 0;
      const limit = 100;

      const { data: companies } = await axios.get(
        getUrl("VITE_FETCH_HS_COMPANIES"),
        {
          params: {
            portalId,
            after,
            limit,
            filterProperty: cvrNumberKey,
          },
        }
      );

      companiesList.push(...companies.results);

      // Getting total count of all companies
      const totalCompaniesCount = companies.total;
      // Calculate number of iterations required to fetch all companies
      const noOfIterations =
        Math.floor(Math.ceil(totalCompaniesCount / limit)) - 1;

      if (noOfIterations > 0) {
        after = companies?.paging.next.after;
        for (let i = 0; i < noOfIterations; i++) {
          // Fetch companies
          const { data: companies } = await axios.get(
            getUrl("VITE_FETCH_HS_COMPANIES"),
            {
              params: {
                portalId,
                after,
                limit,
                filterProperty: cvrNumberKey,
              },
            }
          );

          companiesList.push(...companies.results);

          if (companies.paging && companies?.paging.next.after) {
            after = companies.paging.next.after;
          }
        }
      }

      // resetting the search params
      after = 0;

      // Adding input variable
      const hsCompanies = [] as HubspotCompanies[];
      companiesList.forEach((company) => {
        company.isChecked = false;
        hsCompanies.push(company);
      });

      setBulkUpdateData({
        hsCompanies,
        cvrNumberKey,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  /**
   * @description This function is responsible for storing and updating HubSpot companies
   * @param {Object} event event object of the check box
   * @param {String} companyId HubSpot company Id
   */
  const onSelectCompany = ({
    isChecked,
    companyId,
  }: {
    isChecked: boolean;
    companyId: string | undefined;
  }) => {
    setIsSelectAll(false);

    const updatedCompanies = bulkUpdateData.hsCompanies.map((company) =>
      company.id === companyId ? { ...company, isChecked: isChecked } : company
    );

    setBulkUpdateData({ ...bulkUpdateData, hsCompanies: updatedCompanies });
  };

  /**
   * @description This function is responsible for selecting and unselecting all the companies
   * @param {Object} event event object of the checkbox
   */
  const onSelectAllCompanies = ({ isChecked }: { isChecked: boolean }) => {
    if (isChecked) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
    const updatedCompanies = bulkUpdateData.hsCompanies.map((company) => ({
      ...company,
      isChecked: isChecked,
    }));

    setBulkUpdateData({ ...bulkUpdateData, hsCompanies: updatedCompanies });
  };

  /**
   * @description This function is responsible for getting time for third party API
   */
  const getTime = async () => {
    const { data: timeData } = await axios.get(
      `${getUrl("VITE_GET_CURRENT_TIME")}?timeZone=Europe/Copenhagen`
    );
    currentTime.current = timeData.dateTime;
  };

  /**
   * @description This function is responsible for fetching current time for third party API at regular intervals
   */
  const intervalToGetTime = () => {
    timeIntervalId.current = setInterval(async () => {
      await getTime();
    }, 60000);
  };

  /**
   * @description This function is responsible for calculating delay in minutes
   * @param {String} startTime start time of the bulk update
   * @param {String} currentTime current time
   * @returns {String} difference between current and start time
   */
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

  /**
   * @description This function is responsible for calculating the delay time based on pushed records
   * @param {Number} records total records count
   * @returns {Number} calculated delay time
   */
  const delayTimeCalculation = (records: number) => {
    const calculatedDelay = Math.ceil((2 * records) / 20);
    return calculatedDelay;
  };

  /**
   * @description This function is responsible for getting bulk update stats from DynamoDB
   * @returns {Object} stats
   */
  const getBulkUpdateStats = async () => {
    const portalId = searchParams.get("portalId");

    const { data: stats } = await axios.get(
      getUrl("VITE_GET_BULK_UPDATE_STATS"),
      {
        params: {
          portalId,
        },
      }
    );
    return stats;
  };

  /**
   * @description This function is responsible for setting interval for fetching stats
   */
  const settingIntervals = () => {
    intervalId.current = setInterval(async () => {
      const stats = await getBulkUpdateStats();
      const { bulkUpdate } = stats;
      const { failedRecords, processedRecords, pushedRecords, startTime } =
        bulkUpdate;
      dispatch(
        setBulkFeatureStats({ bulkStatsKey: "bulkUpdate", stats: bulkUpdate })
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
        window.clearInterval(intervalId.current);
        intervalId.current = undefined;
        clearInterval(timeIntervalId.current);
        timeIntervalId.current = undefined;
      }
    }, 3000);
  };

  /**
   * @description This function is responsible for showing modal
   */
  const onShowBulkUpdateModal = async () => {
    try {
      setLoading(true);
      const filteredCompanies = filterHSCompanies() as HubspotCompanies[];
      if (filteredCompanies.length === 0)
        throw new Error(
          "No companies selected. Please select the companies to use this feature."
        );
      setSelectedCompanies(filteredCompanies);

      // Fetch Bulk update stats
      const stats = await getBulkUpdateStats();
      const { bulkUpdate } = stats;
      if (
        Object.keys(stats).length === 0 ||
        (bulkUpdate && Object.keys(bulkUpdate).length === 0)
      ) {
        dispatch(setShowBulkFeatureModal({ showModal: true }));
        dispatch(setShowProgressBar({ show: false }));
      } else {
        const { failedRecords, processedRecords, pushedRecords, startTime } =
          bulkUpdate;
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
              bulkStatsKey: "bulkUpdate",
              stats: bulkUpdate,
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
      setLoading(false);
    }
  };

  const convertDate = (date: number | string | Date) => {
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const newDate = new Date(date);
    return `${
      month[newDate.getMonth()]
    } ${newDate.getDate()}, ${newDate.getFullYear()}`;
  };

  /**
   * @description This function is used for filtering the companies which were checked
   * @returns {Array} filtered companies
   */
  const filterHSCompanies = () => {
    if (
      bulkUpdateData &&
      Object.keys(bulkUpdateData).length > 0 &&
      bulkUpdateData.hsCompanies.length > 0
    ) {
      const filteredCompanies = bulkUpdateData.hsCompanies.filter(
        (company) => company.isChecked === true
      );
      return filteredCompanies;
    }
    return [];
  };

  useEffect(() => {
    fetchHSCompanies();
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

  const userIds = {
    portalId: searchParams.get("portalId"),
    userId: searchParams.get("userId"),
  };

  useEffect(() => {
    dispatch(fetchCmsData());
  }, []);

  useEffect(() => {
    if (allowedUsers.length > 0) {
      dispatch(onChangeIsUserAllowed({ ...userIds, appName: "hubspot" }));
    }
  }, [allowedUsers]);

  return (
    <div>
      <CompanyList
        bulkUpdateSelectedCompanies={selectedCompanies}
        cvrNumberKey={bulkUpdateData.cvrNumberKey}
        getTime={getTime}
        settingIntervals={settingIntervals}
        delayTime={delayTime}
        delayTimeCalculation={delayTimeCalculation}
        intervalId={intervalId}
        timeIntervalId={timeIntervalId}
        userIds={userIds}
        bulkStatsKey="bulkUpdate"
      />

      <ErrorModal />
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
      <Container className="my-5">
        {isLoading ? (
          <div className="d-flex flex-column justify-content-center align-items-center loading-container">
            <div className="d-flex flex-row justify-content-center align-items-center">
              <Spinner
                animation="border"
                variant="primary"
                role="status"
              ></Spinner>
            </div>
          </div>
        ) : (
          <>
            {Object.keys(bulkUpdateData).length > 0 &&
            bulkUpdateData.hsCompanies.length > 0 &&
            bulkUpdateData.cvrNumberKey ? (
              <div>
                <CmsRichText
                  path="cmsContent.bulkUpdate"
                  cssName="mapping-window-header"
                />
                <div className="d-flex flex-row justify-content-between">
                  <div className="mapping-search d-flex my-3 my-md-0">
                    <input
                      type="search"
                      placeholder="Search.."
                      className="input-search"
                      onChange={(event) =>
                        dispatch(
                          setPaginationSearchResults({
                            searchKeyword: event.target.value,
                            searchFor: "bulkUpdate",
                            bulkUpdateCompanies: bulkUpdateData?.hsCompanies,
                            cvrKey: bulkUpdateData?.cvrNumberKey,
                          })
                        )
                      }
                    />
                    <span className="my-auto">
                      <FaSearch size={15} className="me-3 search-icon" />
                    </span>
                  </div>
                  <Button
                    onClick={() => onShowBulkUpdateModal()}
                    className="bulk-update-button"
                    disabled={loading || filterHSCompanies().length === 0}
                  >
                    {loading ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      <span>Bulk update</span>
                    )}
                  </Button>
                </div>

                {paginationSearchResults.length === 0 &&
                paginationSearchInput.length > 0 ? (
                  <SearchResultsNotFound
                    displayText={"No companies found with the search."}
                    noteText={"Try changing your filters."}
                  />
                ) : (
                  <>
                    <Table
                      className="company-table my-4"
                      bordered={true}
                      responsive={true}
                    >
                      <thead className="companies-table-header">
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              id="selectAll"
                              checked={isSelectAll}
                              onChange={(event) =>
                                onSelectAllCompanies({
                                  isChecked: event.target.checked,
                                })
                              }
                              className="company-table-checkbox"
                            />
                          </th>
                          <th>COMPANY NAME</th>
                          <th>{bulkUpdateData.cvrNumberKey}</th>
                          <th>DOMAIN</th>
                          <th>CREATE DATE</th>
                        </tr>
                      </thead>
                      {slicedCompanies && slicedCompanies.length > 0 && (
                        <tbody className="companies-table-body">
                          {slicedCompanies.map((company) => (
                            <tr key={company.id}>
                              <td>
                                <input
                                  type="checkbox"
                                  id={company.id}
                                  checked={company.isChecked}
                                  onChange={(event) =>
                                    onSelectCompany({
                                      isChecked: event.target.checked,
                                      companyId: company.id,
                                    })
                                  }
                                  className="company-table-checkbox"
                                />
                              </td>
                              {company && company.properties && (
                                <>
                                  <td>{company.properties.name}</td>
                                  <td>
                                    {company.properties[
                                      bulkUpdateData.cvrNumberKey
                                    ]
                                      ? company.properties[
                                          bulkUpdateData.cvrNumberKey
                                        ]
                                      : "-"}
                                  </td>
                                  <td>
                                    {company.properties.domain
                                      ? company.properties.domain
                                      : "-"}
                                  </td>
                                  <td>
                                    {company.properties.createdate
                                      ? convertDate(
                                          company.properties.createdate
                                        )
                                      : "-"}
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </Table>

                    <Pagination
                      paginationData={bulkUpdateData.hsCompanies}
                      itemsPerPage={10}
                    />
                  </>
                )}
              </div>
            ) : (
              <SearchResultsNotFound
                displayText={"No companies found."}
                noteText={
                  "Please map the CVR Number in the Mapping Window and also provide the valid CVR Number in the HubSpot companies."
                }
              />
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default BulkUpdate;
