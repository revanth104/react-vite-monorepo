import React, { useEffect, useState } from "react";
import {
  Row,
  Button,
  Table,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Accordion,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import {
  validateProperties,
  onSearchCvrMappings,
  storeActiveAccordion,
} from "../slice/cvrMappingSlice";
import { IFields, ICvrMappingSlice } from "../types/cvrMappingTypes";
import { saveMappings } from "../helpers/saveMappings";

import MappingHeader from "./MappingHeader";
import EditMapping from "./EditMapping";
import MappedRows from "./MappedRows";
import NoSearchResultsFound from "./NoSearchResultsFound";

// Icons
import { GoSearch } from "react-icons/go";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";

import { IAppFields } from "../types/cvrMappingTypes";

interface IProps {
  appProperties: IAppFields[];
  userIds: {
    [k: string]: string | number;
  };
  labels: {
    [k: string]: string;
  };
  isBordered?: boolean;
  SideBar: React.ComponentType<{ mappingKeys: string[] }>;
  mappings?: {
    [k: string]: IFields;
  };
  mappingsFor: {
    [k: string]: string;
  };
}

const Configurator = (props: IProps) => {
  const {
    appProperties,
    userIds,
    labels,
    isBordered,
    SideBar,
    mappings,
    mappingsFor,
  } = props;
  const {
    mappings: { defaultMappings },
    activeAccordion,
    deletedProperties,
    searchInput,
    searchFilteredArray,
    isEditMapping,
    selectedPreference,
    currentlyEditing,
    contactCreation,
  } = useSelector(
    (state: { cvrMapping: ICvrMappingSlice }) => state.cvrMapping
  );
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      mappings &&
      Object.keys(mappings).length > 0 &&
      appProperties &&
      appProperties.length > 0
    ) {
      dispatch(validateProperties({ appProperties, mappingsFor }));
    }
  }, [defaultMappings, appProperties]);

  const getFilteredArray = (mappingObjs: IFields) => {
    const filteredArray: { keyword: string; key: string }[] = [];
    Object.entries(mappingObjs).forEach((mapping) => {
      if (
        mapping[1].value !== undefined &&
        deletedProperties.includes(mapping[1].value)
      ) {
        filteredArray.push({
          keyword: "HubSpot custom property deleted",
          key: mapping[0],
        });
      }
      if (mapping[1].value === "") {
        filteredArray.push({
          keyword: "",
          key: mapping[0],
        });
      }
      filteredArray.push({
        keyword: mapping[1].label ?? "",
        key: mapping[0],
      });
    });
    return filteredArray;
  };

  const changeHeader = (accordionTitle: string) => {
    const headerTitle = accordionTitle.split("Mappings");
    return headerTitle[0].toUpperCase();
  };

  const mappingKeys = Object.keys(mappingsFor);

  return (
    <div className="mapping-window">
      <Row className="d-flex flex-row justify-content-between my-3 search-header">
        <div className="d-flex flex-row justify-content-between align-items-center">
          <div className="d-flex flex-row search-container me-3">
            <input
              type="search"
              placeholder="Search"
              className="me-3 search-input"
              value={searchInput}
              onChange={(event) => {
                const activeKey =
                  mappingKeys.length > 1 ? activeAccordion : mappingKeys[0];
                const activeMapping = mappings?.[activeKey];
                dispatch(
                  onSearchCvrMappings({
                    searchString: event.target.value,
                    filteredArray: getFilteredArray(activeMapping ?? {}),
                    mappingKeys,
                  })
                );
              }}
            />
            <span className="my-auto">
              <GoSearch size={15} className="me-3 search-icon" />
            </span>
          </div>
          <div>
            <SideBar mappingKeys={mappingKeys} />
          </div>
        </div>
      </Row>
      {mappingsFor && mappingKeys.length > 1 ? (
        <Accordion
          defaultActiveKey={activeAccordion}
          onSelect={(eventKey) =>
            dispatch(storeActiveAccordion({ activeAccordion: eventKey }))
          }
          className="my-3"
        >
          {mappings &&
            Object.keys(mappings).map((accTitle, index) => (
              <Accordion.Item
                eventKey={accTitle}
                key={index.toString()}
                className="mt-3"
              >
                <Accordion.Header>
                  {activeAccordion === accTitle ? (
                    <FaCaretDown className="me-1" size={12} />
                  ) : (
                    <FaCaretRight className="me-1" size={12} />
                  )}
                  <span className="accordion-title">
                    {changeHeader(accTitle)} DATA
                  </span>
                </Accordion.Header>
                <Accordion.Body>
                  {searchInput.length > 0 &&
                  searchFilteredArray &&
                  Object.keys(searchFilteredArray[accTitle]).length === 0 ? (
                    <NoSearchResultsFound />
                  ) : (
                    <Table responsive className="table" bordered={isBordered}>
                      {/* Table Header */}
                      <MappingHeader labels={labels} />
                      <tbody className="table-body">
                        {Object.entries(
                          searchInput.length > 1
                            ? searchFilteredArray[accTitle]
                            : mappings[accTitle]
                        ).map((mappedItem) => (
                          <tr
                            key={mappedItem[0]}
                            className={`edit-row ${
                              isEditMapping &&
                              currentlyEditing === mappedItem[0]
                                ? "edit-row"
                                : "normal-row"
                            }`}
                          >
                            {isEditMapping &&
                            currentlyEditing === mappedItem[0] ? (
                              <EditMapping
                                mappedItem={mappedItem}
                                mappings={mappings}
                                storedKey={currentlyEditing}
                                appProperties={appProperties}
                                selectedPreference={selectedPreference}
                                deletedProperties={deletedProperties}
                                title={accTitle}
                              />
                            ) : (
                              <MappedRows
                                mappedItem={mappedItem}
                                storedKey={currentlyEditing}
                                deletedProperties={deletedProperties}
                                isEditMapping={isEditMapping}
                                mappingKeys={mappingKeys}
                              />
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            ))}
        </Accordion>
      ) : (
        <>
          {mappingKeys.length === 1 &&
          searchInput.length > 0 &&
          searchFilteredArray[mappingKeys[0]] &&
          Object.keys(searchFilteredArray[mappingKeys[0]]).length === 0 ? (
            <NoSearchResultsFound />
          ) : (
            <Table responsive className="table" bordered={isBordered}>
              <MappingHeader labels={labels} />
              <tbody className="table-body">
                {mappingKeys[0] === "contactMappings" && (
                  <>
                    {Object.entries(
                      searchInput.length > 1
                        ? searchFilteredArray[mappingKeys[0]]
                        : mappings?.[mappingKeys[0]] ?? {}
                    ).map((mappedItem) => (
                      <tr
                        key={mappedItem[0]}
                        className={`edit-row ${
                          isEditMapping && currentlyEditing === mappedItem[0]
                            ? "edit-row"
                            : "normal-row"
                        }`}
                      >
                        {isEditMapping && currentlyEditing === mappedItem[0] ? (
                          <EditMapping
                            mappedItem={mappedItem}
                            mappings={mappings ?? {}}
                            storedKey={currentlyEditing}
                            appProperties={appProperties}
                            selectedPreference={selectedPreference}
                            deletedProperties={deletedProperties}
                            title={mappingKeys[0]}
                          />
                        ) : (
                          <MappedRows
                            mappedItem={mappedItem}
                            storedKey={currentlyEditing}
                            deletedProperties={deletedProperties}
                            isEditMapping={isEditMapping}
                            mappingKeys={mappingKeys}
                          />
                        )}
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </Table>
          )}
        </>
      )}

      <div className="d-flex justify-content-end mb-4">
        {Object.keys(searchFilteredArray).length === 0 &&
        searchInput.length > 1 ? (
          ""
        ) : (
          <>
            {deletedProperties.length > 0 ? (
              <OverlayTrigger
                placement="left"
                overlay={
                  <Tooltip style={{ fontSize: "12px" }}>
                    Please remap the fields for which custom property has been
                    deleted
                  </Tooltip>
                }
              >
                <Button className="save-mapping-disabled">Save Mappings</Button>
              </OverlayTrigger>
            ) : (
              <Button
                className="save-mapping"
                disabled={isEditMapping || deletedProperties.length > 0}
                onClick={() =>
                  saveMappings({
                    dispatch,
                    setIsLoading,
                    mappings: mappings ?? {},
                    userIds,
                    contactCreation,
                    mappingKeys,
                  })
                }
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
                  <span>Save Mappings</span>
                )}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Configurator;
