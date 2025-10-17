import { emailManager } from "../managers/email-manager";
import { SendRegisterMailServiceProps } from "./interfaces";

export const nodeMailerService = {
  sendRegisterMail: async (data: SendRegisterMailServiceProps) => {
    await emailManager.sendMailRegistration(data);
  },
};
