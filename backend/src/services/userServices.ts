import { PrismaClient, type User } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

/**
 * Generate n random users (default 1)
 */
export const generateRandomUsers = async (n: number = 1): Promise<User[]> => {
  const users: User[] = [];

  for (let i = 0; i < n; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }),
        gender: faker.person.gender(),
        country: faker.location.country(),
        avatar: faker.image.avatar(),
      },
    });

    users.push(user);
  }

  return users;
};

/**
 * Get paginated users
 */
export const getPaginatedUsers = async (
  page: number = 1,
  limit: number = 20,
  search?: string
): Promise<{ data: User[]; total: number; lastPage: number; page: number }> => {
  const skip = (page - 1) * limit;

  let where = {};
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    where = {
      OR: [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ],
    };
  }

  const total = await prisma.user.count({ where });

  const data = await prisma.user.findMany({
    skip,
    take: limit,
    where,
    orderBy: { createdAt: "desc" },
  });

  const lastPage = Math.ceil(total / limit);

  return { data, total, lastPage, page };
};
