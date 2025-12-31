// create-admin.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10); // Change 'admin123' to your desired password

  const admin = await prisma.user.upsert({
    where: { email: 'admin@monito.com' }, // Change to your admin email
    update: {},
    create: {
      email: 'admin@monito.com',
      name: 'Super Admin',
      password: password, // We store the HASHED password, not plain text
      role: 'admin',      // THIS IS IMPORTANT
    },
  });

  console.log({ admin });
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