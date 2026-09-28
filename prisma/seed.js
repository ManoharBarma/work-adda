const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 0. Clear existing data to prevent duplicates on re-seed
  await prisma.workerSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.workerInteraction.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.category.deleteMany();
  await prisma.locality.deleteMany();

  // 1. Create Sircilla Localities
  const localityData = [
    { nameEnglish: 'Gandhi Nagar', nameTelugu: 'గాంధీ నగర్' },
    { nameEnglish: 'Vidya Nagar', nameTelugu: 'విద్యా నగర్' },
    { nameEnglish: 'Ramnagar', nameTelugu: 'రాంనగర్' },
    { nameEnglish: 'Textile Park Area', nameTelugu: 'టెక్స్‌టైల్ పార్క్' },
    { nameEnglish: 'Old Bus Stand', nameTelugu: 'పాత బస్టాండ్' },
  ];

  const localities = [];
  for (const loc of localityData) {
    const createdLoc = await prisma.locality.create({
      data: {
        ...loc,
        town: 'Sircilla',
        district: 'Rajanna Sircilla',
        state: 'Telangana',
      },
    });
    localities.push(createdLoc);
  }

  // 2. Create Categories & Skills
  const categoriesData = [
    { nameEn: "Electrician", nameTe: "ఎలక్ట్రీషియన్", icon: "⚡", slug: "electrician" },
    { nameEn: "Plumber", nameTe: "ప్లంబర్", icon: "🔧", slug: "plumber" },
    { nameEn: "Powerloom Mechanic", nameTe: "పవర్‌లూమ్ మెకానిక్", icon: "🧵", slug: "powerloom-mechanic" },
    { nameEn: "AC Technician", nameTe: "ఏసీ టెక్నీషియన్", icon: "❄️", slug: "ac-technician" },
    { nameEn: "Carpenter", nameTe: "కార్పెంటర్", icon: "🪚", slug: "carpenter" },
    { nameEn: "Motor / Pump Mechanic", nameTe: "మోటార్ మెకానిక్", icon: "🌾", slug: "motor-mechanic" },
    { nameEn: "Bike Mechanic", nameTe: "బైక్ మెకానిక్", icon: "🏍️", slug: "bike-mechanic" },
    { nameEn: "Welder", nameTe: "వెల్డర్", icon: "🔥", slug: "welder" },
    { nameEn: "Appliance Repair", nameTe: "రిపేర్", icon: "📺", slug: "appliance-repair" },
  ];

  const categories = [];
  for (let i = 0; i < categoriesData.length; i++) {
    const c = categoriesData[i];
    const createdCat = await prisma.category.create({
      data: {
        slug: c.slug,
        nameEnglish: c.nameEn,
        nameTelugu: c.nameTe,
        icon: c.icon,
        displayOrder: i + 1,
      },
    });
    categories.push(createdCat);
  }

  // 3. Create Dummy Workers for each Category
  const dummyNames = ["Ramesh", "Srinivas", "Venkatesh", "Raju", "Karthik", "Mahesh"];
  let phoneCounter = 9000000000;
  
  for (const category of categories) {
    // Create 3-5 workers per category
    const workerCount = Math.floor(Math.random() * 3) + 3; 
    
    for (let i = 0; i < workerCount; i++) {
      const randomName = dummyNames[Math.floor(Math.random() * dummyNames.length)] + ' ' + String.fromCharCode(65 + i);
      const randomLocality = localities[Math.floor(Math.random() * localities.length)];
      phoneCounter++;
      
      await prisma.worker.create({
        data: {
          slug: `${category.slug}-${randomName.toLowerCase().replace(/ /g, '-')}-${i}`,
          fullName: randomName,
          phone: phoneCounter.toString(),
          whatsappPhone: phoneCounter.toString(),
          categories: {
            connect: [{ id: category.id }]
          },
          localityId: randomLocality.id,
          experienceYears: Math.floor(Math.random() * 10) + 1,
          bio: `I am a skilled ${category.nameEnglish} with years of experience in Sircilla. Available for emergency work. (నేను సిరిసిల్లలో సంవత్సరాల అనుభవం ఉన్న నైపుణ్యం కలిగిన కార్మికుడిని.)`,
          status: 'APPROVED',
          mobileVerified: true,
          profileViews: Math.floor(Math.random() * 100),
        }
      });
    }
  }

  // 4. Create some PENDING workers for the admin dashboard
  for (let i = 0; i < 3; i++) {
     const randomCat = categories[Math.floor(Math.random() * categories.length)];
     const randomLocality = localities[Math.floor(Math.random() * localities.length)];
     const randomName = dummyNames[Math.floor(Math.random() * dummyNames.length)];
     phoneCounter++;
     
     await prisma.worker.create({
       data: {
         slug: `pending-${randomName.toLowerCase().replace(/ /g, '-')}-${i}`,
         fullName: randomName,
         phone: phoneCounter.toString(),
         categories: {
           connect: [{ id: randomCat.id }]
         },
         localityId: randomLocality.id,
         experienceYears: 2,
         status: 'PENDING'
       }
     });
  }

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
