import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../config/db";
import {
  getAvailableSlots,
  createNewPet,
  createNewAppointment,
  getUserPetsList,
  getUserAppointmentsList,
  updateAppointmentDetails,
  cancelUserAppointment,
} from "../services/appointment.service";

export const getServices = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    reply.send({ services });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching services" });
  }
};

export const getVeterinarians = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const veterinarians = await prisma.veterinarian.findMany({
      where: { isAvailable: true },
      orderBy: { fullName: "asc" },
    });
    reply.send({ veterinarians });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching veterinarians" });
  }
};

export const getAvailableTimeSlots = async (
  req: FastifyRequest<{
    Querystring: {
      date: string;
      serviceId: string;
      vetId?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { date, serviceId, vetId } = req.query;

    if (!date || !serviceId) {
      return reply
        .status(400)
        .send({ message: "Date and service ID are required" });
    }

    const availableSlots = await getAvailableSlots(date, serviceId, vetId);
    reply.send({ availableSlots });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching available time slots" });
  }
};

export const createPet = async (
  req: FastifyRequest<{
    Body: {
      name: string;
      species: string;
      breed?: string;
      age?: number;
      weight?: number;
      imageUrl?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const pet = await createNewPet(userId, req.body);
    reply.status(201).send({ pet });
  } catch (error) {
    reply.status(500).send({ message: "Error creating pet" });
  }
};

export const getUserPets = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const pets = await getUserPetsList(userId);
    reply.send({ pets });
  } catch (error) {
    reply.status(500).send({ message: "Error fetching user's pets" });
  }
};

export const bookAppointment = async (
  req: FastifyRequest<{
    Body: {
      petId: string;
      serviceId: string;
      vetId: string;
      date: string;
      time: string;
      notes?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const { petId, serviceId, vetId, date, time, notes } = req.body;

    if (!petId || !serviceId || !vetId || !date || !time) {
      return reply.status(400).send({ message: "Missing required fields" });
    }

    const appointmentDateTime = new Date(`${date}T${time}`);

    const appointment = await createNewAppointment({
      petId,
      serviceId,
      vetId,
      date: appointmentDateTime,
      notes,
    });

    reply.status(201).send({ appointment });
  } catch (error) {
    reply.status(500).send({ message: "Error booking appointment" });
  }
};

interface AppointmentQuery {
  status?: "scheduled" | "completed" | "cancelled" | "expired" | "Confirmed";
}

export const getUserAppointments = async (
  req: FastifyRequest<{ Querystring: AppointmentQuery }>,
  reply: FastifyReply
) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const whereClause = {
      pet: {
        ownerId: userId,
      },
      ...(status && { status }),
    };

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        pet: true,
        service: true,
        veterinarian: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    reply.send({ appointments });
  } catch (error) {
    reply.status(500).send({ message: "Failed to fetch appointments" });
  }
};

export const updateAppointment = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: {
      date?: string;
      time?: string;
      vetId?: string;
      notes?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { date, time, vetId, notes } = req.body;

    let appointmentDateTime;
    if (date && time) {
      appointmentDateTime = new Date(`${date}T${time}`);
    }

    const updatedAppointment = await updateAppointmentDetails(id, userId, {
      date: appointmentDateTime,
      vetId,
      notes,
    });

    reply.send({ appointment: updatedAppointment });
  } catch (error: any) {
    if (
      error.message === "Appointment not found" ||
      error.message === "Unauthorized"
    ) {
      return reply.status(404).send({ message: error.message });
    }
    reply.status(500).send({ message: "Error updating appointment" });
  }
};

export const cancelAppointment = async (
  req: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const { id } = req.params;

    await cancelUserAppointment(id, userId);
    reply.send({ message: "Appointment cancelled successfully" });
  } catch (error: any) {
    if (
      error.message === "Appointment not found" ||
      error.message === "Unauthorized"
    ) {
      return reply.status(404).send({ message: error.message });
    }
    reply.status(500).send({ message: "Error cancelling appointment" });
  }
};
