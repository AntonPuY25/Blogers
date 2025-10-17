import { emailAdapters } from "../../adapters/email-adapters";
import { SendRegisterMailServiceProps } from "../nodeMailerService/interfaces";

export const emailManager = {
  sendMailRegistration: async ({email,code}:SendRegisterMailServiceProps) => {
    const subject = "Registration confirmation email";
    const text = `https://some-front.com/confirm-registration?code=${code}`;

    return await emailAdapters.sendEmailRegistration({ email, text, subject });
  },
};
