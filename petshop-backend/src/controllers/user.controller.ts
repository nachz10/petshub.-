import { FastifyRequest, FastifyReply } from "fastify";
import {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
  getUserOrders,
  getUserAddresses,
} from "../services/user.service";

interface UserParams {
  id: string;
}

interface CreateUserBody {
  email: string;
  fullName: string;
  password: string;
}

interface UpdateUserBody {
  email?: string;
  fullName?: string;
  password?: string;
}

export const addUser = async (
  req: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply
) => {
  try {
    const { email, fullName, password } = req.body;

    if (!email || !fullName || !password) {
      return reply.status(400).send({
        message: "Email, full name and password are required",
      });
    }

    const existingUserByEmail = await getUserByEmail(email);
    if (existingUserByEmail) {
      return reply.status(400).send({
        message: "A user with this email already exists",
      });
    }

    const user = await createUser({
      email,
      fullName,
      password,
    });

    const { password: _, ...userData } = user;

    reply.status(201).send({ user: userData });
  } catch (error) {
    console.error("Error creating user:", error);
    reply.status(400).send({ message: "Error creating user", error });
  }
};

export const getUser = async (
  req: FastifyRequest<{ Params: UserParams }>,
  reply: FastifyReply
) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    reply.send({ user });
  } catch (error) {
    reply.status(400).send({ message: "Error getting user details", error });
  }
};

export const getAllUsersHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const users = await getAllUsers();
    reply.send({ users });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching users", error });
  }
};

export const editUser = async (
  req: FastifyRequest<{ Params: UserParams; Body: UpdateUserBody }>,
  reply: FastifyReply
) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return reply.status(404).send({ message: "User not found" });
    }
    if (updateData.email && updateData.email !== existingUser.email) {
      const userWithEmail = await getUserByEmail(updateData.email);
      if (userWithEmail && userWithEmail.id !== id) {
        return reply.status(400).send({
          message: "Email is already in use by another user",
        });
      }
    }

    const updatedUser = await updateUser(id, updateData);

    reply.send({ user: updatedUser });
  } catch (error) {
    reply.status(400).send({ message: "Error updating user", error });
  }
};

export const removeUser = async (
  req: FastifyRequest<{ Params: UserParams }>,
  reply: FastifyReply
) => {
  const { id } = req.params;

  try {
    // Check if user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return reply.status(404).send({ message: "User not found" });
    }

    // Delete user
    await deleteUser(id);

    reply.send({ message: "User deleted successfully" });
  } catch (error) {
    reply.status(400).send({ message: "Error deleting user", error });
  }
};

export async function getUserProfileData(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const userId = req.user.id;

    const [orders, addresses] = await Promise.all([
      getUserOrders(userId),
      getUserAddresses(userId),
    ]);

    return res.send({
      orders,
      addresses,
    });
  } catch (error) {
    console.error("Error fetching user profile data:", error);
    return res.status(500).send({ message: "Failed to load profile data." });
  }
}

export async function getMyOrders(req: FastifyRequest, res: FastifyReply) {
  try {
    const userId = req.user.id;
    const orders = await getUserOrders(userId);
    return res.send(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).send({ message: "Failed to load orders." });
  }
}

export async function getMyAddresses(req: FastifyRequest, res: FastifyReply) {
  try {
    const userId = req.user.id;
    const addresses = await getUserAddresses(userId);
    return res.send(addresses);
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return res.status(500).send({ message: "Failed to load addresses." });
  }
}
