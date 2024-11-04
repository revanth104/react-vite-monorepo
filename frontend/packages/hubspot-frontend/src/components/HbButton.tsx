import React from "react";
import { PiCaretRightBold, PiCaretLeftBold } from "react-icons/pi";
import { Button } from "react-bootstrap";

export interface IHbButton {
  text: string;
  click?: () => void;
  fullWidth?: boolean;
  withArrow?: boolean;
  outlineButton?: boolean;
  className?: string;
}

const HbButton = (props: IHbButton) => {
  const { text, click, fullWidth, withArrow, outlineButton, className } = props;
  return (
    <div>
      <Button
        onClick={() => click && click()}
        className={`${className} hb-button ${fullWidth && "w-100"} ${
          outlineButton && "hb-outline-button"
        }`}
      >
        {outlineButton && withArrow && (
          <PiCaretLeftBold size={16} color="#ff7a59" className="me-2" />
        )}
        {text}
        {withArrow && !outlineButton && (
          <PiCaretRightBold size={16} color="#fff" className="ms-2" />
        )}
      </Button>
    </div>
  );
};

export default HbButton;
