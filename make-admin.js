const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // REPLACE THIS WITH YOUR EMAIL
  const email = 'admin@monito.com'; 

  const user = await prisma.user.update({
    where: { email: email },
    data: { role: 'admin' },
  });

  console.log('Success! User updated:', user);
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });