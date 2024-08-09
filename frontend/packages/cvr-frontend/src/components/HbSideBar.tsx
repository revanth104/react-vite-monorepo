import React, { useState } from "react";
import { Offcanvas, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios, { AxiosError } from "axios";

import { BiCodeAlt } from "react-icons/bi";
import { BsCardText } from "react-icons/bs";

import { getUrlInCvr } from "../helpers/url";

import { fetchAppFields } from "../slice/cvrMappingSlice";

import { IHSPropertyCreation } from "../types/cvrMappingTypes";

import {
  setShowSuccessModal,
  setShowErrorModal,
} from "../slice/preferenceSlice";

import { IPreferenceSlice } from "../types/preferenceTypes";

interface IProps {
  mappingKeys: string[];
}

const HbSideBar = (props: IProps) => {
  const { mappingKeys } = props;
  const [show, setShow] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldDescription, setFieldDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();

  const { userIds } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  /**
   * Function creates a new HubSpot property
   */
  const createHubspotProperty = async () => {
    let name;
    let label;
    if (fieldName !== "" && fieldLabel !== "" && fieldName && fieldLabel) {
      try {
        setLoading(true);

        if (/^\d/.test(fieldName))
          throw new Error("Name field should not start with Number");

        if (/^[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]+/.test(fieldName)) {
          throw new Error("Name field should not start with Special Character");
        }

        const newName = fieldName
          .trim()
          .toLowerCase()
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .split(" ")
          .join("_");
        name = newName;

        label = fieldLabel.trim();

        const portalId = searchParams.get("portalId") ?? "";
        const objectType = mappingKeys.length > 1 ? "companies" : "contacts";
        const data: IHSPropertyCreation = {
          portalId: parseInt(portalId),
          label,
          name,
          objectType,
        };

        if (fieldDescription) data.description = fieldDescription;
        // Post data to backend endpoint
        await axios.post(
          `${getUrlInCvr("VITE_CREATE_TRIGGER_APP_PROPERTY")}`,
          data
        );
        // Fetch HubSpot fields
        dispatch(fetchAppFields({ userIds }));

        dispatch(
          setShowSuccessModal({
            message: "New HubSpot property created successfully.",
          })
        );
      } catch (error) {
        console.log(error);
        console.log(error);
        let errorMessage;
        if (error instanceof Error) errorMessage = error.message;
        if (
          error instanceof AxiosError &&
          error.response &&
          error.response.data.message
        )
          errorMessage = error.response.data.message;
        dispatch(setShowErrorModal({ message: errorMessage }));
        throw error;
      } finally {
        setLoading(false);
        setFieldName("");
        setFieldLabel("");
        setFieldDescription("");
        setShow(false);
      }
    }
  };

  return (
    <div>
      <button className="sidebar-cancel-button" onClick={handleShow}>
        Create Property
      </button>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header className="sidebar-header" closeButton>
          <Offcanvas.Title>Create a new property</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            <div className="my-4">
              <label className="form-label" htmlFor="customLabel">
                Label*
              </label>
              <div className="d-flex flex-row">
                <input
                  id="customLabel"
                  type="text"
                  onChange={(event) => setFieldLabel(event.target.value)}
                  className="sidebar-label-input form-control"
                />
                <span className="mx-2 my-auto">
                  <BiCodeAlt size={30} className="code-icon" />
                </span>
              </div>
              <p className="hint-text mt-2">
                *This is the name of the property as it appears in your HubSpot
                CRM, including on records and index pages.
              </p>
            </div>

            <div className="my-4">
              <label className="form-label" htmlFor="customName">
                Name*
              </label>
              <div className="d-flex flex-row">
                <input
                  id="customName"
                  type="text"
                  onChange={(event) => setFieldName(event.target.value)}
                  className="sidebar-label-input form-control"
                />
                <span className="mx-2 my-auto">
                  <BiCodeAlt size={30} className="code-icon" />
                </span>
              </div>
              <p className="hint-text mt-2">
                *This is the value of the property must contain only lowercase
                letters, numbers, and underscores. Also it must start with a
                letter.
              </p>
            </div>

            <div className="my-4">
              <label className="form-label" htmlFor="customDescription">
                Description
              </label>
              <div className="d-flex flex-row">
                <input
                  id="customDescription"
                  type="text"
                  onChange={(event) => setFieldDescription(event.target.value)}
                  className="sidebar-label-input form-control"
                />
                <span className="mx-2 my-auto">
                  <BsCardText size={30} className="code-icon" />
                </span>
              </div>
              <p className="hint-text mt-2">
                *This is the Description of the HubSpot property.
              </p>
            </div>
          </div>
        </Offcanvas.Body>
        <div className="sidebar-footer d-flex flex-column justify-content-center align-items-center">
          <div className="w-100 px-3 d-flex justify-content-between">
            <button onClick={handleClose} className="sidebar-cancel-button">
              Cancel
            </button>
            <button
              disabled={fieldName === "" || fieldLabel === ""}
              onClick={createHubspotProperty}
              className="sidebar-cancel-button"
            >
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <span>Create</span>
              )}
            </button>
          </div>
        </div>
      </Offcanvas>
    </div>
  );
};

export default HbSideBar;