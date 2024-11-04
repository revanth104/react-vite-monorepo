import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { MappingWindow } from "@cloudify/generic";
import { HbSideBar } from "@cloudify/hubspot-frontend";
import { CmsRichText } from "@cloudify/cms";

import { IMappingSlice } from "@cloudify/generic/src/types/mappingTypes";
import {
  IHubspotSlice,
  IFieldItem,
} from "@cloudify/hubspot-frontend/src/types/types";
import { IMsbcSlice } from "@cloudify/msbc-frontend/src/types/msbcTypes";

const CompanyFieldMappings = () => {
  const [filteredFields, setFilteredFields] = useState<IFieldItem[]>([]);

  const {
    mapping: {
      defaultMappings: { customerSync },
    },
  } = useSelector((state: { mappings: IMappingSlice }) => state.mappings);

  const {
    fields: {
      data: { companies },
    },
    hubspotUserIds,
  } = useSelector((state: { hubspot: IHubspotSlice }) => state.hubspot);

  const {
    fields: {
      data: { customer },
    },
  } = useSelector((state: { msbc: IMsbcSlice }) => state.msbc);

  const triggerAppObject = {
    companies: filteredFields,
  };

  const actionAppObject = {
    customer: customer,
  };

  const labels: { [k: string]: string } = {
    actionApp: "Business central Fields",
    triggerApp: "HubSpot Fields",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (companies && companies.length > 0) {
      const filtered = (companies as IFieldItem[]).filter(
        (field) => field.CRF !== "doNotAdd"
      );
      setFilteredFields(filtered);
    }
  }, [companies]);

  return (
    <div>
      <div className="my-4">
        <CmsRichText
          path="cmsContent.settings.contacts.fieldMappings"
          cssName="hubspot"
        />
      </div>
      {customerSync &&
      companies &&
      companies.length > 0 &&
      customer &&
      customer.length > 0 ? (
        <MappingWindow
          mappings={customerSync}
          primaryTriggerAppObjectKey="contacts"
          triggerAppObject={triggerAppObject}
          actionAppObject={actionAppObject}
          mappingsFor="customerSync"
          labels={labels}
          cssClass="mapping-window"
          userIds={hubspotUserIds}
          SideBar={HbSideBar}
          isAccordion={true}
        />
      ) : (
        <div className="d-flex flex-row justify-content-center">
          <h3>Loading...</h3>
        </div>
      )}
    </div>
  );
};

export default CompanyFieldMappings;
