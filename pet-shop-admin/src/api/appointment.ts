import { api } from "./api";

export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "confirmed";

export interface Appointment {
  id: string;
  date: string;
  notes: string | null;
  status: AppointmentStatus;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
  pet: {
    id: string;
    name: string;
    owner: {
      id: string;
      email: string;
      fullName: string;
    };
  };
  service: {
    id: string;
    name: string;
    price: number;
  };
  veterinarian: {
    id: string;
    fullName: string;
  };
}

export const fetchAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get<{ appointments: Appointment[] }>(
    "/admin/appointments",
    {
      withCredentials: true,
    }
  );
  return response.data.appointments;
};

export const updateAppointmentStatus = async (
  id: string,
  status: AppointmentStatus,
  cancellationReason?: string
): Promise<Appointment> => {
  const payload: { status: AppointmentStatus; cancellationReason?: string } = {
    status,
  };
  if (status === "cancelled" && cancellationReason) {
    payload.cancellationReason = cancellationReason;
  }
  const response = await api.patch<{ appointment: Appointment }>(
    `/admin/appointments/${id}/status`,
    payload,
    { withCredentials: true }
  );
  return response.data.appointment;
};

export const deleteAppointment = async (id: string): Promise<void> => {
  await api.delete(`/admin/appointments/${id}`, { withCredentials: true });
};
