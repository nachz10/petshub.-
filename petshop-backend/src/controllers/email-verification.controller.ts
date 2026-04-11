import { FastifyRequest, FastifyReply } from "fastify";
import {
  createEmailVerification,
  verifyEmailCode,
} from "../services/email-verification-service";
import { createUser, findUserByEmail } from "../services/auth.service";
import { sendVerificationEmail } from "../utils/email.utils";
import { hashPassword } from "../utils/jwt.utils";

interface SendVerificationRequest {
  email: string;
}

interface VerifyEmailRequest {
  email: string;
  code: string;
  fullName: string;
  password: string;
}

export const sendVerificationCode = async (
  req: FastifyRequest<{ Body: SendVerificationRequest }>,
  reply: FastifyReply
) => {
  const { email } = req.body;

  try {
    // Check if email already exists in Users table
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return reply.status(400).send({
        message: "Email is already registered",
      });
    }

    // Generate and save verification code
    const verification = await createEmailVerification(email);

    // Send verification email
    await sendVerificationEmail(verification.email, verification.code);

    return reply.status(200).send({
      message: "Verification code sent to your email",
    });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const verifyAndCreateUser = async (
  req: FastifyRequest<{ Body: VerifyEmailRequest }>,
  reply: FastifyReply
) => {
  const { email, code, fullName, password } = req.body;

  try {
    // Verify the email code
    const verification = await verifyEmailCode(email, code);

    if (!verification.valid) {
      return reply.status(400).send({
        message: verification.message,
      });
    }

    // Create the user if verification is successful
    const hashedPassword = await hashPassword(password);
    const user = await createUser({
      email,
      fullName,
      password: hashedPassword,
    });

    // Return user data without sensitive information
    const { password: _, ...userWithoutPassword } = user;

    return reply.status(201).send({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};
