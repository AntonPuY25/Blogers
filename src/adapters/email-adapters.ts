import nodemailer from "nodemailer";
import { EmailAdaptersSendMail } from "./interface";

export const emailAdapters = {
  sendEmailRegistration: async ({text, subject, email }: EmailAdaptersSendMail) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    return await transporter.sendMail({
      from: '"Super Back end Team" <puy@bk.ru>',
      to: email,
      subject,
      text,
    });
  },
};
