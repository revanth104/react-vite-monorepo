import axios, { AxiosError } from "axios";
import { getUrlInCvr } from "./url";
import {
  setShowSuccessModal,
  setShowErrorModal,
} from "../slice/preferenceSlice";
import { setIsMappingsSaved } from "../slice/cvrMappingSlice";

import { IFields } from "../types/cvrMappingTypes";

interface ISaveMappingsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: any;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  mappings: {
    [key: string]: IFields;
  };
  userIds: {
    [key: string]: string | number;
  };
  contactCreation: boolean;
  mappingKeys: string[];
}

export const saveMappings = async (props: ISaveMappingsProps) => {
  const {
    dispatch,
    setIsLoading,
    mappings,
    userIds,
    contactCreation,
    mappingKeys,
  } = props;

  try {
    setIsLoading(true);
    const fields: {
      [key: string]: IFields;
    } = {};

    mappingKeys.map((mappingKey) => {
      fields[mappingKey] = {};
    });

    Object.keys(mappings).forEach((item) => {
      for (const key in mappings[item]) {
        if (mappings[item][key].value) {
          fields[item][key] = {
            label: mappings[item][key].label,
            value: mappings[item][key].value,
            description: mappings[item][key].description,
          };
        }
        console.log(fields);
      }
    });
    await axios.post(getUrlInCvr("VITE_SAVE_MAPPINGS"), {
      fields,
      ...userIds,
      createContacts: contactCreation,
    });
    dispatch(setIsMappingsSaved(false));
    dispatch(setShowSuccessModal({ message: "Mappings Saved Successfully" }));
  } catch (error) {
    console.log(error);
    let errorMessage;
    if (error instanceof Error) errorMessage = error.message;
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.data.message
    )
      errorMessage = error.response.data.message;
    dispatch(setShowErrorModal({ message: errorMessage }));
  } finally {
    setIsLoading(false);
  }
};
