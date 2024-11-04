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

const InvoiceFieldMappings = () => {
  const [companyFilteredFields, setCompanyFilteredFields] = useState<
    IFieldItem[]
  >([]);
  const [contactFilteredFields, setContactFilteredFields] = useState<
    IFieldItem[]
  >([]);

  const {
    mapping: {
      defaultMappings: { invoiceSync },
    },
  } = useSelector((state: { mappings: IMappingSlice }) => state.mappings);

  const {
    fields: {
      data: { deals, companies, contacts },
    },
    hubspotUserIds,
  } = useSelector((state: { hubspot: IHubspotSlice }) => state.hubspot);

  const {
    fields: {
      data: { invoice },
    },
  } = useSelector((state: { fortnox: IFortnoxSlice }) => state.fortnox);

  const triggerAppObject = {
    deals: deals,
    companies: companyFilteredFields,
    contacts: contactFilteredFields,
  };

  const actionAppObject = {
    invoice: invoice,
  };

  const labels: { [k: string]: string } = {
    actionApp: "Fortnox Fields",
    triggerApp: "HubSpot Fields",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (companies && companies.length > 0) {
      const filtered = companies.filter((field) => field.CRF !== "doNotAdd");
      setCompanyFilteredFields(filtered);
    }
  }, [companies]);

  useEffect(() => {
    if (contacts && contacts.length > 0) {
      const filtered = contacts.filter((field) => field.CRF !== "doNotAdd");
      setContactFilteredFields(filtered);
    }
  }, [contacts]);

  return (
    <div>
      <div className="my-4">
        <CmsRichText
          path="cmsContent.settings.invoices.fieldMappings"
          cssName="hubspot"
        />
      </div>
      {invoiceSync &&
        deals &&
        deals.length > 0 &&
        invoice &&
        invoice.length > 0 && (
          <MappingWindow
            mappings={invoiceSync}
            primaryTriggerAppObjectKey="deals"
            triggerAppObject={triggerAppObject}
            actionAppObject={actionAppObject}
            mappingsFor="invoiceSync"
            labels={labels}
            cssClass="mapping-window"
            SideBar={HbSideBar}
            userIds={hubspotUserIds}
            isAccordion={true}
          />
        )}
    </div>
  );
};

export default InvoiceFieldMappings;
