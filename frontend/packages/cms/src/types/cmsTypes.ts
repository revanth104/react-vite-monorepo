/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IAllowedUsers {
  userId?: string;
}

export interface IData {
  allowedUsers: IAllowedUsers[];
  cmsContent: any;
}

export interface ICmsData {
  cmsData: {
    loading: boolean;
    data: IData;
    currentRequestId: string | null;
    error: string;
  };
  allowedUsers: IAllowedUsers[] | undefined[];
  isAllowedUser: boolean;
  isEdit: boolean;
}
