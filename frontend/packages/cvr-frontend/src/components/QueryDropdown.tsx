import React from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";

interface IFieldItems {
  title: string;
  value: string | number;
  type?: string;
}

interface IProps {
  dropdownFor: string;
  selectedValue: IFieldItems;
  dropdownLabel?: string;
  fieldItems: IFieldItems[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangeValue: any;
  cssName?: string;
  dropdownWidth?: string;
  dropdownMenuWidth?: string;
  dropdownMenuHeight?: string;
}

const QueryDropdown = (props: IProps) => {
  const {
    dropdownFor,
    selectedValue,
    dropdownLabel,
    fieldItems,
    onChangeValue,
    cssName,
    dropdownWidth,
    dropdownMenuWidth,
    dropdownMenuHeight,
  } = props;

  const dispatch = useDispatch();

  const toggleDropdownText = (selectedValue: IFieldItems) => {
    const fieldFor = [
      "location",
      "locationComparison",
      "sizeComparison",
      "industryTypeComparison",
      "logicalOperator",
      "companyStatusComparison",
      "createContacts",
    ];
    if (fieldFor.includes(dropdownFor)) {
      if (!selectedValue) {
        return dropdownFor === "createContacts"
          ? "Create contacts"
          : `Select ${dropdownLabel}`;
      } else {
        const field = fieldItems.find(
          (item) => item.value === selectedValue.value
        );
        if (field) {
          return field.title;
        } else {
          return "";
        }
      }
    }
  };

  return (
    <Dropdown className={`${cssName}`}>
      <Dropdown.Toggle
        className="setup-dropdown my-2"
        style={{ width: `${dropdownWidth}` }}
      >
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {toggleDropdownText(selectedValue)}
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu
        renderOnMount={true}
        popperConfig={{ strategy: "fixed" }}
        style={{
          width: `${dropdownMenuWidth}`,
          height: `${dropdownMenuHeight}`,
        }}
      >
        <div className="setup-dropdown-menu-container">
          {fieldItems.map((fieldItem) => (
            <Dropdown.Item
              key={fieldItem.value}
              onClick={() =>
                dispatch(
                  onChangeValue({
                    selectingFor: dropdownFor,
                    selectedOption: fieldItem,
                  })
                )
              }
            >
              {fieldItem.title}
            </Dropdown.Item>
          ))}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default QueryDropdown;
