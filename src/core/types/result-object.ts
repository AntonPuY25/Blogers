import { STATUSES_CODE } from "./constants";

type ExtensionType = {
  field: string | null;
  message: string;
};

export type ResultObject<T = null> = {
  status: STATUSES_CODE;
  errorMessage?: string;
  extensions: ExtensionType[];
  data: T;
};
