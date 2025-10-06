import {
  CreatedUserDataAfterMappedForUi,
  CreatedUserDataForBD,
} from "./interface";
import { WithId } from "mongodb";

export const getUserMappedDataForCreate = (
  createdUser: WithId<CreatedUserDataForBD> | WithId<CreatedUserDataForBD>[],
): CreatedUserDataAfterMappedForUi | CreatedUserDataAfterMappedForUi[] => {
  if (Array.isArray(createdUser)) {
    return createdUser.map(({ _id, userHash, userSalt, ...rest }) => {
      return {
        ...rest,
        id: _id.toString(),
      };
    });
  }

  const { _id, userHash, userSalt, ...rest } = createdUser;

  return {
    ...rest,
    id: _id.toString(),
  };
};
