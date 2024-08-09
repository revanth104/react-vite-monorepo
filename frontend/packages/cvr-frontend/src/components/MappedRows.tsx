import React from "react";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { editMapping, deleteMapping } from "../slice/cvrMappingSlice";

import { IField } from "../types/cvrMappingTypes";

interface IProps {
  mappedItem: [string, IField];
  storedKey: string;
  deletedProperties: string[];
  isEditMapping: boolean;
  mappingKeys?: string[];
}

const MappedRows = (props: IProps) => {
  const {
    mappedItem,
    storedKey,
    deletedProperties,
    isEditMapping,
    mappingKeys,
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
      <td style={{ width: "400px" }} className="ps-4 display-field-label">
        <span>
          {selectDefaultProperty(mappedItem[1]).label === "" ? (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip style={{ fontSize: "12px" }}>
                  To add mapping for this field click on Action-edit or leave as
                  it is to not map this field.
                </Tooltip>
              }
            >
              <span style={{ cursor: "pointer", color: "#7a91ab" }}>
                Not Mapped
              </span>
            </OverlayTrigger>
          ) : (
            <>
              <span
                className={`${
                  selectDefaultProperty(mappedItem[1]).label ===
                  "Custom property deleted"
                    ? "text-danger"
                    : ""
                }`}
              >
                {selectDefaultProperty(mappedItem[1]).label}
              </span>
              <br />
              <span className="description-text">
                {selectDefaultProperty(mappedItem[1]).description}
              </span>
            </>
          )}
        </span>
      </td>
      <td className="pe-4 d-flex flex-row justify-content-end align-items-center">
        <div className="d-flex flex-row justify-content-end align-items-center">
          <Button
            className="me-3 edit-button"
            disabled={isEditMapping}
            onClick={() => dispatch(editMapping({ cvrKey: mappedItem[0] }))}
          >
            Edit
          </Button>
          <Button
            className="delete-button"
            disabled={
              isEditMapping ||
              mappedItem[1]?.required === true ||
              (storedKey ? storedKey !== mappedItem[0] : false)
            }
            onClick={() =>
              dispatch(deleteMapping({ cvrKey: mappedItem[0], mappingKeys }))
            }
          >
            Delete
          </Button>
        </div>
      </td>
    </>
  );
};

export default MappedRows;
