"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ConsumptionMethod } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import {PatternFormat} from "react-number-format"
import {z} from "zod"

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createOrder } from "../actions/create-order";
import { CartContext } from "../contexts/cart";

const formSchema = z.object({
    name: z.string().trim().min(1, {
        message: "O nome é obrigatório"
    }),
    cpf: z.string().trim().min(1, {
        message: "CPF é obrigatório"
    })
})

type FormSchema = z.infer<typeof formSchema>

interface FinishDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const FinishOrderDialog = ({open, onOpenChange}: FinishDialogProps) => {
    const searchParams = useSearchParams()
    const {products} = useContext(CartContext)

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            cpf: ""
        },
        shouldUnregister: true
    })

    const onSubmit = async (data: FormSchema) => {
        try {
            const consumptionMethod = searchParams.get("ConsumptionMethod") as ConsumptionMethod;

            await createOrder({
                consumptionMethod,
                customerCpf: data.cpf,
                customerName: data.name,
                products,
                restaurantId
            })
        } catch (error) {

        }
    }
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerTrigger asChild>

            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Finalizar Pedido</DrawerTitle>
                    <DrawerDescription>Insira suas informações abaixo para finalizar seu pedido.</DrawerDescription>
                </DrawerHeader>

               <div className="p-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite seu nome" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            <FormField
                                control={form.control}
                                name="cpf"
                                render={({ field }) => (
                                <FormItem>
                                <FormLabel>Seu CPF</FormLabel>
                                <FormControl>
                                    <PatternFormat placeholder="Digite seu CPF" format="###.###.###-##" customInput={Input} {...field}/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            <DrawerFooter>
                                <Button variant="destructive" className="rounded-full" type="submit">Finalizar</Button>
                                <DrawerClose asChild>
                                    <Button className="w-full rounded-full" variant="outline">Cancelar</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </Form>
               </div>
            </DrawerContent>
        </Drawer>

     );
}

export default FinishOrderDialog;