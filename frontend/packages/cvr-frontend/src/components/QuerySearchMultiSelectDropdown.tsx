import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Dropdown, Stack, Badge, CloseButton, Form } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import {
  onSelectMultipleOptions,
  onDeleteMultipleOptions,
} from "../slice/searchWindowslice";

interface IFieldItems {
  title: string;
  value: string | number;
}

interface IProps {
  dropdownFor: string;
  fieldItems: IFieldItems[];
  cssName?: string;
  selectedItems: IFieldItems[];
  dropdownLabel?: string;
  dropdownMenuHeight?: string;
  dropdownMenuWidth?: string;
}

const QuerySearchMultiSelectDropdown = (props: IProps) => {
  const {
    dropdownFor,
    fieldItems,
    cssName,
    selectedItems,
    dropdownLabel,
    dropdownMenuHeight,
    dropdownMenuWidth,
  } = props;
  const dispatch = useDispatch();

  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<IFieldItems[]>([]);

  const getSelectedItems = (fieldItem: IFieldItems) => {
    if (selectedItems && selectedItems.length > 0) {
      const exists = selectedItems.some(
        (item) => item.value === fieldItem.value
      );
      return exists;
    }
    return false;
  };

  const searchFields = (enteredInput: string) => {
    setSearchInput(enteredInput);
    const searchArray = [];
    if (fieldItems && fieldItems.length > 0) {
      searchArray.push(
        ...fieldItems.filter((fieldItem) =>
          fieldItem.title.toLowerCase().includes(enteredInput.toLowerCase())
        )
      );
    }
    setSearchResults(searchArray);
  };

  return (
    <Dropdown className={cssName}>
      <Dropdown.Toggle className="toggle-dropdown my-2">
        {selectedItems && selectedItems.length > 0 ? (
          <Stack direction="horizontal" gap={2} style={{ flexWrap: "wrap" }}>
            {selectedItems.map((item, index) => (
              <Badge
                key={index}
                className="d-flex flex-row justify-content-between badge-key"
              >
                <span className="me-2">{item.title}</span>
                <CloseButton
                  style={{ fontSize: "8px" }}
                  onClick={() => {
                    dispatch(
                      onDeleteMultipleOptions({
                        selectedKey: item.value,
                        checked: false,
                        selectedFor: dropdownFor,
                      })
                    );
                  }}
                />
              </Badge>
            ))}
          </Stack>
        ) : (
          <span>Select {dropdownLabel}</span>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu
        renderOnMount={true}
        popperConfig={{ strategy: "fixed" }}
        className="dropdown-menu"
        style={{
          height: `${dropdownMenuHeight}`,
        }}
      >
        <div className="p-3 search-container">
          <div className="d-flex flex-row search">
            <input
              type="search"
              placeholder="search.."
              className="w-100 search-input"
              onChange={(event) => searchFields(event.target.value)}
            />
            <span className="my-auto">
              <FaSearch size={15} className="me-2 search-icon" />
            </span>
          </div>
        </div>
        <div
          className="dropdown-items-container"
          style={{ width: `${dropdownMenuWidth}` }}
        >
          {searchInput.length > 0 && searchResults.length === 0 && (
            <div className="d-flex flex-column justify-content-center align-items-center my-2">
              <p style={{ fontSize: "14px", fontWeight: 600 }}>
                No results found
              </p>
            </div>
          )}
          {fieldItems &&
            fieldItems.length > 0 &&
            (searchInput.length > 0 ? searchResults : fieldItems).map(
              (fieldItem, index) => (
                <div key={index} className="px-3 py-2 w-100">
                  <Form.Check
                    type="checkbox"
                    id={String(fieldItem.value)}
                    label={fieldItem.title}
                    style={{ fontSize: "14px" }}
                    name="multiSelectDropdownFields"
                    value={fieldItem.value}
                    checked={getSelectedItems(fieldItem)}
                    onChange={(event) =>
                      dispatch(
                        onSelectMultipleOptions({
                          checked: event.target.checked,
                          selectedValue: fieldItem,
                          selectedFor: dropdownFor,
                        })
                      )
                    }
                  />
                </div>
              )
            )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default QuerySearchMultiSelectDropdown;
