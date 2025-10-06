export interface UsersDataForCreateRequest  {
  login: string;
  password: string;
  email: string;
}

export interface RequestParamsForDeleteUserProps {
  userId?: string;
}