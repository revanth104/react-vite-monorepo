import { Table } from "react-bootstrap";
import React from "react";
import { useSelector } from "react-redux";

import { ISearchWindowSlice } from "../types/searchWindowTypes";

const FinancialDataTable = () => {
  const {
    financialData: { financial },
  } = useSelector(
    (state: { searchWindow: ISearchWindowSlice }) => state.searchWindow
  );

  const financialKeys = [
    "Net turnover",
    "Gross profit",
    "Net result",
    "Equity",
    "Balance sheet",
    "Currency code",
  ];

  return (
    <div>
      {financial && Object.keys(financial).length > 0 && (
        <div>
          <h3 className="financial-data-heading mb-3">Financial Data</h3>
          <Table className="financial-table" responsive={true}>
            <thead>
              <tr className="financial-data-table-header">
                <th></th>
                {Object.keys(financial)
                  .sort()
                  .reverse()
                  .map((year) => (
                    <th key={year} className="text-center financial-year">
                      {year}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="financial-data-body">
              {financialKeys.map((key) => (
                <tr key={key}>
                  <td className="financial-data">
                    <span className="ms-4">{key}</span>
                  </td>
                  {Object.keys(financial)
                    .sort()
                    .reverse()
                    .map((year) => (
                      <td key={year} className="text-center financial-data">
                        {
                          (financial as Record<string, Record<string, string>>)[
                            `${year}`
                          ][key]
                        }
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FinancialDataTable;
