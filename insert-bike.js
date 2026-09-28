const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.category.upsert({
    where: { slug: 'bike-mechanic' },
    update: {},
    create: {
      slug: 'bike-mechanic',
      nameEnglish: 'Bike Mechanic',
      nameTelugu: 'బైక్ మెకానిక్',
      icon: '🏍️',
      displayOrder: 3,
    },
  });
  console.log('Bike mechanic added!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
