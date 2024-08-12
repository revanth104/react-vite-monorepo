import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ImCross } from "react-icons/im";
import { useSearchParams } from "react-router-dom";

import { onHideErrorModal } from "../slice/preferenceSlice";
import { IPreferenceSlice } from "../types/preferenceTypes";

type ErrorModalProps = {
  CmsRichText?: React.ComponentType<{ path: string; cssName?: string }>;
  displayUrl?: boolean;
};

const ErrorModal = (props: ErrorModalProps) => {
  const { CmsRichText, displayUrl = false } = props;
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { errorMessage } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const portalId = searchParams.get("portalId");
  const userId = searchParams.get("userId");

  const checkContentFrom = () => {
    let messageFrom = false;
    if (errorMessage.length > 0) {
      const message = errorMessage[0].split(".");
      messageFrom = message.includes("cmsContent");
    }
    return messageFrom;
  };

  return (
    <div>
      <Modal
        className="my-modal d-flex flex-row justify-content-center"
        show={errorMessage.length > 0}
        onHide={() => dispatch(onHideErrorModal({}))}
      >
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div className="error-modal-header">
            <div
              className="modal-error-box mx-auto"
              onClick={() => dispatch(onHideErrorModal({}))}
            >
              <ImCross className="modal-cross-icon" />
            </div>
            {checkContentFrom() ? (
              <>
                {CmsRichText && (
                  <CmsRichText path={errorMessage[0]} cssName="modal-message" />
                )}
              </>
            ) : (
              <p className="modal-message p-3">
                {errorMessage[0]}{" "}
                {displayUrl && (
                  <span>
                    To upgrade subscription please click{" "}
                    <a
                      href={`/subscription?portalId=${portalId}&userId=${userId}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      here
                    </a>
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ErrorModal;
