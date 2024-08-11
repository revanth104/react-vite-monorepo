import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios, { AxiosError } from "axios";

import ErrorModal from "./ErrorModal";
import { setShowErrorModal } from "../slice/preferenceSlice";
import ProgressBarSection from "./ProgressBarSection";
import { getUrlInCvr } from "../helpers/url";
import {
  setBulkFeatureStats,
  setShowProgressBar,
  setShowBulkFeatureModal,
} from "../slice/preferenceSlice";

import { IPreferenceSlice, ICompanies } from "../types/preferenceTypes";
import { ISelectedCompanies } from "../types/searchWindowTypes";

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
  bulkUpdateSelectedCompanies?: ICompanies[];
  searchSelectedCompanies?: ISelectedCompanies[];
  cvrNumberKey?: string;
  getTime: () => Promise<void>;
  settingIntervals: () => void;
  delayTime: string | number;
  delayTimeCalculation: (records: number) => number;
  intervalId: React.MutableRefObject<NodeJS.Timeout | undefined>;
  timeIntervalId: React.MutableRefObject<NodeJS.Timeout | undefined>;
  userIds: {
    [key: string]: string | number;
  };
  bulkStatsKey?: string;
  searchQuery?: () => ISearchQuery;
}

const CompanyList = (props: IProps) => {
  const {
    showBulkFeatureModal,
    bulkFeatureStats: { bulkUpdate, bulkCreate },
    showProgressBar,
  } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const {
    bulkUpdateSelectedCompanies,
    searchSelectedCompanies,
    cvrNumberKey,
    getTime,
    settingIntervals,
    delayTime,
    delayTimeCalculation,
    intervalId,
    timeIntervalId,
    userIds,
    bulkStatsKey,
    searchQuery,
  } = props;

  const dispatch = useDispatch();
  const [isUpdatingOrCreating, setIsUpdatingOrCreating] = useState(false);
  const [showLink, setShowLink] = useState(false);

  const path = window.location.pathname;

  const onHandleCloseModal = () => {
    dispatch(setShowBulkFeatureModal({ showModal: false }));
    timeIntervalId.current = undefined;
    intervalId.current = undefined;
  };

  /**
   * @description This function is used for fetching the subscription details
   */
  const fetchSubscriptionDetails = async () => {
    const { data: subscriptionData } = await axios.get(
      getUrlInCvr("VITE_GET_PLAN_URL"),
      {
        params: userIds,
      }
    );
    return subscriptionData;
  };

  const getCompanies = () => {
    if (path === "/bulkupdate" && bulkUpdateSelectedCompanies) {
      const selectedCompanies = bulkUpdateSelectedCompanies.map(
        (company: ICompanies) => {
          return {
            objectId: company.id,
            cvrNumber: company?.properties?.[cvrNumberKey as string],
          };
        }
      );
      return selectedCompanies;
    } else if (searchSelectedCompanies) {
      const companiesCvrNumbers: number[] = [];
      searchSelectedCompanies.map((company) =>
        companiesCvrNumbers.push(company.cvrNumber)
      );
      return companiesCvrNumbers;
    }
    return [] as ICompanies[] | ISelectedCompanies[];
  };

  /**
   * @description This function is responsible for performing bulk update
   */
  const onBulkUpdateOrCreate = async () => {
    try {
      setIsUpdatingOrCreating(true);
      const stats = {
        failedRecords: 0,
        pushedRecords: 0,
        processedRecords: 0,
        totalRecords: 0,
      };
      dispatch(setBulkFeatureStats({ bulkStatsKey, stats }));

      const filteredCompanies: ICompanies[] | ISelectedCompanies[] | number[] =
        getCompanies();

      let postBody = {};
      const path = window.location.pathname;
      if (path === "/bulkupdate") {
        postBody = {
          ...userIds,
          selectedSearchResults: filteredCompanies,
          cvrNumberKey,
          trigger: "bulkUpdate",
        };
      } else {
        postBody = {
          ...userIds,
          selectedSearchResults: searchSelectedCompanies,
          queries:
            path === "/query-search" && searchQuery
              ? searchQuery().queries
              : [],
          trigger: "bulkCreate",
        };
      }
      const subscription = await fetchSubscriptionDetails();

      if (subscription.usageCount >= 15 && subscription.plan === "basic") {
        setShowLink(true);
        throw new Error(
          "The Trial period of this app has expired. To continue using it, please upgrade to Premium plan."
        );
      }

      if (subscription.plan === "premium-cancelled") {
        setShowLink(true);
        throw new Error(
          "Your Premium plan has been cancelled. Please upgrade to premium to continue using this feature."
        );
      }

      if (
        subscription.plan === "basic" &&
        filteredCompanies.length > 15 - subscription.usageCount
      ) {
        setShowLink(true);
        throw new Error(
          `Credits are not sufficient to perform Bulk ${
            path === "/bulkupdate" ? "Update" : "Create"
          } in this Trial plan. Please upgrade to premium to continue using this feature.`
        );
      }

      await axios.post(getUrlInCvr("VITE_BULK_CREATE_TRIGGER"), {
        ...postBody,
      });

      dispatch(setShowProgressBar({ show: true }));
      await getTime();
      settingIntervals();
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
      setIsUpdatingOrCreating(false);
    }
  };

  return (
    <>
      <ErrorModal displayUrl={showLink} />

      <Modal show={showBulkFeatureModal} centered className="bulk-modal">
        <Modal.Header>
          <Modal.Title>
            Bulk {path === "/bulkupdate" ? "Update" : "Create"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {showProgressBar ? (
              <div>
                <ProgressBarSection
                  bulkUpdateStats={
                    path === "/bulkupdate" ? bulkUpdate : bulkCreate
                  }
                  delayTime={delayTime}
                  delayTimeCalculation={delayTimeCalculation}
                />
              </div>
            ) : (
              <div>
                <p className="company-names-heading">Company names</p>
                <ul className="unordered-company-list">
                  {path === "/bulkupdate" ? (
                    <>
                      {bulkUpdateSelectedCompanies &&
                        bulkUpdateSelectedCompanies.map(
                          (company: ICompanies) => (
                            <li
                              key={company.id}
                              className="my-1 company-name-text"
                            >
                              {company.properties && company.properties.name}
                            </li>
                          )
                        )}
                    </>
                  ) : (
                    <>
                      {searchSelectedCompanies &&
                        searchSelectedCompanies.map(
                          (company: ISelectedCompanies) => (
                            <li
                              key={company.cvrNumber}
                              className="my-1 company-name-text"
                            >
                              {company.companyName}
                            </li>
                          )
                        )}
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {showProgressBar ? (
            <Button
              className="bulk-modal-cancel-btn"
              onClick={onHandleCloseModal}
            >
              Close
            </Button>
          ) : (
            <>
              <Button
                className="bulk-modal-update-btn"
                disabled={isUpdatingOrCreating}
                onClick={onBulkUpdateOrCreate}
              >
                {isUpdatingOrCreating ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <span>{path === "/bulkupdate" ? "Update" : "Create"}</span>
                )}
              </Button>
              <Button
                className="bulk-modal-cancel-btn"
                onClick={onHandleCloseModal}
                disabled={isUpdatingOrCreating}
              >
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CompanyList;
