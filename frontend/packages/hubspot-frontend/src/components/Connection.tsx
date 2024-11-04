import React from "react";
import { Col, Row } from "react-bootstrap";
import BookConsultation from "./BookConsultation";

export interface IConnection {
  actionAppConnection: () => JSX.Element;
  CmsRichText: React.ComponentType<{ path: string; cssName?: string }>;
  isIframe: boolean;
  isMeetingLink?: boolean;
}

const Connection = (props: IConnection) => {
  const { actionAppConnection, CmsRichText, isIframe } = props;
  const iframeMdColumns = 9;
  const installationMdColumns = 5;
  return (
    <Row
      className={`d-flex flex-row ${
        !isIframe ? "justify-content-between" : "justify-content-center"
      } align-items-center`}
    >
      <Col md={!isIframe ? installationMdColumns : iframeMdColumns}>
        <div
          className="connection-container pt-5 px-5 d-flex flex-column justify-content-center align-items-center text-center"
          style={{ border: isIframe ? "1px solid #a3a3a340" : "" }}
        >
          {actionAppConnection()}
        </div>
      </Col>
      {!isIframe && (
        <Col md={6}>
          <BookConsultation CmsRichText={CmsRichText} />
        </Col>
      )}
    </Row>
  );
};

export default Connection;
