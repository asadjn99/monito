import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Create a hashed password
  const password = await hash('Asadjn99', 12);

  // 2. Upsert the admin user (Create if doesn't exist, do nothing if it does)
  const user = await prisma.user.upsert({
    where: { email: 'admin@monito.com' },
    update: {}, // No updates if it exists
    create: {
      email: 'admin@monito.com',
      name: 'Super Admin',
      role: 'admin',
      password, // Save the hashed password
    },
  });

  console.log('Admin created:', user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });