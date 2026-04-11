import prisma from "../config/db";

const generateTimeSlots = (
  startTime: string,
  endTime: string,
  duration: number
): string[] => {
  const timeSlots: string[] = [];
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);

  let current = new Date(start);
  while (current < end) {
    timeSlots.push(
      current.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
    current = new Date(current.getTime() + duration * 60 * 1000);
  }

  return timeSlots;
};

export const getAvailableSlots = async (
  dateString: string,
  serviceId: string,
  vetId?: string
) => {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    throw new Error("Service not found");
  }

  const vetsWithSchedule = await prisma.veterinarian.findMany({
    where: {
      isAvailable: true,
      ...(vetId ? { id: vetId } : {}),
      schedules: {
        some: {
          dayOfWeek,
          isAvailable: true,
        },
      },
    },
    include: {
      schedules: {
        where: {
          dayOfWeek,
          isAvailable: true,
        },
      },
      appointments: {
        where: {
          date: {
            gte: new Date(date.setHours(0, 0, 0, 0)),
            lt: new Date(date.setHours(23, 59, 59, 999)),
          },
        },
        include: {
          service: true,
        },
      },
    },
  });

  const formattedDate = date.toISOString().split("T")[0];

  const availableSlots = vetsWithSchedule.map((vet) => {
    const schedule = vet.schedules[0];

    if (!schedule) {
      return {
        vetId: vet.id,
        vetName: vet.fullName,
        availableSlots: [],
      };
    }

    const allTimeSlots = generateTimeSlots(
      schedule.startTime,
      schedule.endTime,
      service.duration
    );

    const bookedSlots = vet.appointments.reduce((slots, appointment) => {
      const appointmentDate = new Date(appointment.date);
      const appointmentTime = appointmentDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const endMinutes =
        appointmentDate.getMinutes() + appointment.service.duration;
      const endHours = appointmentDate.getHours() + Math.floor(endMinutes / 60);
      const remainingMinutes = endMinutes % 60;

      const formattedEndHour = endHours.toString().padStart(2, "0");
      const formattedEndMinutes = remainingMinutes.toString().padStart(2, "0");
      const appointmentEndTime = `${formattedEndHour}:${formattedEndMinutes}`;

      return slots.concat(
        allTimeSlots.filter((slot) => {
          return slot >= appointmentTime && slot < appointmentEndTime;
        })
      );
    }, [] as string[]);

    const availableTimeSlots = allTimeSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    return {
      vetId: vet.id,
      vetName: vet.fullName,
      availableSlots: availableTimeSlots,
    };
  });

  return availableSlots;
};

export const createNewPet = async (
  userId: string,
  petData: {
    name: string;
    species: string;
    breed?: string;
    age?: number;
    weight?: number;
    imageUrl?: string;
  }
) => {
  return prisma.pet.create({
    data: {
      ...petData,
      owner: {
        connect: { id: userId },
      },
    },
  });
};

export const getUserPetsList = async (userId: string) => {
  return prisma.pet.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });
};

export const createNewAppointment = async (appointmentData: {
  petId: string;
  serviceId: string;
  vetId: string;
  date: Date;
  notes?: string;
}) => {
  const pet = await prisma.pet.findUnique({
    where: { id: appointmentData.petId },
  });

  if (!pet) {
    throw new Error("Pet not found");
  }

  return prisma.appointment.create({
    data: {
      pet: { connect: { id: appointmentData.petId } },
      service: { connect: { id: appointmentData.serviceId } },
      veterinarian: { connect: { id: appointmentData.vetId } },
      date: appointmentData.date,
      notes: appointmentData.notes,
    },
    include: {
      pet: true,
      service: true,
      veterinarian: true,
    },
  });
};

export const getUserAppointmentsList = async (userId: string) => {
  return prisma.appointment.findMany({
    where: {
      pet: {
        ownerId: userId,
      },
    },
    include: {
      pet: true,
      service: true,
      veterinarian: true,
    },
    orderBy: { date: "asc" },
  });
};

export const updateAppointmentDetails = async (
  appointmentId: string,
  userId: string,
  updateData: {
    date?: Date;
    vetId?: string;
    notes?: string;
  }
) => {
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      pet: {
        ownerId: userId,
      },
    },
  });

  if (!appointment) {
    throw new Error("Appointment not found or unauthorized");
  }

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      ...(updateData.date && { date: updateData.date }),
      ...(updateData.vetId && {
        veterinarian: { connect: { id: updateData.vetId } },
      }),
      ...(updateData.notes !== undefined && { notes: updateData.notes }),
    },
    include: {
      pet: true,
      service: true,
      veterinarian: true,
    },
  });
};

export const cancelUserAppointment = async (
  appointmentId: string,
  userId: string
) => {
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      pet: {
        ownerId: userId,
      },
    },
  });

  if (!appointment) {
    throw new Error("Appointment not found or unauthorized");
  }

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: "cancelled" },
  });
};
