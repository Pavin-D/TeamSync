import bcrypt from 'bcryptjs';
import { prisma } from './config/database';

async function main() {
  console.log('🌱 Starting database seeding for requested users...');

  const password = 'pavin123';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // 1. Create or ensure College and Department exist for student profile
  let college = await prisma.college.findFirst({
    where: { name: 'Kongu Engineering College (KEC)' },
  });
  if (!college) {
    college = await prisma.college.create({
      data: {
        name: 'Kongu Engineering College (KEC)',
        isVerified: true,
      },
    });
  }

  let department = await prisma.department.findFirst({
    where: { collegeId: college.id, name: 'Computer Science and Engineering' },
  });
  if (!department) {
    department = await prisma.department.create({
      data: {
        collegeId: college.id,
        name: 'Computer Science and Engineering',
      },
    });
  }

  // Define users to seed
  const usersToSeed = [
    {
      email: 'user1@gmail.com',
      name: 'User One',
      role: 'STUDENT' as const,
      isVerified: true,
      type: 'STUDENT',
    },
    {
      email: 'admin@gmail.com',
      name: 'Platform Admin',
      role: 'PLATFORM_ADMIN' as const,
      isVerified: true,
      type: 'ADMIN',
    },
    {
      email: 'kec@gmail.com',
      name: 'KEC College Admin',
      role: 'COLLEGE_ADMIN' as const,
      isVerified: true,
      type: 'COLLEGE_ADMIN',
    },
    {
      email: 'staff1@gmail.com',
      name: 'Staff One',
      role: 'PROFESSIONAL' as const,
      isVerified: true,
      availableAsMentor: false,
      company: 'Kongu Engineering College',
      jobTitle: 'Assistant Professor / Staff',
      type: 'PROFESSIONAL',
    },
    {
      email: 'mentor1@gmail.com',
      name: 'Mentor One',
      role: 'PROFESSIONAL' as const,
      isVerified: true,
      availableAsMentor: true,
      company: 'Tech Solutions Inc',
      jobTitle: 'Senior Tech Mentor',
      type: 'MENTOR',
    },
  ];

  for (const u of usersToSeed) {
    console.log(`Processing ${u.email}...`);

    // Upsert User
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        passwordHash,
        role: u.role,
        isVerified: u.isVerified,
        availableAsMentor: u.availableAsMentor ?? false,
        isActive: true,
      },
      create: {
        email: u.email,
        name: u.name,
        passwordHash,
        role: u.role,
        isVerified: u.isVerified,
        availableAsMentor: u.availableAsMentor ?? false,
        isActive: true,
      },
    });

    // Ensure NotificationPreference
    await prisma.notificationPreference.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    // Handle role specific profile
    if (u.type === 'STUDENT') {
      await prisma.studentProfile.upsert({
        where: { userId: user.id },
        update: {
          collegeId: college.id,
          departmentId: department.id,
          yearOfStudy: 3,
        },
        create: {
          userId: user.id,
          collegeId: college.id,
          departmentId: department.id,
          yearOfStudy: 3,
        },
      });
    } else if (u.type === 'PROFESSIONAL' || u.type === 'MENTOR') {
      await prisma.professionalProfile.upsert({
        where: { userId: user.id },
        update: {
          company: u.company || 'Tech Corp',
          jobTitle: u.jobTitle || 'Specialist',
          verificationStatus: 'VERIFIED',
        },
        create: {
          userId: user.id,
          company: u.company || 'Tech Corp',
          jobTitle: u.jobTitle || 'Specialist',
          verificationStatus: 'VERIFIED',
        },
      });
    }

    console.log(`✅ User ${u.email} (${u.role}) successfully seeded!`);
  }

  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
