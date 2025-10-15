import { emailManager } from "../managers/email-manager";

export const nodeMailerService = {
  sendTestMail: async () => {
    await emailManager.testSendMail("rockmenpuy24@gmail.com");
  },
};
