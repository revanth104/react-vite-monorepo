import React from "react";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { ISearchWindowSlice } from "../types/searchWindowTypes";
import { setShowMultipleOrgModal } from "../slice/searchWindowslice";

interface IProps {
  totalCompanies: number;
  success: number;
  failure: number;
  failureCvrNumbers: number[];
}

const MultipleCreateOrgModal = (props: IProps) => {
  const { totalCompanies, success, failure, failureCvrNumbers } = props;
  const dispatch = useDispatch();

  const { showMultipleOrgModal } = useSelector(
    (state: { searchWindow: ISearchWindowSlice }) => state.searchWindow
  );

  return (
    <Modal
      centered
      show={showMultipleOrgModal}
      onHide={() => dispatch(setShowMultipleOrgModal({ show: false }))}
      className="multi-select-modal"
    >
      <Modal.Body>
        <div>
          <p>Total companies selected: {totalCompanies}</p>
          <p>Successfully created: {success}</p>
          <p>Failed to create: {failure}</p>
          <div>
            <p>
              CVR Numbers failed to create to Companies with following CVR
              Numbers are already present in your hubspot account:
            </p>
            {failureCvrNumbers &&
              failureCvrNumbers.length > 0 &&
              failureCvrNumbers.map((cvr) => <p key={cvr}>{cvr}</p>)}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          onClick={() => dispatch(setShowMultipleOrgModal({ show: false }))}
          className="industry-type-save-btn"
        >
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default MultipleCreateOrgModal;
