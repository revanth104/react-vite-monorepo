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
import { IFortnoxSlice } from "@cloudify/fortnox-frontend/src/types/fortnoxTypes";

const ContactFieldMappings = () => {
  const [filteredFields, setFilteredFields] = useState<IFieldItem[]>([]);

  const {
    mapping: {
      defaultMappings: { customerSync },
    },
  } = useSelector((state: { mappings: IMappingSlice }) => state.mappings);

  const {
    fields: {
      data: { contacts },
    },
    hubspotUserIds,
  } = useSelector((state: { hubspot: IHubspotSlice }) => state.hubspot);

  const {
    fields: {
      data: { customer },
    },
  } = useSelector((state: { fortnox: IFortnoxSlice }) => state.fortnox);

  const triggerAppObject = {
    contacts: filteredFields,
  };

  const actionAppObject = {
    customer: customer,
  };

  const labels: { [k: string]: string } = {
    actionApp: "Fortnox Fields",
    triggerApp: "HubSpot Fields",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (contacts && contacts.length > 0) {
      const filtered = contacts.filter((field) => field.CRF !== "doNotAdd");
      setFilteredFields(filtered);
    }
  }, [contacts]);

  return (
    <div>
      <div className="my-4">
        <CmsRichText
          path="cmsContent.settings.contacts.contactFieldMappings"
          cssName="hubspot"
        />
      </div>
      {customerSync &&
      contacts &&
      contacts.length > 0 &&
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

export default ContactFieldMappings;
