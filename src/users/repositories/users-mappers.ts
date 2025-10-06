import {
  CreatedUserDataAfterMappedForUi,
  CreatedUserDataForBD,
} from "./interface";
import { WithId } from "mongodb";

export const getUserMappedDataForCreate = (
  createdUser: WithId<CreatedUserDataForBD>,
): CreatedUserDataAfterMappedForUi => {
  const { _id, userHash, userSalt, ...rest } = createdUser;

  return {
    ...rest,
    id: _id.toString(),
  };
};

export const getUserMappedDataForGe = (
  createdUser: WithId<CreatedUserDataForBD>[],
): CreatedUserDataAfterMappedForUi[] => {
  return createdUser.map(({ _id, userHash, userSalt, ...rest }) => {
    return {
      ...rest,
      id: _id.toString(),
    };
  });
};
