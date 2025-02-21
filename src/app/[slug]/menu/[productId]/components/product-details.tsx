"use client"

import { Prisma } from "@prisma/client";
import { ChefHatIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image"
import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/helpers/format-currency";

import { CartContext } from "../../contexts/cart";
import CartSheet from "./cart-sheet";
interface ProductDetailsProps {
    product: Prisma.ProductGetPayload<{include: {restaurant: true}}>
}

const ProductDetails = ({product}: ProductDetailsProps) => {

    const {toggleCart, addProducts} = useContext(CartContext)

    const [quantity, setQuantity] = useState<number>(1);

    const handleDecreaseQuantity = () => {
        setQuantity((prev) => {
            return prev - 1 < 1 ? 1 : prev - 1
        });
    }

    const handleIncreaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    }

    const handleAddToCart = () => {
        addProducts({
            ...product,
            quantity
        })
        toggleCart()
    }

    return (
        <>
            <div className="relative z-50 rounded-t3xl mt-[-1.5px] p-5 flex-auto flex flex-col overflow-hidden">

                <div className="flex-auto overflow-hidden">
                    {/* Restaurante */}
                    <div className="flex items-centes gap-1.5">
                        <Image
                            src={product.restaurant.avatarImageUrl}
                            alt={product.restaurant.name}
                            width={16}
                            height={16}
                        />

                        <p className="text-xs text-muted-foreground space-x-1">
                            {product.restaurant.name}
                        </p>
                    </div>

                    {/* Nome Produto */}
                    <h2 className="text-xl font-semibold mt-1">
                        {product.name}
                    </h2>

                    {/* Preço e quantidade */}
                    <div className="flex items-center justify-between mt-3">
                        <h3 className="text-xl font-semibold">
                            {formatCurrency(product.price)}
                        </h3>
                        <div className="flex items-center gap-3 text-center">
                            <Button onClick={handleDecreaseQuantity} variant="outline" className="h-8 w-8 rounded-xl">
                                <ChevronLeftIcon />
                            </Button>

                            <p className="w-4">
                                {quantity}
                            </p>

                            <Button onClick={handleIncreaseQuantity} variant="destructive" className="h-8 w-8 rounded-xl">
                                <ChevronRightIcon />
                            </Button>
                        </div>
                    </div>

                    <ScrollArea className="h-full">
                        {/* Sobre */}
                        <div className="mt-6 space-y-3">
                            <h4 className="font-semibold">Sobre</h4>
                            <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>

                        {/* Ingredientes */}
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-1 5">
                                <ChefHatIcon size={18} />
                                <h4 className="font-semibold">Ingredientes</h4>
                            </div>
                            <ul className="list-disc px-5 text-sm text-muted-foreground">
                                {product.ingredients.map((ingredient) => {
                                    return <li key={ingredient}>{ingredient}</li>
                                })}
                            </ul>
                        </div>
                    </ScrollArea>

                </div>

                <Button onClick={handleAddToCart} className="rounded-full mt-6 w-full">Adicionar à Sacola</Button>
            </div>
            <CartSheet />
        </>
     );
}

export default ProductDetails;