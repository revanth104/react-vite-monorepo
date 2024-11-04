import { IField } from "@cloudify/generic/src/types/mappingTypes";

export interface IFieldItem {
  HRF: string;
  CRF: string | number;
  type: string;
  description: string;
  title?: string;
  value?: string | number;
  name?: string;
  required?: boolean;
}

export interface Progress {
  [key: string]: boolean;
}

export interface IHSPropertyCreation {
  portalId: number;
  name: string;
  label: string;
  objectType: string;
  description?: string;
}

export interface IHubspotSlice {
  fields: {
    loading: boolean;
    data: {
      [key: string]: IField[];
    };
    error: string;
    currentRequestId: null | string;
  };
  hubspotUserIds: {
    [key: string]: string | number;
  };
  [key: string]: unknown;
  currentWindow: string;
  progress: Progress;
  missingScope?: boolean;
}
