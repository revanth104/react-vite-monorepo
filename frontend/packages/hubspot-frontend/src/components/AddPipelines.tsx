import React from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import {
  SetupDropdown,
  onDeletePipeline,
  onAddPipeline,
  onDeleteSelectedPipelinePreferences,
  setSelectedInvoiceFields,
} from "@cloudify/generic";
import { useSelector, useDispatch } from "react-redux";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

import {
  IInvoiceSlice,
  IResponseStructure,
} from "@cloudify/generic/src/types/invoiceTypes";

type TPipelineProps = {
  dropdownForInvoice: IResponseStructure[];
  dropdownForInvoiceLabel: string;
};

const AddPipelines = (props: TPipelineProps) => {
  const { dropdownForInvoice, dropdownForInvoiceLabel } = props;
  const {
    pipelines: { pipelines },
    dealStage: { dealStages },
    pipelinePreference,
    dealStagePreference,
    invoicePreference,
    selectedPipelines,
  } = useSelector((state: { invoice: IInvoiceSlice }) => state.invoice);

  const dispatch = useDispatch();

  return (
    <div>
      <label>Add Pipeline</label>
      <div className="mb-3">
        <div className="hubspot-pipeline-dropdown">
          {pipelines && (
            <SetupDropdown
              fieldItems={pipelines}
              onChangeValue={setSelectedInvoiceFields}
              selectedValue={pipelinePreference}
              cssName="install-flow-dropdown"
              dropdownFor="pipelines"
              dropdownLabel="Pipeline"
            />
          )}
        </div>
        <div className="hubspot-dealstage-dropdown">
          {dealStages && pipelinePreference && (
            <SetupDropdown
              fieldItems={dealStages}
              onChangeValue={setSelectedInvoiceFields}
              selectedValue={dealStagePreference}
              cssName="install-flow-dropdown"
              dropdownFor="dealStage"
              dropdownLabel="Deal stage"
            />
          )}
        </div>
        <div className="hubspot-generate-dropdown">
          {dealStagePreference && dropdownForInvoice && (
            <SetupDropdown
              fieldItems={dropdownForInvoice}
              dropdownFor="preferenceForCreation"
              dropdownLabel={dropdownForInvoiceLabel}
              onChangeValue={setSelectedInvoiceFields}
              selectedValue={invoicePreference}
              cssName="install-flow-dropdown"
            />
          )}
        </div>
      </div>
      <div className="d-flex flex-row">
        {!pipelinePreference || !dealStagePreference || !invoicePreference ? (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip style={{ fontSize: "12px" }}>
                Please select the pipeline, deal stage and preference for
                creation of Order/Invoice
              </Tooltip>
            }
          >
            <Button className="save-changes-disabled-button mt-2">
              Add Pipeline
            </Button>
          </OverlayTrigger>
        ) : (
          <Button
            className="save-changes-button mt-2"
            onClick={() => dispatch(onAddPipeline())}
          >
            Add Pipeline
          </Button>
        )}
        {pipelinePreference && (
          <Button
            className="clear-data-btn mt-2 ms-3"
            onClick={() => dispatch(onDeleteSelectedPipelinePreferences())}
          >
            Clear data
          </Button>
        )}
      </div>
      {selectedPipelines.length > 0 && (
        <div className="mt-3">
          <label className="my-1">Selected Pipeline</label>
          <div>
            {selectedPipelines.map((item, index) => (
              <div
                className="selected-pipeline-container w-100 d-flex flex-row justify-content-between align-items-center px-3 mb-2"
                key={index}
              >
                <p
                  className="mb-0 me-2"
                  style={{ fontSize: "12px", fontWeight: 500 }}
                >
                  <span>Pipeline:</span>{" "}
                  <span>
                    <b>{item.pipeline.name}</b>
                  </span>
                </p>
                <p
                  className="mb-0 me-2"
                  style={{ fontSize: "12px", fontWeight: 500 }}
                >
                  <span>Deal Stage:</span>{" "}
                  <span>
                    <b>{item.dealStage.name}</b>
                  </span>
                </p>
                <p
                  className="mb-0 me-2"
                  style={{ fontSize: "12px", fontWeight: 500 }}
                >
                  <span>Create:</span>{" "}
                  <span>
                    <b>{item.generate.name}</b>
                  </span>
                </p>
                <RiDeleteBinLine
                  size={20}
                  color="#213343"
                  style={{ cursor: "pointer" }}
                  onClick={() => dispatch(onDeletePipeline({ index }))}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPipelines;
