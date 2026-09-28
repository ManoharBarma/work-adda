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

  // Seed Realistic Workers (Expanded)
  const realisticWorkers = [
    // Electrician
    { fullName: "Ramesh Kumar", fullNameTelugu: "రమేష్ కుమార్", phone: "9848012341", catSlug: "electrician", locName: "Shanti Nagar", experienceYears: 8, bio: "Expert in house wiring, motor repairs, and short-circuit fixes." },
    { fullName: "Sathish", fullNameTelugu: "సతీష్", phone: "9948012341", catSlug: "electrician", locName: "Textile Park", experienceYears: 5, bio: "Inverter and AC wiring specialist." },
    { fullName: "Srinu", fullNameTelugu: "శ్రీను", phone: "9748012341", catSlug: "electrician", locName: "Sundarayya Nagar", experienceYears: 12, bio: "All types of electrical works including panel boards." },
    
    // Plumber
    { fullName: "Srinivas Goud", fullNameTelugu: "శ్రీనివాస్ గౌడ్", phone: "9849012343", catSlug: "plumber", locName: "BY Pass Road", experienceYears: 5, bio: "PVC, CPVC fitting, water tank cleaning, tap repair." },
    { fullName: "Praveen", fullNameTelugu: "ప్రవీణ్", phone: "9949012343", catSlug: "plumber", locName: "Siva Nagar", experienceYears: 8, bio: "Pipe leakage fixing and motor installation." },
    { fullName: "Balaiah", fullNameTelugu: "బాలయ్య", phone: "9749012343", catSlug: "plumber", locName: "Vemulawada Road", experienceYears: 15, bio: "New house plumbing and drainage systems." },
    
    // Powerloom Mechanic
    { fullName: "Venkatesh", fullNameTelugu: "వెంకటేష్", phone: "9949012342", catSlug: "powerloom-mechanic", locName: "Textile Park", experienceYears: 12, bio: "Specialist in auto-loom repairing." },
    { fullName: "Laxman", fullNameTelugu: "లక్ష్మణ్", phone: "9849012342", catSlug: "powerloom-mechanic", locName: "B.Y. Nagar", experienceYears: 20, bio: "Senior mechanic for all types of Sircilla looms." },
    { fullName: "Ganesh", fullNameTelugu: "గణేష్", phone: "9749012342", catSlug: "powerloom-mechanic", locName: "Sanjeevaiah Nagar", experienceYears: 6, bio: "Fast and reliable loom repairs." },
    
    // AC Technician
    { fullName: "Kishan Rao", fullNameTelugu: "కిషన్ రావు", phone: "9440012344", catSlug: "ac-technician", locName: "Sundarayya Nagar", experienceYears: 4, bio: "AC servicing, installation, and gas refilling." },
    { fullName: "Naveen", fullNameTelugu: "నవీన్", phone: "9540012344", catSlug: "ac-technician", locName: "Subash Nagar", experienceYears: 7, bio: "Window and Split AC repair specialist." },
    { fullName: "Suresh", fullNameTelugu: "సురేష్", phone: "9640012344", catSlug: "ac-technician", locName: "Shanti Nagar", experienceYears: 3, bio: "AC deep cleaning and fridge repairs." },
    
    // Carpenter
    { fullName: "Anil", fullNameTelugu: "అనిల్", phone: "9640012345", catSlug: "carpenter", locName: "Vemulawada Road", experienceYears: 15, bio: "Custom furniture making, doors, windows." },
    { fullName: "Lingam", fullNameTelugu: "లింగం", phone: "9740012345", catSlug: "carpenter", locName: "Textile Park", experienceYears: 25, bio: "Expert in teak wood carving and traditional furniture." },
    { fullName: "Ravi", fullNameTelugu: "రవి", phone: "9840012345", catSlug: "carpenter", locName: "BY Pass Road", experienceYears: 10, bio: "Modular kitchen and wardrobe specialist." },
    
    // Painter
    { fullName: "Naresh", fullNameTelugu: "నరేష్", phone: "9540012346", catSlug: "painter", locName: "Siva Nagar", experienceYears: 6, bio: "Wall putty, primer, interior and exterior painting." },
    { fullName: "Vijay", fullNameTelugu: "విజయ్", phone: "9440012346", catSlug: "painter", locName: "Sanjeevaiah Nagar", experienceYears: 12, bio: "Royal play designs and texture painting." },
    { fullName: "Kiran", fullNameTelugu: "కిరణ్", phone: "9340012346", catSlug: "painter", locName: "Sundarayya Nagar", experienceYears: 8, bio: "House painting and wood polish works." },
    
    // General Kuli
    { fullName: "Narasimha", fullNameTelugu: "నరసింహ", phone: "8008012347", catSlug: "general-kuli", locName: "Sanjeevaiah Nagar", experienceYears: 10, bio: "Available for loading, unloading, and daily wage labor." },
    { fullName: "Yellaiah", fullNameTelugu: "ఎల్లయ్య", phone: "8108012347", catSlug: "general-kuli", locName: "Vemulawada Road", experienceYears: 15, bio: "Hardworking laborer for any field or house work." },
    { fullName: "Kanakavva", fullNameTelugu: "కనకవ్వ", phone: "8208012347", catSlug: "general-kuli", locName: "Subash Nagar", experienceYears: 20, bio: "Daily wage female worker for shifting and cleaning." },
    
    // Construction Labour
    { fullName: "Yadagiri", fullNameTelugu: "యాదగిరి", phone: "9700012348", catSlug: "construction-labour", locName: "B.Y. Nagar", experienceYears: 7, bio: "Slab work, concrete mixing, brick lifting." },
    { fullName: "Sammaiah", fullNameTelugu: "సమ్మయ్య", phone: "9800012348", catSlug: "construction-labour", locName: "Shanti Nagar", experienceYears: 12, bio: "Experienced in all types of heavy construction labor." },
    { fullName: "Muthyam", fullNameTelugu: "ముత్యం", phone: "9900012348", catSlug: "construction-labour", locName: "Textile Park", experienceYears: 5, bio: "Available for daily construction site work." },
    
    // Mason (Mestri)
    { fullName: "Mallesh", fullNameTelugu: "మల్లేష్", phone: "9866012349", catSlug: "mason", locName: "Subash Nagar", experienceYears: 20, bio: "Experienced Taapi Mestri. Plastering, tiles fitting." },
    { fullName: "Odelu", fullNameTelugu: "ఓదెలు", phone: "9766012349", catSlug: "mason", locName: "BY Pass Road", experienceYears: 25, bio: "Expert in building new houses from foundation." },
    { fullName: "Prasad", fullNameTelugu: "ప్రసాద్", phone: "9666012349", catSlug: "mason", locName: "Siva Nagar", experienceYears: 15, bio: "Specialist in granite and marble flooring." },
    
    // Welder
    { fullName: "Prashanth", fullNameTelugu: "ప్రశాంత్", phone: "9989012350", catSlug: "welder", locName: "Textile Park", experienceYears: 5, bio: "Iron gates, grills, shed works." },
    { fullName: "Shiva", fullNameTelugu: "శివ", phone: "9889012350", catSlug: "welder", locName: "Vemulawada Road", experienceYears: 10, bio: "All kinds of MS welding and truss work." },
    { fullName: "Ashok", fullNameTelugu: "అశోక్", phone: "9789012350", catSlug: "welder", locName: "B.Y. Nagar", experienceYears: 8, bio: "Rolling shutters and steel railing works." },
    
    // Driver
    { fullName: "Raju", fullNameTelugu: "రాజు", phone: "9390012351", catSlug: "driver", locName: "Shanti Nagar", experienceYears: 8, bio: "Auto trolley available for shifting goods." },
    { fullName: "Mahender", fullNameTelugu: "మహేందర్", phone: "9490012351", catSlug: "driver", locName: "Sanjeevaiah Nagar", experienceYears: 15, bio: "Heavy vehicle and tractor driver." },
    { fullName: "Vamshi", fullNameTelugu: "వంశీ", phone: "9590012351", catSlug: "driver", locName: "Sundarayya Nagar", experienceYears: 4, bio: "Car driver available for outstation trips." },
    
    // Cleaning
    { fullName: "Lakshmi", fullNameTelugu: "లక్ష్మి", phone: "9246012352", catSlug: "cleaning", locName: "Sundarayya Nagar", experienceYears: 3, bio: "House cleaning, sweeping, mopping." },
    { fullName: "Sujatha", fullNameTelugu: "సుజాత", phone: "9346012352", catSlug: "cleaning", locName: "B.Y. Nagar", experienceYears: 10, bio: "Available for monthly maid work and dishwashing." },
    { fullName: "Ramavva", fullNameTelugu: "రామవ్వ", phone: "9446012352", catSlug: "cleaning", locName: "BY Pass Road", experienceYears: 15, bio: "Office cleaning and general housekeeping." }
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
