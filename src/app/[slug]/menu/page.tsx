import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import RestaurantCategories from "./components/categories";
import RestaurantHeader from "./components/header";

interface RestaurantMenuPageProps {
    params: Promise<{slug: string}>
    searchParams: Promise<{ConsumptionMethod: string}>
}

const isConsumptionMethodValid = (consumptionMethod: string) => {
    return ["DINE_IN", "TAKEWAY"].includes(consumptionMethod.toUpperCase());
}

const RestaurantMenuPage = async ({params, searchParams}: RestaurantMenuPageProps) => {
    const {slug} = await params
    const restaurant = await db.restaurant.findUnique({
        where: {
          slug,
        },
        include: {
            menuCategories: {
                include: {
                    products: true
                }
            }
        }
      });

    const {ConsumptionMethod} = await searchParams

    if(!restaurant || !isConsumptionMethodValid(ConsumptionMethod))
    {
        return notFound();
    }

    return (
        <div>
            <RestaurantHeader  restaurant={restaurant}/>
            <RestaurantCategories restaurant={restaurant} />
        </div>
     );
}

export default RestaurantMenuPage;