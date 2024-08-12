import React from "react";

import { useSelector } from "react-redux";
import { Configurator, HbSideBar } from "@cloudify/cvr-frontend";
import { CmsRichText } from "@cloudify/cms";

import { ICvrMappingSlice } from "@cloudify/cvr-frontend/src/types/cvrMappingTypes";
import { IPreferenceSlice } from "@cloudify/cvr-frontend/src/types/preferenceTypes";

const CompanyMappings = () => {
  const {
    mappings: {
      defaultMappings: { basicMappings, financialMappings },
    },
    appFields: {
      fields: { companyFields },
    },
  } = useSelector(
    (state: { cvrMapping: ICvrMappingSlice }) => state.cvrMapping
  );

  const mappings = { basicMappings, financialMappings };

  const { userIds } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );

  const labels = {
    cvrFieldsLabel: "CVR Fields",
    appFieldsLabel: "HubSpot Fields",
  };

  const mappingsFor = {
    basicMappings: "basicMappings",
    financialMappings: "financialMappings",
  };

  return (
    <div>
      <div className="my-4">
        <CmsRichText
          path="cmsContent.mappingWindow.companyMappings"
          cssName="mapping-window-header"
        />
      </div>
      {mappings &&
        Object.keys(mappings).length > 0 &&
        companyFields &&
        companyFields.length > 0 && (
          <Configurator
            appProperties={companyFields}
            mappings={mappings}
            appName="cvr"
            labels={labels}
            isBordered={false}
            SideBar={HbSideBar}
            userIds={userIds}
            mappingsFor={mappingsFor}
          />
        )}
    </div>
  );
};

export default CompanyMappings;
