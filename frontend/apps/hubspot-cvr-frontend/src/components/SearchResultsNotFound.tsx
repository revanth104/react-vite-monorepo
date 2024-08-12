import React from "react";
const SearchResultsNotFound = (props: {
  displayText: string;
  noteText: string;
}) => {
  const { displayText, noteText } = props;
  return (
    <div className="d-flex flex-column align-items-center my-5">
      <div className="d-flex flex-column align-items-center">
        <img
          src="https://static.hsappstatic.net/ui-images/static-2.422/optimized/empty-state-charts.svg"
          alt="Not Found img"
        />
        <p className="search-not-found-para mt-4">{displayText}</p>
        <p className="search-not-found-para text-center">{noteText}</p>
      </div>
    </div>
  );
};

export default SearchResultsNotFound;
