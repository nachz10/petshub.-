import prisma from "../config/db";
import crypto from "crypto";

const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createEmailVerification = async (email: string) => {
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 3600000);

  await prisma.emailVerification.deleteMany({
    where: { email },
  });

  const verification = await prisma.emailVerification.create({
    data: {
      email,
      code,
      expiresAt,
    },
  });

  return {
    email: verification.email,
    code: verification.code,
  };
};

export const verifyEmailCode = async (email: string, code: string) => {
  const verification = await prisma.emailVerification.findUnique({
    where: { email },
  });

  if (!verification) {
    return { valid: false, message: "Verification not found" };
  }

  if (verification.expiresAt < new Date()) {
    await prisma.emailVerification.delete({
      where: { id: verification.id },
    });
    return { valid: false, message: "Verification code expired" };
  }

  if (verification.code !== code) {
    return { valid: false, message: "Invalid verification code" };
  }

  await prisma.emailVerification.delete({
    where: { id: verification.id },
  });

  return { valid: true, message: "Email verified successfully" };
};
