import Image from "next/image"
import { notFound } from "next/navigation";

import { getRestaurantBySlug } from "@/data/get-restaurant-by-slug";
import { getRestaurantBySlugSelect } from "@/data/get-restaurant-by-slug-select";

import ConsumptionMethodOption from "./components/consumption-method-option";

interface RestaurantPageProps {
    params: Promise<{slug: string}>
}

const RestaurantPage = async ({params}: RestaurantPageProps) => {
    const {slug} = await params
    const restaurant  = await getRestaurantBySlugSelect(slug)

    if(!restaurant)
    {
        return notFound();
    }

    return <div className="h-screen flex flex-col items-center justify-center px-6 pt-24">
        <div className="flex flex-col items-center gap-2">
            <Image src={restaurant.avatarImageUrl} alt={restaurant.name} width={82} height={82}/>
            <h2 className="font-semibold">
                {restaurant.name}
            </h2>

            <div className="pt-24 text-center space-y-2">
                <h3 className="text-2xl font-semibold">
                    Seja Bem-vindo!
                </h3>
                <p className="opacity-55">
                    Escolha como prefere aproveitar sua refeição. Estamos oferecendo praticidade e sabado em cada detalhe!
                </p>
            </div>

            <div className="pt-14 grid grid-cols-2">

                <ConsumptionMethodOption
                    buttonText="Para comer aqui"
                    imageAlt="Comer aqui"
                    imageUrl="/dine_in.png"
                    option="DINE_IN"
                    slug={slug}
                />

                <ConsumptionMethodOption
                    buttonText="Para levar"
                    imageAlt="Para levar"
                    imageUrl="/takeway.webp"
                    option="TAKEWAY"
                    slug={slug}
                />

            </div>
        </div>
    </div>;
}

export default RestaurantPage;