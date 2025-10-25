import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminEmail = 'admin@hotelbooking.com';
  const adminPassword = 'admin123';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        emailVerified: true,
      },
    });
    
    console.log('✅ Admin user created');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
  } else {
    console.log('⏭️  Admin user already exists');
  }

  // Create global markup
  const existingMarkup = await prisma.globalMarkup.findFirst({
    where: { isActive: true },
  });

  if (!existingMarkup) {
    await prisma.globalMarkup.create({
      data: {
        percentage: 10.0, // 10% markup
        isActive: true,
      },
    });
    
    console.log('✅ Global markup created (10%)');
  } else {
    console.log('⏭️  Global markup already exists');
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
