import React from "react";

const NoSearchResultsFound = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center my-5">
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h2>No Mappings Found</h2>
        <p>Try changing your search filter.</p>
      </div>
    </div>
  );
};

export default NoSearchResultsFound;
