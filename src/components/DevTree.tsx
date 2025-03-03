import { Link, Outlet } from "react-router-dom";
import NavigationTabs from "./NavigationTabs";
import { Toaster } from "sonner";
import { DndContext, DragEndEvent, closestCenter} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove} from '@dnd-kit/sortable';
import { User } from "../interfaces";
import { useEffect, useState } from "react";
import { SocialNetork } from '../interfaces/index';
import DevTreeLink from "./DevTreeLink";
import { useQueryClient } from "@tanstack/react-query";
import Header from "./Header";

type DevTreeProps = {
    data : User;
}

export default function DevTree({data} : DevTreeProps) {
    //creamos un useState para almacenar las redes habilitadas desde la data que es el user que se consulta en el layout
    const [enabledLinks, setEnableLinks] = useState<SocialNetork[]>(JSON.parse(data.links).filter((item : SocialNetork) => item.enabled))

    //utilizamos un useEffect para que cada que cambie data cambiemos el valor del state, Aqui data cambia porque utilizamosSetQueryData
    useEffect(() => {
        setEnableLinks(JSON.parse(data.links).filter((item : SocialNetork) => item.enabled));
    }, [data]);
    
    const queryClient = useQueryClient();
    
    const handleDragEnd = (e : DragEndEvent) => {
        //estos elementos sirven para identificar el elemento al que estamos activando y el over donde queda, basta recalcar que tienen la propiedad id que le pasamos en el useSortable donde estan todos los elementos del drag n drop
        const { active, over } = e;
        if(over && over.id){
            //con esto vamos a obtener el indice de la posicion en donde tenemos nuestros enlaces habilitados
            const prevIndex = enabledLinks.findIndex(link => link.id === active.id);
            const newIndex = enabledLinks.findIndex(link => link.id === over.id);
            //array move va a mover los elementos segun por el indice
            const order = arrayMove(enabledLinks, prevIndex, newIndex);
            //seteamos en el state
            setEnableLinks(order);
            //obtenemos los links deshabilitados
            const disabledLinks : SocialNetork[] = JSON.parse(data.links).filter((item : SocialNetork) => !item.enabled)
            //juntamos los links
            const links = [...order, disabledLinks]
            //seteamos los links
            queryClient.setQueryData(['user'], (prevData : User) => {
                return {
                    ...prevData, 
                    links: JSON.stringify(links)
                }
            })
            
        }
    };
    return (
    <>
        <Header />
        <div className="bg-gray-100  min-h-screen py-10">
            <main className="mx-auto max-w-5xl p-10 md:p-0">
                <NavigationTabs />  
                <div className="flex justify-end">
                    <Link 
                        className="font-bold text-right text-slate-800 text-2xl"
                        to={`/${data.handle}`}
                        target="_blank"
                        rel="noreferrer noopener"
                    >Visitar Mi Perfil: <span className=" text-indigo-500">{data.handle}</span></Link>
                </div>

                <div className="flex flex-col md:flex-row gap-10 mt-10">
                    <div className="flex-1 ">
                        <Outlet />
                    </div>
                    <div className="w-full bg-slate-800 rounded-2xl md:w-96 px-5 py-10 space-y-6">
                        <p className="text-4xl text-center text-white mb-12">{data.handle}</p>
                        {data.image ? (<img src={data.image} alt="Imagen de perfil" className="mx-auto max-w-[250px] rounded-lg"></img>) : (<p className="text-center text-white text-xs">Sin Foto de Perfil</p>) }
                        <p className=" p-2 text-center text-lg font-bold text-white">{data.description}</p>

                        {/* Este es el context de donde estaran todos los elementos */}
                        <DndContext
                            //el tipo de colision que debe de tener
                            collisionDetection={closestCenter}
                            //hay multiples eventos que podemos ejectutar
                            //este es para cuando se termine de mover, esto puede ser un callback aqui mismo o tener una funcion en otro lado
                            onDragEnd={handleDragEnd}
                        >
                            <div className="mt-14 flex flex-col gap-5">
                                {/* esto es el context de los elementos sortables */}
                                <SortableContext
                                    //le tenemos que pasar todos items que tendra
                                    items={enabledLinks}
                                    //la strategy que vamos a utilizar
                                    strategy={verticalListSortingStrategy}
                                >
                                    {enabledLinks.map(link => (
                                        <DevTreeLink 
                                            key={link.name} 
                                            link={link} 
                                        />
                                    ))}
                                </SortableContext>
                            </div>
                        </DndContext>
                    </div>
                </div>
            </main>
        </div>
    <Toaster richColors  position="top-right" />
    </>
    )
}
