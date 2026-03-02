import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SHARED_PASSWORD = "localhub123";

async function main() {
  const passwordHash = await bcrypt.hash(SHARED_PASSWORD, 12);

  const users = [
    {
      id: "seed_profile_1",
      name: "Alice Martin",
      role: "Community Manager",
      username: "alice",
      contactLink: null,
      passwordHash,
    },
    {
      id: "seed_profile_2",
      name: "Bob Chen",
      role: "Developer",
      username: "bob",
      contactLink: null,
      passwordHash,
    },
    {
      id: "seed_profile_3",
      name: "Diana Torres",
      role: "Designer",
      username: "diana",
      contactLink: null,
      passwordHash,
    },
  ];

  for (const user of users) {
    await prisma.profile.upsert({
      where: { id: user.id },
      update: { passwordHash: user.passwordHash },
      create: user,
    });
    console.log(`✓ Upserted profile: ${user.username}`);
  }

  console.log("\nSeed complete. All accounts use password: " + SHARED_PASSWORD);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
