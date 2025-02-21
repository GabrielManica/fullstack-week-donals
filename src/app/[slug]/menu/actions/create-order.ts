"use server";

import { ConsumptionMethod } from "@prisma/client";

import { db } from "@/lib/prisma";
import { getRestaurantBySlug } from "@/data/get-restaurant-by-slug";
import { notFound } from "next/navigation";

interface CreateOrderInput {
  customerName: string;
  customerCpf: string;
  products: Array<{
    id: string;
    quantity: number;
  }>;
  consumptionMethod: ConsumptionMethod;
  slug: string;
}

export const createOrder = async (input: CreateOrderInput) => {
  const restaurant = await getRestaurantBySlug(input.slug)

  if(!restaurant)
  {
    return notFound();
  }

  const productsWithprices = await db.product.findMany({
    where: {
      id: {
        in: input.products.map((item) => item.id),
      },
    },
  });

  const productsWithPricesAndQuantities = input.products.map((product) => ({
    productId: product.id,
    quantity: product.quantity,
    price: productsWithprices.find((p) => p.id === product.id)?.price,
  }));

  await db.order.create({
    data: {
      status: "PENDING",
      customerName: input.customerName,
      customerCpf: input.customerCpf,
      orderProducts: {
        createMany: {
          data: productsWithPricesAndQuantities,
        },
      },
      total: productsWithPricesAndQuantities.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0,
      ),
      consumptionMethod: input.consumptionMethod,
      restaurantId: restaurant.id,
    },
  });
};
