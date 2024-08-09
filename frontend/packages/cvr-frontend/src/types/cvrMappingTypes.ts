export interface IField {
  label?: string;
  value?: string;
  description?: string;
  cvrFieldDescription?: string;
  required?: boolean;
  type?: string;
}

export interface IFields {
  [k: string]: IField;
}

export interface IAppFields {
  label?: string;
  value?: string;
  type?: string;
  description?: string;
}

export interface IFetchMappings {
  [k: string]: IFields;
}

export interface IFetchFields {
  [k: string]: IAppFields[];
}

export interface IHSPropertyCreation {
  portalId: number;
  name: string;
  label: string;
  description?: string;
  objectType: string;
}

export interface ICvrMappingSlice {
  mappings: {
    loading: boolean;
    defaultMappings: {
      [k: string]: IFields;
    };
    error: string;
    currentRequestId: null | string;
  };
  appFields: {
    loading: boolean;
    fields: {
      [k: string]: IAppFields[];
    };
    error: string;
    currentRequestId: null | string;
  };
  deletedProperties: string[];
  searchInput: string;
  searchFilteredArray: {
    [k: string]: IFields;
  };
  currentlyEditing: string;
  selectedPreference: IAppFields;
  isEditMapping: boolean;
  activeAccordion: string;
  isCvrCheck: boolean;
  isMappingsSaved: boolean;
  contactCreation: boolean;
  activeKey: string;
}
