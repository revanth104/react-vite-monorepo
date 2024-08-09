import React from "react";
import { ProgressBar, Spinner } from "react-bootstrap";

interface IProps {
  bulkUpdateStats: {
    [key: string]: number;
  };
  delayTime: string | number;
  delayTimeCalculation: (pushedRecords: number) => number | string;
}

const ProgressBarSection = (props: IProps) => {
  const { bulkUpdateStats, delayTime, delayTimeCalculation } = props;
  const { pushedRecords, processedRecords, failedRecords } = bulkUpdateStats;
  console.log(bulkUpdateStats);
  // calculate percentage
  const percentageCalculation = () => {
    if (pushedRecords === 0) {
      return 0;
    } else {
      return Math.floor(
        ((processedRecords + failedRecords) / pushedRecords) * 100
      );
    }
  };

  return (
    <div>
      {bulkUpdateStats &&
      Object.keys(bulkUpdateStats).length > 0 &&
      bulkUpdateStats.pushedRecords > 0 ? (
        <div>
          <p className="progress-bar-bold-text">
            {pushedRecords === processedRecords + failedRecords ||
            delayTime >= delayTimeCalculation(pushedRecords) ? (
              <span>
                {window.location.pathname === "/bulkupdate"
                  ? "Update complete"
                  : "Creating Companies Completed."}
              </span>
            ) : (
              <span>
                {window.location.pathname === "/bulkupdate"
                  ? "Updating"
                  : "Creating Companies"}
              </span>
            )}
          </p>
          <div className="d-flex flex-row justify-content-between progress-bar-normal-text">
            <span>Progress...</span>
            <span>{percentageCalculation()}%</span>
          </div>
          <ProgressBar
            min={0}
            max={pushedRecords}
            now={failedRecords + processedRecords}
            className="my-3"
          />
          <p className="progress-bar-normal-text">
            All {pushedRecords} companies are being{" "}
            {window.location.pathname === "/bulkupdate" ? "updated" : "created"}
            .
          </p>
          <p className="progress-bar-normal-text">
            Companies successfully{" "}
            {window.location.pathname === "/bulkupdate" ? "updated" : "created"}
            : <b>{processedRecords}</b>
            <br />
            Companies failed to{" "}
            {window.location.pathname === "/bulkupdate"
              ? "update"
              : "create"}: <b>{failedRecords}</b>
          </p>
          <p className="progress-bar-normal-text">
            <b>Note: </b>
            <span>
              The process will be completed in the background, so you can close
              the popup window and can come back to view the progress.
            </span>
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center my-3">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <Spinner
              animation="border"
              variant="success"
              role="status"
            ></Spinner>
            <p className="progress-bar-bold-text mt-3">
              {window.location.pathname === "/bulkupdate" ? "Update" : "Create"}{" "}
              in progress...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBarSection;
