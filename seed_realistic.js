const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up old workers...");
  await prisma.worker.deleteMany();
  
  // Seed Categories
  const categories = [
    { slug: 'electrician', nameEnglish: 'Electrician', nameTelugu: 'ఎలక్ట్రీషియన్', icon: '⚡' },
    { slug: 'plumber', nameEnglish: 'Plumber', nameTelugu: 'ప్లంబర్', icon: '🔧' },
    { slug: 'powerloom-mechanic', nameEnglish: 'Powerloom Mechanic', nameTelugu: 'పవర్‌లూమ్ మెకానిక్', icon: '🧵' },
    { slug: 'ac-technician', nameEnglish: 'AC Technician', nameTelugu: 'ఏసీ టెక్నీషియన్', icon: '❄️' },
    { slug: 'carpenter', nameEnglish: 'Carpenter', nameTelugu: 'కార్పెంటర్', icon: '🪚' },
    { slug: 'painter', nameEnglish: 'Painter', nameTelugu: 'పెయింటర్', icon: '🎨' },
    { slug: 'general-kuli', nameEnglish: 'General Kuli (Daily Labour)', nameTelugu: 'కూలి (దినసరి)', icon: '👷' },
    { slug: 'construction-labour', nameEnglish: 'Construction Labour', nameTelugu: 'నిర్మాణ కార్మికుడు', icon: '🧱' },
    { slug: 'mason', nameEnglish: 'Mason (Mestri)', nameTelugu: 'తాపీ మేస్త్రి', icon: '🏗️' },
    { slug: 'welder', nameEnglish: 'Welder', nameTelugu: 'వెల్డర్', icon: '🔥' },
    { slug: 'driver', nameEnglish: 'Driver (Auto/Trolley/Car)', nameTelugu: 'డ్రైవర్', icon: '🛺' },
    { slug: 'cleaning', nameEnglish: 'House Cleaning / Maid', nameTelugu: 'ఇంటి పని / శుభ్రపరచడం', icon: '🧹' },
    { slug: 'other', nameEnglish: 'Other', nameTelugu: 'ఇతర', icon: '📝' }
  ];

  const categoryMap = {};
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, displayOrder: i + 1 }
    });
    categoryMap[c.slug] = created;
  }

  // Seed Localities
  const localities = [
    { nameEnglish: "Shanti Nagar", nameTelugu: "శాంతి నగర్" },
    { nameEnglish: "Textile Park", nameTelugu: "టెక్స్‌టైల్ పార్క్" },
    { nameEnglish: "BY Pass Road", nameTelugu: "బైపాస్ రోడ్" },
    { nameEnglish: "Sundarayya Nagar", nameTelugu: "సుందరయ్య నగర్" },
    { nameEnglish: "Vemulawada Road", nameTelugu: "వేములవాడ రోడ్" },
    { nameEnglish: "Siva Nagar", nameTelugu: "శివ నగర్" },
    { nameEnglish: "Sanjeevaiah Nagar", nameTelugu: "సంజీవయ్య నగర్" },
    { nameEnglish: "B.Y. Nagar", nameTelugu: "బి.వై. నగర్" },
    { nameEnglish: "Subash Nagar", nameTelugu: "సుభాష్ నగర్" },
    { nameEnglish: "Other (Not Listed)", nameTelugu: "ఇతర (జాబితాలో లేదు)" }
  ];

  const localityMap = {};
  for (const loc of localities) {
    let existing = await prisma.locality.findFirst({ where: { nameEnglish: loc.nameEnglish } });
    if (!existing) {
      existing = await prisma.locality.create({
        data: { ...loc, town: "Sircilla", district: "Rajanna Sircilla" }
      });
    }
    localityMap[loc.nameEnglish] = existing;
  }

  // Seed Realistic Workers
  const realisticWorkers = [
    {
      fullName: "Ramesh Kumar", fullNameTelugu: "రమేష్ కుమార్", phone: "9848012341", catSlug: "electrician", locName: "Shanti Nagar", experienceYears: 8, bio: "Expert in house wiring, motor repairs, and short-circuit fixes. Available 24/7."
    },
    {
      fullName: "Venkatesh", fullNameTelugu: "వెంకటేష్", phone: "9949012342", catSlug: "powerloom-mechanic", locName: "Textile Park", experienceYears: 12, bio: "Specialist in auto-loom repairing and regular powerloom maintenance."
    },
    {
      fullName: "Srinivas Goud", fullNameTelugu: "శ్రీనివాస్ గౌడ్", phone: "9849012343", catSlug: "plumber", locName: "BY Pass Road", experienceYears: 5, bio: "All types of plumbing work: PVC, CPVC fitting, water tank cleaning, tap repair."
    },
    {
      fullName: "Kishan Rao", fullNameTelugu: "కిషన్ రావు", phone: "9440012344", catSlug: "ac-technician", locName: "Sundarayya Nagar", experienceYears: 4, bio: "AC servicing, installation, and gas refilling. Refrigerator repairs also done."
    },
    {
      fullName: "Anil", fullNameTelugu: "అనిల్", phone: "9640012345", catSlug: "carpenter", locName: "Vemulawada Road", experienceYears: 15, bio: "Custom furniture making, doors, windows, and modular kitchen woodwork."
    },
    {
      fullName: "Naresh", fullNameTelugu: "నరేష్", phone: "9540012346", catSlug: "painter", locName: "Siva Nagar", experienceYears: 6, bio: "Wall putty, primer, interior and exterior painting with neat finish."
    },
    {
      fullName: "Narasimha", fullNameTelugu: "నరసింహ", phone: "8008012347", catSlug: "general-kuli", locName: "Sanjeevaiah Nagar", experienceYears: 10, bio: "Available for loading, unloading, and any general daily wage labor work."
    },
    {
      fullName: "Yadagiri", fullNameTelugu: "యాదగిరి", phone: "9700012348", catSlug: "construction-labour", locName: "B.Y. Nagar", experienceYears: 7, bio: "Slab work, concrete mixing, brick lifting, and heavy construction work."
    },
    {
      fullName: "Mallesh", fullNameTelugu: "మల్లేష్", phone: "9866012349", catSlug: "mason", locName: "Subash Nagar", experienceYears: 20, bio: "Experienced Taapi Mestri. House construction, plastering, tiles and marble fitting."
    },
    {
      fullName: "Prashanth", fullNameTelugu: "ప్రశాంత్", phone: "9989012350", catSlug: "welder", locName: "Textile Park", experienceYears: 5, bio: "Iron gates, grills, shed works and all kinds of MS welding."
    },
    {
      fullName: "Raju", fullNameTelugu: "రాజు", phone: "9390012351", catSlug: "driver", locName: "Shanti Nagar", experienceYears: 8, bio: "Auto trolley available for shifting goods, cement, and sand."
    },
    {
      fullName: "Lakshmi", fullNameTelugu: "లక్ష్మి", phone: "9246012352", catSlug: "cleaning", locName: "Sundarayya Nagar", experienceYears: 3, bio: "House cleaning, sweeping, mopping and dishwashing on a monthly or daily basis."
    }
  ];

  for (const w of realisticWorkers) {
    const slug = `${w.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now() + Math.floor(Math.random() * 1000)}`;
    await prisma.worker.create({
      data: {
        fullName: w.fullName,
        fullNameTelugu: w.fullNameTelugu,
        phone: w.phone,
        whatsappPhone: w.phone,
        slug,
        bio: w.bio,
        experienceYears: w.experienceYears,
        status: "APPROVED",
        mobileVerified: true,
        profileViews: Math.floor(Math.random() * 50) + 10,
        locality: {
          connect: { id: localityMap[w.locName].id }
        },
        categories: {
          connect: [{ id: categoryMap[w.catSlug].id }]
        }
      }
    });
  }

  console.log("Realistic seed completed!");
}

main().finally(() => prisma.$disconnect());
