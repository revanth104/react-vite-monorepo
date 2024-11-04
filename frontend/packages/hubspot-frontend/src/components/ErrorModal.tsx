import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ImCross } from "react-icons/im";

import { onHideErrorModal } from "@cloudify/generic";
import { IPreferenceSlice } from "@cloudify/generic/src/types/preferenceTypes";

type ErrorModalProps = {
  CmsRichText: React.ComponentType<{ path: string; cssName?: string }>;
};

const ErrorModal = (props: ErrorModalProps) => {
  const { CmsRichText } = props;
  const dispatch = useDispatch();
  const { errorMessage } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );
  const {
    cmsData: { loading: cmsLoading },
    /* eslint-disable @typescript-eslint/no-explicit-any */
  } = useSelector((state: { cms: any }) => state.cms);

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
        onHide={() => dispatch(onHideErrorModal())}
      >
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div className="error-modal-header">
            <div
              className="modal-error-box mx-auto"
              onClick={() => dispatch(onHideErrorModal())}
            >
              <ImCross className="modal-cross-icon" />
            </div>
            {checkContentFrom() ? (
              <>
                {!cmsLoading && (
                  <CmsRichText path={errorMessage[0]} cssName="modal-message" />
                )}
              </>
            ) : (
              <p className="modal-message p-3">{errorMessage[0]}</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ErrorModal;
