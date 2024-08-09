/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { getCmsUrl } from "../helpers/url.js";
import { onChangeIsAllowedUser, onChangeIsEdit } from "../slice/cmsSlice.js";
import { ICmsData } from "../types/cmsTypes.js";

interface IProps {
  appSlug?: string;
  setShowSuccessModal: any;
  setShowErrorModal: any;
  editNotificationPath?: string;
}

export const CmsEditAndSave = (props: IProps) => {
  const {
    appSlug,
    setShowSuccessModal,
    setShowErrorModal,
    editNotificationPath,
  } = props;

  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    isEdit,
    isAllowedUser,
    cmsData: { data },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  const dispatch = useDispatch();

  const handleEdit = () => {
    dispatch(onChangeIsEdit({ isEdit: true }));
    setShowSaveBtn(true);
  };

  const handleClose = () => {
    dispatch(onChangeIsEdit({ isEdit: false }));
    dispatch(onChangeIsAllowedUser({ isAllowedUser: false }));
  };

  const handlePreview = () => {
    dispatch(onChangeIsEdit({ isEdit: false }));
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      await axios.post(getCmsUrl("VITE_SAVE_CMS_CONTENT"), {
        appSlug: appSlug,
        data: data,
      });
      dispatch(onChangeIsEdit({ isEdit: false }));
      setShowSaveBtn(false);
      dispatch(
        setShowSuccessModal({ message: "Content changes saved successfully" })
      );
    } catch (error: any) {
      console.log(error);
      let errorMessage;
      if (error.response && error.response.data.message)
        errorMessage = error.response.data.message;
      else errorMessage = error.message;
      console.log(errorMessage);
      dispatch(setShowErrorModal({ message: errorMessage }));
    } finally {
      setIsLoading(false);
    }

    return "Content saved successfully";
  };

  const handleCancel = () => {
    dispatch(onChangeIsEdit({ isEdit: false }));
    setShowSaveBtn(false);
  };

  return (
    <>
      {isAllowedUser && (
        <div className="pms-dialog-box d-flex flex-column justify-content-between">
          <div>
            <button className="close-button" onClick={handleClose}>
              &#x2716;
            </button>
          </div>
          <p className="text-center mt-2">
            To change the content click on the edit button below.
          </p>
          <div className="d-flex flex-row justify-content-end me-3 mb-3">
            {window.location.pathname !== "/cms-notifications" && (
              <Button className="edit-notification-btn me-2">
                <a
                  href={`cms-notifications?${editNotificationPath}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Edit notifications
                </a>
              </Button>
            )}
            {showSaveBtn && (
              <Button
                className="save-content-changes-btn"
                onClick={() => handleSaveChanges()}
              >
                {isLoading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <span>Save</span>
                )}
              </Button>
            )}
            {!isEdit && (
              <Button
                className="save-content-changes-btn ms-2"
                onClick={() => handleEdit()}
              >
                Edit
              </Button>
            )}

            {isEdit && (
              <button
                onClick={() => handlePreview()}
                className="preview-btn ms-2"
              >
                Preview
              </button>
            )}
            {isEdit && (
              <button
                className="cancel-button px-3 ms-2"
                onClick={() => handleCancel()}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
