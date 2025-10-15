import { emailAdapters } from "../../adapters/email-adapters";

export const emailManager = {
  testSendMail: async (email: string) => {
    const subject = "Test data";
    const text = "This is test data for testing";
    const html = "<b>Hello world?</b>";

    return await emailAdapters.send({ email, html, text, subject });
  },
};
