import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { GoDotFill } from "react-icons/go";

export interface IConnectedAccount {
  buttonText: string;
  connectedAccount: string;
  disConnectAccount: () => void;
  disConnectBtnLoading: boolean;
}

const ConnectedAccount = (props: IConnectedAccount) => {
  const {
    buttonText,
    connectedAccount,
    disConnectAccount,
    disConnectBtnLoading,
  } = props;
  return (
    <div className="d-flex flex-row justify-content-between align-items-center mb-4 connected-container w-100 py-3 px-2">
      <div className="d-flex flex-row align-items-center">
        <p className="mb-0 ms-1">
          <span>
            <GoDotFill color="#54DD9D" size={20} className="me-2" />
          </span>
          {connectedAccount ? (
            <span>
              Connected account: <b>{connectedAccount}</b>
            </span>
          ) : (
            <span>Account connected</span>
          )}
        </p>
      </div>
      <div>
        <Button className="unlink-btn py-0" onClick={() => disConnectAccount()}>
          {disConnectBtnLoading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <span>{buttonText}</span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConnectedAccount;
