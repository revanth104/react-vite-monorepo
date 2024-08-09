import React from "react";

interface IProps {
  labels: {
    [k: string]: string;
  };
}

const MappingHeader = (props: IProps) => {
  const {
    labels: { cvrFieldsLabel, appFieldsLabel },
  } = props;
  return (
    <thead className="table-header">
      <tr>
        <th className="label ps-4">{cvrFieldsLabel}</th>
        <th className="label ps-4">{appFieldsLabel}</th>
        <th className="label"></th>
      </tr>
    </thead>
  );
};

export default MappingHeader;
