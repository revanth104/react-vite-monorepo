export interface ICompanies {
  id?: string;
  createdAt?: Date;
  properties?: {
    [key: string]: string;
  };
  updatedAt?: Date;
  archived?: boolean;
  isChecked?: boolean;
  [key: string]: unknown;
  _source?: {
    [key: string]: unknown;
    Vrvirksomhed: {
      [key: string]: unknown;
      cvrNummer: number;
      virksomhedMetadata: {
        sammensatStatus?: string;
        nyesteNavn: {
          navn: string;
        };
        nyesteHovedbranche: {
          branchekode?: string;
        };
        nyesteBeliggenhedsadresse: {
          vejnavn?: string;
          husnummerFra?: number;
          postnummer?: number;
          postdistrikt?: string;
        };
        nyesteVirksomhedsform: {
          langBeskrivelse?: string;
        };
      };
    };
  };
}

export interface ISearchCompanies {
  isChecked: boolean;
  [key: string]: unknown;
  _source: {
    Vrvirksomhed: {
      cvrNummer: number;
      virksomhedMetadata: {
        nyesteNavn: {
          navn: string;
        };
      };
      [key: string]: unknown;
    };
  };
}

export interface IPreferenceSlice {
  errorMessage: string[];
  successMessage: string;
  subscriptionDetails: {
    loading: boolean;
    subscription: {
      [key: string]: string;
    };
    error: string;
  };
  userIds: {
    [key: string]: string | number;
  };
  showSaveModal: boolean;
  slicedCompanies: ICompanies[];
  paginationSearchInput: string;
  itemOffset: number;
  pageCount: number;
  paginationSearchResults: ICompanies[];
  bulkFeatureStats: {
    [key: string]: {
      [key: string]: number;
    };
  };
  showProgressBar: boolean;
  showBulkFeatureModal: boolean;
}
