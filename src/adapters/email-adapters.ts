import nodemailer from "nodemailer";
import { EmailAdaptersSendMail } from "./interface";

export const emailAdapters = {
  send: async ({ html, text, subject, email }: EmailAdaptersSendMail) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    return await transporter.sendMail({
      from: '"Example Team" <team@example.com>',
      to: email,
      subject,
      text,
      html,
    });
  },
};
