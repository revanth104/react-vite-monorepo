import { Node } from "react-checkbox-tree";

export interface ICompaniesData {
  isChecked: boolean;
  _id: string;
  _source: {
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
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface IQueries {
  title: string;
  value: string;
  type?: string;
}

export interface ISelectedCompanies {
  cvrNumber: number;
  companyName: string;
  cvrId: string;
}

export interface IProperties {
  title: string;
  value: string | number;
}

export interface ISearchWindowSlice {
  financialData: {
    loading: boolean;
    financial: {
      [key: string]: unknown;
    };
    error: string;
  };
  companies: {
    loading: boolean;
    companiesData: ICompaniesData[];
    error: string;
  };
  dataFetched: boolean;
  searchInput: string;
  globalSearch: string;
  isAllSelected: boolean;
  location: IQueries | undefined;
  locationComparison: IQueries | undefined;
  sizeComparison: IQueries | undefined;
  industryType: IQueries | undefined;
  logicalOperator: IQueries;
  size: number;
  companyStatusComparison: IQueries;
  locationSelectedFields: IQueries[];
  industryTypeSelectedFields: IQueries[];
  selectedCompanies: ISelectedCompanies[];
  companyStatusSelectedFields: IQueries[];
  cvrProperties: {
    loading: boolean;
    properties: {
      branchCodes?: Node[];
      postalCodes?: IProperties[];
      municipalities?: IProperties[];
      companyStatus?: IProperties[];
    };
    error: string;
  };
  showInfo: boolean;
  checked: string[];
  expanded: string[];
  selectedItems: string[];
  showIndustryTypeModal: boolean;
  showMultipleOrgModal: boolean;
}
