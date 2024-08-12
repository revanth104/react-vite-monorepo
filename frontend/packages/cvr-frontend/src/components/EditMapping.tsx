import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { updateMapping, cancelMapping } from "../slice/cvrMappingSlice";
import MappingDropdown from "./MappingDropdown";

import { IField, IAppFields, IFields } from "../types/cvrMappingTypes";

interface IProps {
  mappedItem: [string, IField];
  mappings: {
    [k: string]: IFields;
  };
  storedKey: string;
  appProperties: IAppFields[];
  selectedPreference: IAppFields;
  isCvrCheck?: boolean;
  deletedProperties: string[];
  title: string;
}

const EditMapping = (props: IProps) => {
  const {
    mappedItem,
    mappings,
    storedKey,
    appProperties,
    selectedPreference,
    isCvrCheck,
    deletedProperties,
    title,
  } = props;

  const dispatch = useDispatch();

  const selectDefaultProperty = (value: IField) => {
    if (deletedProperties.includes(value.value ?? "")) {
      return {
        label: "Custom property deleted",
        value: "-doesn'texists-",
        type: "",
      };
    } else {
      return value;
    }
  };

  return (
    <>
      <td style={{ width: "400px" }} className="ps-4 display-field-label">
        <span>{mappedItem[0]}</span>
        <br />
        <span className="description-text">
          {mappedItem[1].cvrFieldDescription}
        </span>
      </td>
      <td style={{ width: "400px" }} className="ps-4">
        <MappingDropdown
          selectedPreference={selectedPreference}
          appProperties={appProperties}
          mappedItem={mappedItem}
          title={title}
          deletedProperties={deletedProperties}
          mappings={mappings}
        />
      </td>
      <td className="d-flex flex-row justify-content-end align-items-center pe-4">
        <div className="d-flex flex-row justify-content-end align-items-center">
          {(isCvrCheck && Object.keys(selectedPreference).length > 0) ||
          (Object.keys(selectedPreference).length > 0 &&
            selectDefaultProperty(mappedItem[1]).value !==
              selectedPreference.value) ? (
            <Button
              className="me-2 save-button"
              onClick={() =>
                dispatch(updateMapping({ title, cvrKey: mappedItem[0] }))
              }
            >
              Save
            </Button>
          ) : (
            ""
          )}
          {!isCvrCheck && storedKey !== "CVR Number" && (
            <Button
              className={`cancel-button`}
              onClick={() => dispatch(cancelMapping({}))}
            >
              Cancel
            </Button>
          )}
        </div>
      </td>
    </>
  );
};

export default EditMapping;
