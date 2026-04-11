import prisma from "./config/db";
import { hashPassword } from "./utils/jwt.utils";

async function seed() {
  await prisma.users.create({
    data: {
      email: "admin@example.com",
      fullName: "Admin",
      password: await hashPassword("?_*XR3VW|8l9"),
      isAdmin: true,
    },
  });
}

seed();
