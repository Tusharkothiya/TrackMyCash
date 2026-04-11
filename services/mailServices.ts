import nodemailer from "nodemailer";
import { logger } from "@/lib/logger";
import { buildCommonEmailTemplate } from "@/lib/email/emailTemplate";

type SendOtpEmailInput = {
  email: string;
  fullName?: string;
  otp: string;
};

type SendWelcomeEmailInput = {
  email: string;
  fullName?: string;
};

const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = process.env.SMTP_SECURE === "true";
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const appName = process.env.APP_NAME || "TrackMyCash";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const fromName = process.env.EMAIL_FROM_NAME || appName;
const fromAddress = process.env.EMAIL_FROM_ADDRESS || smtpUser || "noreply@example.com";
const replyTo = process.env.EMAIL_REPLY_TO || fromAddress;
const resolvedFromAddress = smtpHost.includes("gmail.com")
  ? smtpUser || fromAddress
  : fromAddress;

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (!smtpUser || !smtpPass) {
    throw new Error("SMTP_USER and SMTP_PASS are required to send emails");
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  return transporter;
};

const sendOtpVerificationEmail = async ({
  email,
  fullName,
  otp,
}: SendOtpEmailInput): Promise<void> => {
  const emailSubject = `Verify your email for ${appName}`;
  const greeting = `Hi ${fullName || "there"},`;

  const contentHtml = `
    <p style="margin:0 0 10px;font-size:15px;line-height:1.6;">Use the OTP below to verify your email address:</p>
    <div style="margin:14px 0;padding:14px;border:1px dashed #9bb4d6;background:#f3f8ff;border-radius:10px;text-align:center;">
      <span style="font-size:30px;letter-spacing:8px;font-weight:700;color:#0f3d6e;">${otp}</span>
    </div>
    <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#4a5a78;">This code is for one-time verification. Please do not share it.</p>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#4a5a78;">Open <a href="${appUrl}" style="color:#165aa7;text-decoration:none;">${appName}</a> and enter this OTP to complete verification.</p>
  `;

  const html = buildCommonEmailTemplate({
    title: "Email Verification OTP",
    greeting,
    intro: "Thanks for signing up. We just need to verify your email address before you can continue.",
    contentHtml,
    outro: "If you did not request this, please ignore this email.",
  });

  const mailTransporter = getTransporter();

  await mailTransporter.sendMail({
    from: `${fromName} <${resolvedFromAddress}>`,
    to: email,
    replyTo,
    subject: emailSubject,
    text: `Your ${appName} OTP is ${otp}.`,
    html,
  });

  await logger.info(`OTP email sent successfully to ${email}`);
};

const sendWelcomeEmail = async ({
  email,
  fullName,
}: SendWelcomeEmailInput): Promise<void> => {
  const emailSubject = `Welcome to ${appName}`;
  const greeting = `Hi ${fullName || "there"},`;

  const contentHtml = `
    <p style="margin:0 0 10px;font-size:15px;line-height:1.6;">Your account is now verified and ready to use.</p>
    <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#4a5a78;">You can now manage your budgets, accounts, transactions, and reports in one place.</p>
    <div style="margin:18px 0 0;">
      <a href="${appUrl}" style="display:inline-block;padding:12px 18px;border-radius:10px;background:#165aa7;color:#ffffff;text-decoration:none;font-weight:700;">Open ${appName}</a>
    </div>
  `;

  const html = buildCommonEmailTemplate({
    title: "Welcome Aboard",
    greeting,
    intro: "Thanks for verifying your email address.",
    contentHtml,
    outro: "If you did not create this account, you can ignore this message.",
  });

  const mailTransporter = getTransporter();

  await mailTransporter.sendMail({
    from: `${fromName} <${resolvedFromAddress}>`,
    to: email,
    replyTo,
    subject: emailSubject,
    text: `Welcome to ${appName}, ${fullName || "there"}. Your account is verified and ready to use.`,
    html,
  });

  await logger.info(`Welcome email sent successfully to ${email}`);
};

export const mailServices = {
  sendOtpVerificationEmail: async (input: SendOtpEmailInput): Promise<boolean> => {
    try {
      await sendOtpVerificationEmail(input);
      return true;
    } catch (error) {
      await logger.error(`Failed to send OTP email to ${input.email}`, error);
      return false;
    }
  },
  sendWelcomeEmail: async (input: SendWelcomeEmailInput): Promise<boolean> => {
    try {
      await sendWelcomeEmail(input);
      return true;
    } catch (error) {
      await logger.error(`Failed to send welcome email to ${input.email}`, error);
      return false;
    }
  },
};
