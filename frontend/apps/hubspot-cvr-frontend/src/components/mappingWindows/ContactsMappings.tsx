import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
import {
  Configurator,
  HbSideBar,
  onChangeContactCreation,
} from "@cloudify/cvr-frontend";

import { CmsRichText } from "@cloudify/cms";

import { ICvrMappingSlice } from "@cloudify/cvr-frontend/src/types/cvrMappingTypes";

import { IPreferenceSlice } from "@cloudify/cvr-frontend/src/types/preferenceTypes";

const ContactsMappings = () => {
  const {
    mappings: {
      defaultMappings: { contactMappings },
    },
    appFields: {
      fields: { contactFields },
    },
    contactCreation,
  } = useSelector(
    (state: { cvrMapping: ICvrMappingSlice }) => state.cvrMapping
  );

  const mappings = { contactMappings };

  const { userIds } = useSelector(
    (state: { preference: IPreferenceSlice }) => state.preference
  );
  const dispatch = useDispatch();
  const labels = {
    cvrFieldsLabel: "CVR Fields",
    appFieldsLabel: "HubSpot Fields",
  };

  const mappingsFor = {
    contactMappings: "contactMappings",
  };

  return (
    <div>
      <div className="my-4">
        <CmsRichText
          path="cmsContent.mappingWindow.ContactMappings"
          cssName="mapping-window-header"
        />
        <Form.Check
          type="checkbox"
          id="checkbox"
          label="Create Contacts"
          checked={contactCreation}
          onClick={() => dispatch(onChangeContactCreation())}
          className="contact-creation-checkbox"
        />
      </div>
      {mappings &&
        Object.keys(mappings).length > 0 &&
        contactFields &&
        contactFields.length > 0 && (
          <Configurator
            appProperties={contactFields}
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

export default ContactsMappings;
