import { UserRegistrationPayload } from "../routers/interface";
import { CreatedUserDataForBD } from "../../users/repositories/interface";

export interface UserRegistrationServiceProps extends UserRegistrationPayload {}

export interface EmailConfirmationData {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
}

export interface UserRegistrationServiceForBd extends CreatedUserDataForBD {
  emailConfirmation: EmailConfirmationData;
}
