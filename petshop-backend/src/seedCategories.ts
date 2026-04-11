import prisma from "./config/db";

async function seedCategories() {
  console.log("Starting to seed categories...");

  const categoriesData = [
    {
      name: "Dog Food",
      description:
        "Nutritious and delicious food options for dogs of all breeds, ages, and dietary needs.",
      imageUrl:
        "https://media.istockphoto.com/id/1470587753/photo/cute-puppies-eating-from-their-bowls.jpg?s=612x612&w=0&k=20&c=rRfMCtImtq-6zb_2S5SR0NIUNythEcRAtQb94G1S5lk=",
      isFeatured: true,
      showInNav: true,
    },
    {
      name: "Dog Toys",
      description:
        "A wide variety of fun and engaging toys to keep your canine friend entertained, active, and mentally stimulated.",
      imageUrl:
        "https://images.unsplash.com/photo-1589924749359-9697080c3577?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      isFeatured: true,
      showInNav: true,
    },
    {
      name: "Dog Beds",
      description:
        "Comfortable, supportive, and stylish beds to ensure your dog gets a restful sleep.",
      imageUrl:
        "https://media.istockphoto.com/id/183792097/photo/a-tired-golden-retriever-lying-on-a-blue-doggy-bed.jpg?s=1024x1024&w=is&k=20&c=qq7GzvnOMVTL-WfH0PJLV6_dwbwW_9CNfW86kkm-u_s=",
      isFeatured: true,
      showInNav: true,
    },
    {
      name: "Cat Food",
      description:
        "High-quality cat food formulas, including wet, dry, and treats for cats of all life stages.",
      imageUrl:
        "https://media.istockphoto.com/id/1379860798/photo/dinner-time.jpg?s=1024x1024&w=is&k=20&c=gJwQC2HG_OOfaCg2v-Fbx3f9tsjXAU5jKiirEi44H5A=",
      isFeatured: true,
      showInNav: true,
    },
    {
      name: "Cat Toys",
      description:
        "Interactive and stimulating toys designed to satisfy your cat's natural hunting instincts and playfulness.",
      imageUrl:
        "https://media.istockphoto.com/id/1979288111/photo/cat-toys-isolated-on-white-background-studio-shot.jpg?s=1024x1024&w=is&k=20&c=Ez3fSxeZRUph8o2GF5zxGswUwi62kYUvTyoWEMZadLA=",
      isFeatured: true,
      showInNav: true,
    },
    {
      name: "Cat Beds",
      description:
        "Cozy, warm, and secure beds, caves, and perches for your feline friend to nap and relax.",
      imageUrl:
        "https://media.istockphoto.com/id/1249884545/photo/cute-cat-in-pet-bed.jpg?s=1024x1024&w=is&k=20&c=ozuh4kmtklwQi_iNWMpB88iXOLxn_No6WqIiSfyQTzw=",
      isFeatured: true,
      showInNav: true,
    },
    {
      name: "Dog Accessories",
      description:
        "Essential and stylish accessories for dogs, including collars, leashes, harnesses, bowls, and apparel.",
      imageUrl:
        "https://media.istockphoto.com/id/1299066611/photo/pet-toys-and-accessories-for-dogs-overhead-view.jpg?s=1024x1024&w=is&k=20&c=XHtw4MAsadtDJ_wTulT6udUdxPTmViL4i924i32-abE=",
      isFeatured: true,
      showInNav: true,
    },
    {
      name: "Cat Accessories",
      description:
        "Practical and fun accessories for cats, such as scratching posts, litter boxes, carriers, and grooming tools.",
      imageUrl:
        "https://m.media-amazon.com/images/I/81BWHgkwxmL._AC_SX679_.jpg",
      isFeatured: true,
      showInNav: true,
    },
    {
      name: "Vet Products",
      description:
        "Veterinarian-approved health products, including supplements, flea & tick prevention, dental care, and first aid.",
      imageUrl:
        "https://media.istockphoto.com/id/164478117/photo/prescription-pills.jpg?s=1024x1024&w=is&k=20&c=0NTu4fAc9LXRK00gai6cbdroV2RUWEHpMv5sXgiACYQ=",
      isFeatured: false,
      showInNav: true,
    },
  ];

  const result = await prisma.categories.createMany({
    data: categoriesData,
    skipDuplicates: true,
  });

  console.log(`Successfully seeded ${result.count} categories.`);
  console.log("Categories seeding finished.");
}

async function main() {
  try {
    await seedCategories();
  } catch (e) {
    console.error("Error seeding categories:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
