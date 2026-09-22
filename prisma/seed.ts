import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting E-Waste Locator database seeding...');

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.rewardTransaction.deleteMany();
  await prisma.aIScan.deleteMany();
  await prisma.pickupRequest.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.user.deleteMany();
  await prisma.rewardCatalog.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Dr. Rajesh Sharma (Admin)',
      email: 'admin@ecocycle.gov.in',
      password: passwordHash,
      phone: '+91 98765 43210',
      role: 'ADMIN',
      rewardPoints: 1250,
    },
  });

  const managerUser1 = await prisma.user.create({
    data: {
      name: 'Priya Sundaram (Manager)',
      email: 'manager.blr@ecocycle.in',
      password: passwordHash,
      phone: '+91 98123 45678',
      role: 'FACILITY_MANAGER',
      rewardPoints: 800,
    },
  });

  const managerUser2 = await prisma.user.create({
    data: {
      name: 'Vikram Mehta (Manager)',
      email: 'manager.delhi@ecocycle.in',
      password: passwordHash,
      phone: '+91 98987 65432',
      role: 'FACILITY_MANAGER',
      rewardPoints: 650,
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: 'Aarav Verma',
      email: 'user@example.com',
      password: passwordHash,
      phone: '+91 91234 56789',
      role: 'USER',
      rewardPoints: 480,
    },
  });

  const demoUser2 = await prisma.user.create({
    data: {
      name: 'Neha Kapoor',
      email: 'neha@example.com',
      password: passwordHash,
      phone: '+91 97777 88888',
      role: 'USER',
      rewardPoints: 920,
    },
  });

  console.log('✅ Seeded Users (Admin, Managers, Standard Users)');

  // 2. Create Facilities across major Indian Tech Hubs
  const facility1 = await prisma.facility.create({
    data: {
      name: 'GreenTech E-Waste Recyclers & Dismantlers',
      address: 'Plot 42, Electronic City Phase 1, Near Infosys Gate 4',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560100',
      latitude: 12.8452,
      longitude: 77.6602,
      phone: '+91 80 2852 9900',
      email: 'contact@greentechrecyclers.in',
      website: 'https://greentechrecyclers.in',
      openingHours: 'Mon-Sat: 9:00 AM - 7:00 PM',
      acceptedCategories: 'Smartphone, Laptop, Desktop, Battery, Charger, Cable, Printer, Monitor',
      recyclingServices: 'Hazardous Waste Neutralization, Circuit Board Precious Metal Recovery, Battery Processing, Refurbishing',
      capacity: '25,000 kg/month',
      rating: 4.9,
      isVerified: true,
      managerId: managerUser1.id,
    },
  });

  const facility2 = await prisma.facility.create({
    data: {
      name: 'EcoDisposal National E-Waste Center',
      address: 'Okhla Industrial Area Phase III, Near NSIC Metro',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110020',
      latitude: 28.5484,
      longitude: 77.2723,
      phone: '+91 11 4102 8822',
      email: 'info@ecodisposal.gov.in',
      website: 'https://ecodisposal-delhi.org',
      openingHours: 'Mon-Sun: 8:30 AM - 8:00 PM',
      acceptedCategories: 'Television, Refrigerator, Washing Machine, Smartphone, Desktop, Printer, Battery',
      recyclingServices: 'Heavy Appliance Shredding, CRT Recycling, Li-ion Battery Storage, Copper & Aluminum Extraction',
      capacity: '40,000 kg/month',
      rating: 4.8,
      isVerified: true,
      managerId: managerUser2.id,
    },
  });

  const facility3 = await prisma.facility.create({
    data: {
      name: 'Attero Recycling Hub - Whitefield',
      address: 'Industrial Plot 18, Hoodi Village, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560048',
      latitude: 12.9901,
      longitude: 77.7126,
      phone: '+91 80 4912 3344',
      email: 'whitefield@attero.in',
      website: 'https://attero.in',
      openingHours: 'Mon-Sat: 9:30 AM - 6:30 PM',
      acceptedCategories: 'Smartphone, Laptop, Keyboard, Mouse, Charger, Battery, PCB',
      recyclingServices: 'Zero-Landfill Dismantling, E-Waste Refurbishing, PCB Pyrometallurgy',
      capacity: '15,000 kg/month',
      rating: 4.7,
      isVerified: true,
    },
  });

  const facility4 = await prisma.facility.create({
    data: {
      name: 'EarthSense CleanTech Facility',
      address: 'MIDC Industrial Estate, Marol, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400093',
      latitude: 19.1176,
      longitude: 72.8797,
      phone: '+91 22 6123 9988',
      email: 'mumbai@earthsense.co.in',
      website: 'https://earthsense.co.in',
      openingHours: 'Mon-Sat: 9:00 AM - 6:00 PM',
      acceptedCategories: 'Smartphone, Laptop, Television, Monitor, Refrigerator, Battery, Printer',
      recyclingServices: 'Urban Mining, Certified Data Sanitization, E-Waste Drop-off Center',
      capacity: '30,000 kg/month',
      rating: 4.8,
      isVerified: true,
    },
  });

  const facility5 = await prisma.facility.create({
    data: {
      name: 'Cyberabad Clean E-Waste Recycling Unit',
      address: 'Hitec City Phase 2, Near Mindspace IT Park',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      latitude: 17.4435,
      longitude: 78.3772,
      phone: '+91 40 2311 4455',
      email: 'hyderabad@cyberewaste.org',
      website: 'https://cyberewaste.org',
      openingHours: 'Mon-Sat: 10:00 AM - 7:00 PM',
      acceptedCategories: 'Smartphone, Laptop, Desktop, Server Rack, Battery, Router, Printer',
      recyclingServices: 'Corporate E-Waste Collection, Hard Drive Destruction, Rare Earth Metal Recovery',
      capacity: '20,000 kg/month',
      rating: 4.9,
      isVerified: true,
    },
  });

  const facility6 = await prisma.facility.create({
    data: {
      name: 'Sahyadri Eco-Recyclers Center',
      address: 'Bhosari Industrial Area, Pune-Nashik Highway',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411026',
      latitude: 18.6279,
      longitude: 73.8441,
      phone: '+91 20 2712 5566',
      email: 'pune@sahyadrieco.in',
      website: 'https://sahyadrieco.in',
      openingHours: 'Mon-Sat: 9:00 AM - 6:00 PM',
      acceptedCategories: 'Smartphone, Laptop, Battery, Charger, Cable, Television, Washing Machine',
      recyclingServices: 'Community Collection Drives, Plastic Polymer Sorting, Battery Neutralization',
      capacity: '18,000 kg/month',
      rating: 4.6,
      isVerified: true,
    },
  });

  console.log('✅ Seeded 6 Comprehensive E-Waste Recycling Facilities');

  // 3. Create Sample Pickups
  await prisma.pickupRequest.create({
    data: {
      trackingCode: 'EC-849201',
      userId: demoUser.id,
      facilityId: facility1.id,
      name: 'Aarav Verma',
      phone: '+91 91234 56789',
      email: 'user@example.com',
      address: 'Flat 402, Sunshine Apartments, HSR Layout Sector 1',
      city: 'Bengaluru',
      pincode: '560102',
      category: 'Laptop & Old Chargers',
      quantity: 3,
      weightKg: 4.2,
      preferredDate: '2026-08-18',
      preferredTimeSlot: '10:00 AM - 1:00 PM',
      notes: 'Contains one Dell Vostro laptop (2018) and 2 power adapters. Hard drive removed.',
      status: 'CONFIRMED',
      estimatedPoints: 300,
    },
  });

  await prisma.pickupRequest.create({
    data: {
      trackingCode: 'EC-993104',
      userId: demoUser.id,
      facilityId: facility1.id,
      name: 'Aarav Verma',
      phone: '+91 91234 56789',
      email: 'user@example.com',
      address: 'Flat 402, Sunshine Apartments, HSR Layout Sector 1',
      city: 'Bengaluru',
      pincode: '560102',
      category: 'Smartphone & Li-Ion Battery',
      quantity: 2,
      weightKg: 0.8,
      preferredDate: '2026-08-10',
      preferredTimeSlot: '2:00 PM - 5:00 PM',
      notes: 'Old Samsung Galaxy phone with swollen battery.',
      status: 'COMPLETED',
      estimatedPoints: 150,
      earnedPoints: 150,
    },
  });

  await prisma.pickupRequest.create({
    data: {
      trackingCode: 'EC-772091',
      userId: demoUser2.id,
      facilityId: facility2.id,
      name: 'Neha Kapoor',
      phone: '+91 97777 88888',
      email: 'neha@example.com',
      address: 'B-14, Greater Kailash 2',
      city: 'New Delhi',
      pincode: '110048',
      category: 'Desktop Computer & CRT Monitor',
      quantity: 4,
      weightKg: 12.5,
      preferredDate: '2026-08-20',
      preferredTimeSlot: '11:00 AM - 2:00 PM',
      notes: 'Heavy CPU tower and 17 inch LCD screen.',
      status: 'ASSIGNED',
      estimatedPoints: 420,
    },
  });

  console.log('✅ Seeded Sample Pickup Requests');

  // 4. Create AI Scans
  await prisma.aIScan.create({
    data: {
      userId: demoUser.id,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop',
      detectedItem: 'Used Smartphone (Lithium-Ion Battery Included)',
      category: 'Smartphone',
      confidence: 96.4,
      estimatedWeightKg: 0.22,
      estimatedPoints: 100,
      recyclableMaterials: JSON.stringify({
        gold: '0.034 grams',
        copper: '14.5 grams',
        aluminum: '28.0 grams',
        plastics: '85.0 grams',
        hazardous: 'Lithium battery - handle with care',
      }),
      safetyNotes: 'Do not puncture the battery. Keep away from heat sources and place in an anti-static bag.',
      disposalMethod: 'Schedule doorstep pickup or drop off at nearest authorized center.',
      isDemoMode: true,
    },
  });

  await prisma.aIScan.create({
    data: {
      userId: demoUser.id,
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop',
      detectedItem: 'Old PC Laptop Motherboard & Chassis',
      category: 'Laptop',
      confidence: 93.8,
      estimatedWeightKg: 2.10,
      estimatedPoints: 250,
      recyclableMaterials: JSON.stringify({
        gold: '0.12 grams',
        silver: '0.85 grams',
        copper: '180.0 grams',
        aluminum: '350.0 grams',
        plastics: '600.0 grams',
      }),
      safetyNotes: 'Remove RAM and SSD before recycling for data security.',
      disposalMethod: 'Authorized E-Waste Dismantler with zero-landfill certification.',
      isDemoMode: true,
    },
  });

  console.log('✅ Seeded Sample AI Scans');

  // 5. Create Reward Transactions
  await prisma.rewardTransaction.create({
    data: {
      userId: demoUser.id,
      points: 150,
      type: 'EARNED',
      title: 'Completed E-Waste Disposal',
      description: 'Disposed 1x Smartphone & 1x Li-Ion Battery via Pickup EC-993104',
    },
  });

  await prisma.rewardTransaction.create({
    data: {
      userId: demoUser.id,
      points: 330,
      type: 'EARNED',
      title: 'First Recycle Bonus',
      description: 'Welcome bonus for joining EcoCycle sustainability pledge',
    },
  });

  // 6. Seed Reward Catalog Items
  await prisma.rewardCatalog.createMany({
    data: [
      {
        title: '₹200 Amazon Gift Card',
        description: 'Instant digital voucher redeemable on any eco-friendly products on Amazon.',
        pointsRequired: 300,
        category: 'Voucher',
        partnerName: 'Amazon Pay',
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67daf4005a?w=500&auto=format&fit=crop',
        code: 'ECO-AMZ-200',
      },
      {
        title: 'Plant 2 Native Trees',
        description: 'Plant 2 native saplings in Western Ghats forest restoration initiative with certificate.',
        pointsRequired: 200,
        category: 'Tree Planting',
        partnerName: 'Grow-Trees Foundation',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop',
        code: 'TREE-GREEN-02',
      },
      {
        title: '₹500 Flipkart Shopping Pass',
        description: 'Get ₹500 off on electronics recycling accessories & solar gadgets.',
        pointsRequired: 650,
        category: 'Voucher',
        partnerName: 'Flipkart',
        imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&auto=format&fit=crop',
        code: 'FK-ECO-500',
      },
      {
        title: 'Recycled Bamboo Tech Stand',
        description: 'Handcrafted sustainable bamboo desk smartphone & tablet holder delivered free.',
        pointsRequired: 400,
        category: 'Eco-Product',
        partnerName: 'EcoCrafts India',
        imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop',
        code: 'BAMBOO-STAND',
      },
    ],
  });

  console.log('✅ Seeded Reward Catalog & Transactions');

  // 7. Seed Reviews
  await prisma.review.create({
    data: {
      userId: demoUser.id,
      facilityId: facility1.id,
      rating: 5,
      comment: 'Super fast doorstep pickup! Driver was polite and weighed the items in front of me. Got 150 points immediately!',
    },
  });

  await prisma.review.create({
    data: {
      userId: demoUser2.id,
      facilityId: facility2.id,
      rating: 5,
      comment: 'Very professional government certified facility in Delhi. Prompt response and proper data sanitization certificate.',
    },
  });

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
