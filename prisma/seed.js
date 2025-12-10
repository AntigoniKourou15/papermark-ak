const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Add your seed data here. Currently a no-op seed.
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
