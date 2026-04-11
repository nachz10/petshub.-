import prisma from "./config/db";

async function seedServices() {
  console.log("Starting to seed services...");

  const servicesData = [
    {
      name: "General Wellness Exam",
      description:
        "A comprehensive head-to-tail physical examination to assess your pet's overall health, including weight check, dental inspection, and vital signs monitoring.",
      duration: 30,
      price: 1500.0,
      imageUrl:
        "https://media.istockphoto.com/id/1369629039/photo/veterinarian-examining-dog-in-clinic.jpg?s=1024x1024&w=is&k=20&c=example",
      isActive: true,
    },
    {
      name: "Vaccination",
      description:
        "Core and non-core vaccinations administered by a licensed veterinarian to protect your pet from common and serious diseases.",
      duration: 20,
      price: 800.0,
      imageUrl:
        "https://media.istockphoto.com/id/1301558624/photo/veterinarian-giving-injection-to-dog.jpg?s=1024x1024&w=is&k=20&c=example",
      isActive: true,
    },
    {
      name: "Dental Cleaning",
      description:
        "Professional dental scaling and polishing under safe anesthesia to remove plaque and tartar buildup, preventing gum disease and tooth decay.",
      duration: 90,
      price: 4500.0,
      imageUrl:
        "https://media.istockphoto.com/id/1398123456/photo/vet-cleaning-dog-teeth.jpg?s=1024x1024&w=is&k=20&c=example",
      isActive: true,
    },
    {
      name: "Microchipping",
      description:
        "A quick and safe procedure that implants a tiny identification chip under your pet's skin, giving them a permanent ID that can be scanned if they are ever lost.",
      duration: 15,
      price: 600.0,
      imageUrl:
        "https://media.istockphoto.com/id/1247893456/photo/vet-microchipping-a-dog.jpg?s=1024x1024&w=is&k=20&c=example",
      isActive: true,
    },
    {
      name: "Deworming",
      description:
        "Effective treatment to eliminate internal parasites such as roundworms, tapeworms, hookworms, and whipworms, keeping your pet healthy from the inside out.",
      duration: 15,
      price: 500.0,
      imageUrl:
        "https://media.istockphoto.com/id/1158123456/photo/vet-giving-pill-to-dog.jpg?s=1024x1024&w=is&k=20&c=example",
      isActive: true,
    },
    {
      name: "Spay & Neuter Consultation",
      description:
        "An in-depth consultation with a veterinarian to discuss the benefits, risks, and best timing for your pet's spay or neuter procedure.",
      duration: 30,
      price: 700.0,
      imageUrl:
        "https://media.istockphoto.com/id/1321234567/photo/vet-consulting-pet-owner.jpg?s=1024x1024&w=is&k=20&c=example",
      isActive: true,
    },
    {
      name: "X-Ray & Imaging",
      description:
        "Digital radiography and ultrasound imaging services to diagnose bone fractures, organ abnormalities, and other internal conditions with precision.",
      duration: 45,
      price: 3500.0,
      imageUrl:
        "https://media.istockphoto.com/id/1078901234/photo/vet-xray-dog.jpg?s=1024x1024&w=is&k=20&c=example",
      isActive: true,
    },
    {
      name: "Grooming",
      description:
        "Full grooming session including bathing, blow-drying, nail trimming, ear cleaning, and a breed-appropriate haircut to keep your pet looking and feeling their best.",
      duration: 60,
      price: 1200.0,
      imageUrl:
        "https://media.istockphoto.com/id/1182345678/photo/groomer-grooming-dog.jpg?s=1024x1024&w=is&k=20&c=example",
      isActive: true,
    },
    {
      name: "Blood & Lab Tests",
      description:
        "Comprehensive blood panels, urinalysis, and fecal tests to detect infections, organ dysfunction, parasites, and other health concerns early.",
      duration: 30,
      price: 2500.0,
      imageUrl:
        "https://media.istockphoto.com/id/1045678901/photo/vet-blood-sample-dog.jpg?s=1024x1024&w=is&k=20&c=example",
      isActive: true,
    },
    {
      name: "Emergency Consultation",
      description:
        "Priority same-day examination for pets experiencing urgent symptoms such as difficulty breathing, sudden lethargy, vomiting, or injury.",
      duration: 45,
      price: 2000.0,
      imageUrl:
        "https://media.istockphoto.com/id/987654321/photo/emergency-vet-consultation.jpg?s=1024x1024&w=is&k=20&c=example",
      isActive: true,
    },
  ];

  const result = await prisma.service.createMany({
    data: servicesData,
    skipDuplicates: true,
  });

  console.log(`Successfully seeded ${result.count} services.`);
  console.log("Services seeding finished.");
}

async function main() {
  try {
    await seedServices();
  } catch (e) {
    console.error("Error seeding services:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();