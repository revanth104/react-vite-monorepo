import React, { useState } from "react";
import { Dropdown, Spinner } from "react-bootstrap";
import { GoSearch } from "react-icons/go";
import { useDispatch } from "react-redux";

import { setSelectedPreference } from "../slice/cvrMappingSlice";
import { IFields, IAppFields, IField } from "../types/cvrMappingTypes";

interface IProps {
  selectedPreference: IAppFields;
  mappedItem: [string, IField];
  appProperties: IAppFields[];
  deletedProperties: string[];
  title: string;
  mappings: {
    [k: string]: IFields;
  };
}

const MappingDropdown = (props: IProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<IAppFields[]>([]);
  const dispatch = useDispatch();

  const {
    selectedPreference,
    mappedItem,
    appProperties,
    deletedProperties,
    title,
    mappings,
  } = props;

  const onSearchFields = (enteredInput: string) => {
    setSearchInput(enteredInput);
    const filteredData = appProperties.filter((el) => {
      return el.label?.toLowerCase().includes(enteredInput.toLowerCase());
    });

    setSearchResults(filteredData);
  };

  const selectDefaultProperty = (value: IField) => {
    if (deletedProperties.includes(value.value ?? "")) {
      return {
        label: `HubSpot custom property deleted`,
        value: "-doesn'texists-",
        type: "",
      };
    } else {
      return value;
    }
  };

  const toggleDropdownText = () => {
    if (selectedPreference && Object.keys(selectedPreference).length > 0) {
      return selectedPreference.label;
    } else if (mappedItem[1]?.label !== "") {
      return mappedItem[1]?.label;
    } else if (
      selectedPreference &&
      Object.keys(selectedPreference).length === 0
    ) {
      return "Select";
    }
    return "";
  };

  const disabledApp = (appProperty: IAppFields, cvrFieldType: string) => {
    if (cvrFieldType) {
      if (cvrFieldType === "number") {
        return appProperty.type === "string" || appProperty.type === "number";
      } else if (
        cvrFieldType === "string" ||
        cvrFieldType === "boolean" ||
        cvrFieldType === "date"
      ) {
        return appProperty.type === "string";
      }
    } else {
      return true;
    }
    return "";
  };

  const checkDisableHsValue = (title: string, value: string) => {
    if (title === "basicMappings") {
      return Object.entries(mappings.financialMappings).find((mapping) => {
        return mapping[1].value === value;
      });
    } else {
      return Object.entries(mappings.basicMappings).find((mapping) => {
        return mapping[1].value === value;
      });
    }
  };

  const disableAppFields = (title: string, value: string) => {
    if (
      title === "financialMappings" &&
      Object.keys(mappings.financialMappings).length <= 0
    ) {
      return Object.entries(mappings.basicMappings).find((mapping) => {
        return mapping[1].value === value;
      });
    } else if (Object.keys(mappings).length <= 1) {
      return Object.entries(mappings[title]).find((mapping) => {
        return mapping[1].value === value;
      });
    } else {
      return Object.entries(mappings[title]).find((mapping) => {
        return mapping[1].value === value || checkDisableHsValue(title, value);
      });
    }
  };

  return (
    <Dropdown className="mapping-dropdown">
      <Dropdown.Toggle className="toggle-dropdown">
        {toggleDropdownText()}
      </Dropdown.Toggle>
      <Dropdown.Menu
        className="dropdown-menu"
        renderOnMount={true}
        popperConfig={{ strategy: "fixed" }}
      >
        {appProperties.length === 0 ? (
          <div className="d-flex flex-column justify-content-center align-items-center ">
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <div className="p-3 search-container">
              <div className="d-flex flex-row search">
                <input
                  type="search"
                  placeholder="search..."
                  className="w-100 search-input"
                  onChange={(event) => onSearchFields(event.target.value)}
                />
                <span className="my-auto">
                  <GoSearch size={15} className="me-3 search-icon" />
                </span>
              </div>
            </div>
            <div className="mb-3 dropdown-items-container">
              {searchInput.length > 0 && searchResults.length === 0 && (
                <div className="d-flex flex-column justify-content-center align-items-center my-2">
                  <p style={{ fontSize: "14px", fontWeight: 600 }}>
                    No results found
                  </p>
                </div>
              )}
              {(searchInput.length > 0
                ? [...(searchResults || [])]
                : [...(appProperties || [])]
              )
                .sort((a, b) => (a.label ?? "").localeCompare(b.label ?? ""))
                .map((fieldItem) => (
                  <Dropdown.Item
                    disabled={
                      (disableAppFields(title, fieldItem.value ?? "") &&
                        fieldItem.value !==
                          selectDefaultProperty(mappedItem[1]).value) ||
                      !disabledApp(fieldItem, mappedItem[1].type ?? "")
                    }
                    eventKey={JSON.stringify(fieldItem)}
                    key={fieldItem.value}
                    onClick={() =>
                      dispatch(
                        setSelectedPreference({ appProperty: fieldItem })
                      )
                    }
                  >
                    {fieldItem.label}
                  </Dropdown.Item>
                ))}
            </div>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MappingDropdown;
