import React from "react";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";

import { SuccessModal } from "@cloudify/cvr-frontend";
import { CmsRichText } from "@cloudify/cms";
import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";

const Confirmation = () => {
  const {
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  return (
    <div>
      <SuccessModal />
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-11">
            <div className="confirmation-page-box my-5">
              {cmsLoading ? (
                <div
                  className="d-flex flex-column justify-content-center align-items-center"
                  style={{ height: "100vh" }}
                >
                  <div className="d-flex flex-row justify-content-center align-items-center">
                    <Spinner animation="border" variant="primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                </div>
              ) : (
                <CmsRichText
                  path="cmsContent.confirmationPage"
                  cssName="confirmation-page"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
