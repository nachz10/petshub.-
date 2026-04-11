import prisma from "../config/db";
import crypto from "crypto";

export const createPasswordResetToken = async (email: string) => {
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 3600000);

  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  const resetToken = await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    user,
    token: resetToken.token,
  };
};

export const verifyPasswordResetToken = async (token: string) => {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) {
    return null;
  }

  if (resetToken.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });
    return null;
  }

  return resetToken;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const resetToken = await verifyPasswordResetToken(token);

  if (!resetToken) {
    return null;
  }

  const updatedUser = await prisma.users.update({
    where: { id: resetToken.userId },
    data: { password: newPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { id: resetToken.id },
  });

  return updatedUser;
};
