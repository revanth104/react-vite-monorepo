import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCheck } from "react-icons/ai";

import { onHideSuccessModal } from "../slice/preferenceSlice";
import { IPreferenceSlice } from "../types/preferenceTypes";

interface IProps {
  CmsRichText?: React.ComponentType<{ path: string; cssName?: string }>;
}

const SuccessModal = (props: IProps) => {
  const { CmsRichText } = props;
  const dispatch = useDispatch();
  const { successMessage } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const checkContentFrom = () => {
    const message = successMessage.split(".");
    const messageFrom = message.includes("cmsContent");
    return messageFrom;
  };

  return (
    <div>
      <Modal
        className="my-modal d-flex flex-row justify-content-center"
        onHide={() => dispatch(onHideSuccessModal({}))}
        show={successMessage !== ""}
      >
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div className="modal-msg-header">
            <div
              className="modal-check-box mx-auto"
              onClick={() => dispatch(onHideSuccessModal({}))}
            >
              <AiOutlineCheck className="modal-check-icon" />
            </div>
            {checkContentFrom() ? (
              <>
                {CmsRichText && (
                  <CmsRichText path={successMessage} cssName="modal-message" />
                )}
              </>
            ) : (
              <p className="modal-message p-3">{successMessage}</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SuccessModal;
