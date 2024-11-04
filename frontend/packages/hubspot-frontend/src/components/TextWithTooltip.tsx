import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsInfoCircle } from "react-icons/bs";

interface IProps {
  label: string;
  tooltipText?: string;
}

const TextWithTooltip = (props: IProps) => {
  const { label, tooltipText } = props;
  return (
    <span>
      <label className="label-text me-2">{label}</label>
      {tooltipText && (
        <OverlayTrigger
          placement="right"
          overlay={
            <Tooltip style={{ fontSize: "12px" }}>{tooltipText}</Tooltip>
          }
        >
          <span>
            <BsInfoCircle className="info-circle-icon" />
          </span>
        </OverlayTrigger>
      )}
    </span>
  );
};

export default TextWithTooltip;
