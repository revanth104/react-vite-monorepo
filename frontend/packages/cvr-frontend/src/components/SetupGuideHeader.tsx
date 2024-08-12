import React from "react";
import { Container } from "react-bootstrap";
import { FiExternalLink } from "react-icons/fi";

interface IProps {
  cloudifyLogo: string;
}

const SetupGuideHeader = (props: IProps) => {
  const { cloudifyLogo } = props;
  return (
    <div className="setup-guide-header-bg p-4">
      <Container>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div className="setup-guide-logo-container col-md-8 col-12">
            <div className="d-flex flex-row justify-content-between">
              <div>
                <img src={cloudifyLogo} alt="logo" />
              </div>
              <div>
                <a
                  className="setup-guide-header-link"
                  target="_blank"
                  href="https://www.cloudify.biz/"
                  rel="noreferrer"
                >
                  <FiExternalLink className="setup-guide-header-icon mx-2" />
                  <p>Go to website</p>
                </a>
              </div>
            </div>
            <h2 className="setup-guide-header-heading mt-1">Get started</h2>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SetupGuideHeader;
