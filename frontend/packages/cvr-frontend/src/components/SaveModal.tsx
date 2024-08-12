import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Spinner } from "react-bootstrap";

import { saveMappings } from "../helpers/saveMappings";
import { hideSaveModal } from "../slice/preferenceSlice";
import {
  fetchMappings,
  setIsMappingsSaved,
  storeActiveKey,
} from "../slice/cvrMappingSlice";
import { ICvrMappingSlice, IFields } from "../types/cvrMappingTypes";
import { IPreferenceSlice } from "../types/preferenceTypes";

const SaveModal = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [discardBtnLoading, setDiscardBtnLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const {
    isMappingsSaved,
    isCvrCheck,
    deletedProperties,
    mappings: {
      defaultMappings: { basicMappings, financialMappings, contactMappings },
    },
    contactCreation,
    activeKey,
  } = useSelector(
    (state: { cvrMapping: ICvrMappingSlice }) => state.cvrMapping
  );

  const { userIds, showSaveModal } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const mappingsKey =
    activeKey === "companyMappings"
      ? ["basicMappings", "financialMappings"]
      : ["contactMappings"];

  const mappings: { [key: string]: IFields } =
    activeKey === "companyMappings"
      ? { basicMappings, financialMappings }
      : { contactMappings };

  const renderText = () => {
    if (isCvrCheck) {
      return "Please map the CVR Number as it is required field to continue.";
    } else if (deletedProperties.length > 0) {
      return "Please remap the fields for which custom property has been deleted.";
    } else if (isMappingsSaved) {
      return "You've made changes that haven't been saved yet. Please either save or discard these changes to continue.";
    }
  };

  const saveChanges = async () => {
    setLoading(true);
    await saveMappings({
      mappings,
      userIds,
      dispatch,
      setIsLoading: setLoading,
      contactCreation,
      mappingKeys: mappingsKey,
    });
    setLoading(false);
    dispatch(hideSaveModal({}));
    dispatch(setIsMappingsSaved({}));
  };

  const discardChanges = async () => {
    setDiscardBtnLoading(true);
    await dispatch(
      fetchMappings({
        userIds,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any
    );
    setDiscardBtnLoading(false);
    dispatch(hideSaveModal({}));
    dispatch(setIsMappingsSaved({}));
  };

  const renderButtons = () => {
    if (isCvrCheck || deletedProperties.length > 0) {
      return (
        <button
          className="btn add-btn"
          onClick={() => {
            window.scrollTo(0, 380);
            dispatch(hideSaveModal({}));
            dispatch(storeActiveKey({ activeKey: "companyMappings" }));
          }}
        >
          Edit
        </button>
      );
    } else if (isMappingsSaved) {
      return (
        <>
          <Button
            className="me-3"
            variant="danger"
            onClick={() => discardChanges()}
            style={{ width: "100px" }}
          >
            {discardBtnLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              <span>Discard</span>
            )}
          </Button>
          <button onClick={() => saveChanges()} className="btn add-button">
            {loading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              <span>Save changes</span>
            )}
          </button>
        </>
      );
    }
  };

  return (
    <Modal
      show={showSaveModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <p>{renderText()}</p>
        <div className="d-flex flex-row justify-content-end">
          {renderButtons()}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SaveModal;
