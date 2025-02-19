import { notFound } from "next/navigation";

import { getRestaurantBySlug } from "@/data/get-restaurant-by-slug";

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
    const restaurant  = await getRestaurantBySlug(slug)

    const {ConsumptionMethod} = await searchParams

    if(!restaurant || !isConsumptionMethodValid(ConsumptionMethod))
    {
        return notFound();
    }

    return (
        <div>
            <RestaurantHeader  restaurant={restaurant}/>
        </div>
     );
}

export default RestaurantMenuPage;