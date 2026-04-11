import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (
  email: string,
  resetLink: string
) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "Your App"}" <${
        process.env.EMAIL_FROM || "noreply@yourdomain.com"
      }>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #02092d;">Password Reset</h1>
          </div>
          <p>You requested a password reset for your account. Please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

// Verify email configuration is set up correctly
export const verifyEmailConfig = async () => {
  const requiredVars = [
    "EMAIL_HOST",
    "EMAIL_PORT",
    "EMAIL_USER",
    "EMAIL_PASSWORD",
  ];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn(
      `Warning: Missing email configuration variables: ${missingVars.join(
        ", "
      )}`
    );
    return false;
  }

  return true;
};

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string
) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "Your App"}" <${
        process.env.EMAIL_FROM || "noreply@yourdomain.com"
      }>`,
      to: email,
      subject: "Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #02092d;">Verify Your Email</h1>
          </div>
          <p>Thank you for registering! Please use the following verification code to complete your registration:</p>
          <div style="text-align: center; margin: 30px 0;">
            <h2 style="letter-spacing: 5px; font-size: 32px; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${verificationCode}</h2>
          </div>
          <p><strong>This code will expire in 1 hour.</strong></p>
          <p>If you did not request this verification, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

interface OrderForEmail {
  id: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: string | number;
  }[];
  totalAmount: string | number;
  deliveryAddress: string;
}

export const sendOrderCancellationEmail = async (
  userEmail: string,
  userName: string,
  order: OrderForEmail,
  cancellationReason: string
) => {
  try {
    const itemsHtml = order.items
      .map(
        (item) =>
          `<li>${item.productName} (x${item.quantity}) - Rs.${parseFloat(
            String(item.unitPrice)
          ).toFixed(2)}</li>`
      )
      .join("");

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "Your Pet Store"}" <${
        process.env.EMAIL_FROM || "noreply@yourpetstore.com"
      }>`,
      to: userEmail,
      subject: `Order Cancelled: ${order.id.substring(0, 8)}...`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #d9534f;">Order Cancelled</h1>
          </div>
          <p>Dear ${userName},</p>
          <p>We regret to inform you that your order (ID: <strong>${
            order.id
          }</strong>) has been cancelled.</p>
          
          <h3 style="color: #02092d;">Reason for Cancellation:</h3>
          <p style="padding: 10px; background-color: #f9f9f9; border-left: 3px solid #d9534f;">
            ${cancellationReason}
          </p>

          <h3 style="color: #02092d;">Order Details:</h3>
          <ul>
            ${itemsHtml}
          </ul>
          <p><strong>Total Amount:</strong> Rs.${parseFloat(
            String(order.totalAmount)
          ).toFixed(2)}</p>
          <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>

          <p>Please contact our support team for steps regarding refund.</p>
          <p>We apologize for any inconvenience this may have caused.</p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Order cancellation email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending order cancellation email:", error);
    return false;
  }
};

interface AppointmentForEmail {
  id: string;
  date: Date | string;
  petName: string;
  serviceName: string;
  vetName: string;
}

export const sendAppointmentCancellationEmail = async (
  userEmail: string,
  userName: string,
  appointment: AppointmentForEmail,
  cancellationReason: string
) => {
  try {
    const appointmentDate = new Date(appointment.date).toLocaleString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "Your Pet Clinic"}" <${
        process.env.EMAIL_FROM || "noreply@yourpetclinic.com"
      }>`,
      to: userEmail,
      subject: `Appointment Cancelled: ${appointment.id.substring(0, 8)}...`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #d9534f;">Appointment Cancelled</h1>
          </div>
          <p>Dear ${userName},</p>
          <p>We regret to inform you that your appointment (ID: <strong>${appointment.id}</strong>) has been cancelled.</p>
          
          <h3 style="color: #02092d;">Reason for Cancellation:</h3>
          <p style="padding: 10px; background-color: #f9f9f9; border-left: 3px solid #d9534f;">
            ${cancellationReason}
          </p>

          <h3 style="color: #02092d;">Appointment Details:</h3>
          <ul>
            <li><strong>Date & Time:</strong> ${appointmentDate}</li>
            <li><strong>Pet:</strong> ${appointment.petName}</li>
            <li><strong>Service:</strong> ${appointment.serviceName}</li>
            <li><strong>Veterinarian:</strong> ${appointment.vetName}</li>
          </ul>

          <p>If you would like to reschedule or have any questions, please contact our clinic.</p>
          <p>We apologize for any inconvenience this may have caused.</p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Appointment cancellation email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending appointment cancellation email:", error);
    return false;
  }
};
