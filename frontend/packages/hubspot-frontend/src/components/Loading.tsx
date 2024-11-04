import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center nav-loading-container">
      <div className="d-flex flex-row justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </div>
  );
};

export default Loading;
