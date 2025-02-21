import { Restaurant } from "@prisma/client";

import { db } from "@/lib/prisma";

export const getRestaurantBySlugSelect = async (slug: string) => {
  const restaurant = await db.$queryRawUnsafe<Restaurant[]>(`
    SELECT *
    FROM   "Restaurant"
    WHERE  slug = $1
  `, slug);

  return restaurant[0];
};
