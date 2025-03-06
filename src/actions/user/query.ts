import { client } from "@/lib/db";

export const findUser = async (clerkId: string) => {
  return await client.user.findFirst({
    where: {
      clerkId: clerkId,
    },
    include: {
      business: {
        select: {
          name: true,
          id: true,
          image: true,
        },
      },
    },
  });
};

export const createUser = async (clerkId: string, email: string) => {
  return await client.user.create({
    data: {
      clerkId: clerkId,
      email: email,
      business: {
        create: {
          name: email,
        },
      },
    },
    include: {
      business: {
        select: {
          name: true,
          id: true,
          image: true,
        },
      },
    },
  });
};

export const upgradePlan = async (clerkId: string) => {
  return await client.user.update({
    where: {
      clerkId,
    },
    data: {
      premium: true,
    },
  });
};
