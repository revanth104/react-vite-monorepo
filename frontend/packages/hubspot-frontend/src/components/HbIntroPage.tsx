import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import HbButton from "./HbButton";

export interface IHbIntroPage {
  triggerAppLogo: string;
  actionAppLogo: string;
  changeCurrentWindow: () => void;
  reverse?: boolean;
  CmsRichText: React.ComponentType<{ path: string; cssName?: string }>;
}

const HbIntroPage = (props: IHbIntroPage) => {
  const {
    triggerAppLogo,
    actionAppLogo,
    changeCurrentWindow,
    reverse,
    CmsRichText,
  } = props;
  return (
    <Container>
      <Row
        className={`d-flex flex-row justify-content-between align-items-center ${
          reverse ? "flex-row-reverse" : ""
        }`}
      >
        <Col md={6} className="intro-card-container pt-5 pb-4 px-5">
          <div className="d-flex flex-row align-items-center mb-5">
            <div className="trigger-app-container d-flex flex-row justify-content-center align-items-center">
              <img src={triggerAppLogo} alt="Hubspot" height="38" width="38" />
            </div>
            <div className="mx-3">
              <FaPlus />
            </div>
            <div className="trigger-app-container d-flex flex-row justify-content-center align-items-center">
              <img src={actionAppLogo} alt="economic" height="38" width="38" />
            </div>
          </div>
          <div className="intro-card-text-container mb-5">
            <CmsRichText
              path="cmsContent.introPage.cardContent"
              cssName="hubspot"
            />
          </div>
          <div className="mb-3">
            <HbButton
              text="Start"
              click={() => changeCurrentWindow()}
              fullWidth={true}
              className="intro-card-button"
            />
          </div>
        </Col>
        <Col md={6} className="d-flex flex-row justify-content-end">
          <div style={{ width: "90%" }}>
            <CmsRichText
              path="cmsContent.introPage.guideContent"
              cssName="hubspot"
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HbIntroPage;
