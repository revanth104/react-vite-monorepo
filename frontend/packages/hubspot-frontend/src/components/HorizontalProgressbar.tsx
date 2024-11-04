import React from "react";

export interface IHorizontalProgressBar {
  progress: {
    [key: string]: boolean;
  };
  progressBarLabels: {
    [key: string]: string;
  };
}

const HorizontalProgressBar = (props: IHorizontalProgressBar) => {
  const { progressBarLabels, progress } = props;

  return (
    <div className="horizontal-progress-bar mb-5">
      <div className="circles-container">
        {Object.keys(progressBarLabels).length > 0 &&
          Object.keys(progressBarLabels).map((label, index) => (
            <React.Fragment key={index}>
              <div
                className={
                  progress[progressBarLabels[label]]
                    ? "active-page"
                    : "not-active-page"
                }
              >
                {progress[progressBarLabels[label]] && (
                  <label>{index + 1}</label>
                )}
              </div>
              {index !== Object.keys(progressBarLabels).length - 1 && (
                <div className="line"></div>
              )}
            </React.Fragment>
          ))}
      </div>
      <div className="labels-container">
        {Object.keys(progressBarLabels).length > 0 &&
          Object.keys(progressBarLabels).map((label, index) => (
            <label
              key={index}
              className={`text-center mt-2 ${progressBarLabels[label]
                .toLowerCase()
                .split(" ")
                .join("-")}`}
              style={{ width: "118px" }}
            >
              {label}
            </label>
          ))}
      </div>
    </div>
  );
};

export default HorizontalProgressBar;
