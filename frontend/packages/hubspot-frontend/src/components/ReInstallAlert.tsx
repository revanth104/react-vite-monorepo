import React from "react";
import { Alert } from "react-bootstrap";
import { useSelector } from "react-redux";

import { IHubspotSlice } from "../types/types";

interface IProps {
  installUrl: string;
}

const ReInstallAlert = (props: IProps) => {
  const { installUrl } = props;
  const { missingScope } = useSelector(
    (state: { hubspot: IHubspotSlice }) => state.hubspot
  );

  return (
    <>
      {missingScope && (
        <Alert variant="warning" className="w-75">
          <p className="mb-0">
            To access the latest features of the application please{" "}
            <Alert.Link href={installUrl} target="_top">
              reinstall
            </Alert.Link>{" "}
            the application again.
          </p>
        </Alert>
      )}
    </>
  );
};

export default ReInstallAlert;
