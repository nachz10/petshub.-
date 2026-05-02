import prisma from "./config/db";

async function seedVetSchedules() {
  console.log("Starting to seed vet schedules...");

  // Get all veterinarians
  const vets = await prisma.veterinarian.findMany({
    select: { id: true },
  });

  if (!vets.length) {
    console.log("No veterinarians found. Skipping schedule seeding.");
    return;
  }

  const daysOfWeek = [1, 2, 3, 4, 5]; // Monday–Friday

  const schedulesData = [];

  for (const vet of vets) {
    for (const day of daysOfWeek) {
      schedulesData.push({
        vetId: vet.id,
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "17:00",
        isAvailable: true,
      });
    }
  }

  const result = await prisma.vetSchedule.createMany({
    data: schedulesData,
    skipDuplicates: true,
  });

  console.log(`Successfully seeded ${result.count} vet schedules.`);
  console.log("Vet schedules seeding finished.");
}

async function main() {
  try {
    await seedVetSchedules();
  } catch (e) {
    console.error("Error seeding vet schedules:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();