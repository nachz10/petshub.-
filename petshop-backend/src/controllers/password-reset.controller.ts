import { FastifyRequest, FastifyReply } from "fastify";
import {
  createPasswordResetToken,
  verifyPasswordResetToken,
  resetPassword,
} from "../services/forgot-password.service";
import { hashPassword } from "../utils/jwt.utils";
import {
  sendPasswordResetEmail,
  verifyEmailConfig,
} from "../utils/email.utils";

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
}

// Flag to track if we've checked email configuration
let emailConfigVerified = false;

export const forgotPassword = async (
  req: FastifyRequest<{ Body: ForgotPasswordRequest }>,
  reply: FastifyReply
) => {
  const { email } = req.body;

  try {
    if (!emailConfigVerified) {
      emailConfigVerified = await verifyEmailConfig();
      if (!emailConfigVerified) {
        req.log.warn(
          "Email configuration is incomplete. Password reset emails may not be sent."
        );
      }
    }

    const resetData = await createPasswordResetToken(email);

    if (resetData) {
      try {
        // Create the reset link with the frontend URL
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetLink = `${frontendUrl}/reset-password/${resetData.token}`;

        // Send password reset email
        await sendPasswordResetEmail(email, resetLink);

        req.log.info(`Password reset email sent to ${email}`);
      } catch (emailError) {
        // Log the error but don't expose it to the client
        req.log.error(`Failed to send password reset email: ${emailError}`);
      }
    }

    // Don't expose whether the email exists in the system for security
    return reply.status(200).send({
      message:
        "If the email exists in our system, a password reset link has been sent.",
    });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const validateResetToken = async (
  req: FastifyRequest<{ Params: { token: string } }>,
  reply: FastifyReply
) => {
  const { token } = req.params;

  try {
    const resetToken = await verifyPasswordResetToken(token);

    if (!resetToken) {
      return reply.status(400).send({
        message: "Invalid or expired password reset token",
      });
    }

    return reply.status(200).send({
      message: "Token is valid",
      userId: resetToken.userId,
    });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const resetPasswordHandler = async (
  req: FastifyRequest<{ Body: ResetPasswordRequest }>,
  reply: FastifyReply
) => {
  const { token, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const user = await resetPassword(token, hashedPassword);

    if (!user) {
      return reply.status(400).send({
        message: "Invalid or expired password reset token",
      });
    }

    return reply.status(200).send({
      message: "Password reset successful",
    });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};
