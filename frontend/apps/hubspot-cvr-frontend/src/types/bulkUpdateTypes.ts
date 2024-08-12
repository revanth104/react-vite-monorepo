export interface HubspotCompanies {
  id: string;
  createdAt: Date;
  properties: {
    [key: string]: string;
  };
  updatedAt: Date;
  archived?: boolean;
  isChecked?: boolean;
  [key: string]: unknown;
}

export interface BulkUpdateData {
  cvrNumberKey: string;
  hsCompanies: HubspotCompanies[];
}

export interface BulkUpdateStats {
  failedRecords?: number;
  pushedRecords?: number;
  processedRecords?: number;
  totalRecords?: number;
  startTime?: Date;
  [key: string]: unknown;
}
