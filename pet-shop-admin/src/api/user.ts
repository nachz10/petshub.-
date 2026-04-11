import { User } from "../components/user/UserTable";
import { api } from "./api";

interface UserCreateData {
  email: string;
  fullName: string;
  password: string;
}

interface UserUpdateData {
  email?: string;
  fullName?: string;
  password?: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get<{ users: User[] }>(`/users`, {
    withCredentials: true,
  });
  console.log(response.data.users);
  return response.data.users;
};

export const fetchUserById = async (id: string): Promise<User> => {
  const response = await api.get<{ user: User }>(`/users/${id}`, {
    withCredentials: true,
  });
  return response.data.user;
};

export const createUser = async (userData: UserCreateData): Promise<User> => {
  const response = await api.post<{ user: User }>(`/users`, userData, {
    withCredentials: true,
  });
  return response.data.user;
};

export const updateUser = async (
  id: string,
  userData: UserUpdateData
): Promise<User> => {
  const response = await api.put<{ user: User }>(`/users/${id}`, userData, {
    withCredentials: true,
  });
  return response.data.user;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`, { withCredentials: true });
};
