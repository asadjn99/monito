// import { PrismaClient } from '@prisma/client'

// // 👇 DEBUGGING: Check which DB is actually loading
// // const dbUrl = process.env.DATABASE_URL || "unknown";
// // if (process.env.NODE_ENV !== 'production') {
// //   console.log("-------------------------------------------------------");
// //   // Splits the string to hide password but show the DB name at the end
// //   console.log("🔥 CONNECTING TO:", dbUrl.split('@')[1] || "Invalid URL"); 
// //   console.log("-------------------------------------------------------");
// // }

// const globalForPrisma = global as unknown as { prisma: PrismaClient }

// export const prisma = globalForPrisma.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// export default prisma;












import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    // Add this 'log' option to see queries in your terminal
    log: ['info', 'warn', 'error'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;