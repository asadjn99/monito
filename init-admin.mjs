// init-admin.mjs
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@monito.com';
  const password = 'admin123'; // The password you want to use

  console.log(`🔐 Hashing password for ${email}...`);
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(`👤 Creating/Updating Admin User...`);
  const admin = await prisma.user.upsert({
    where: { email: email },
    update: {
        role: 'admin', // Force role to admin if user exists
        password: hashedPassword 
    },
    create: {
      email: email,
      name: 'Super Admin',
      password: hashedPassword,
      role: 'admin', // Sets the crucial Admin role
      image: '/images/profile-placeholder.png'
    },
  });

  console.log(`✅ Success! Admin created:`);
  console.log({ 
      id: admin.id, 
      email: admin.email, 
      role: admin.role 
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });