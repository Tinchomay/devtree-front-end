import { useEffect, useState } from "react";
import { social } from "../data/social";
import DevTreeInput from "../components/DevTreeInput";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../api/DevTreeAPI";
import { SocialNetork, User } from "../interfaces";
import { link } from "fs";

export default function LinkTreeView() {

  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData(['user'])!;

  //useState sirve para declarar como una variable que puede ser cambiada en el componente para que react pueda hacer re-render cada vez que sufra cambios
  const [devTreeLinks, setDevTreeLinks] = useState(social);

  //podemos destructurar el mutate porque ya no tendremos otro mutate
  const { mutate } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success('Redes actualizadas correctamente')
    },
    onError: (error) => {
      toast.success(error.message)
    },
  });

  //de este modo solo se ejeucta en el primer renderizado, si queremos que se ejecute cada vez que se renderiza quitamos el ,[]
  useEffect(() => {
    //iteramos sobre los links de social que estan en el state con los del user
    const updatedData = devTreeLinks.map(item => {
      //creamos una constante que busca en el array de los links del usuario la primera coincidiencia con el item.name
      const userLink = JSON.parse(user.links).find((link: SocialNetork) => link.name === item.name)
      //si existe el link en el usuario, lo actualizamos
      if (userLink) {
        return {
          //esparcimos item y reemplazamos los valores por los de user
          ...item,
          url: userLink.url,
          enabled: userLink.enabled
        }
      }
      //si no existe, retornarmos el item como viene
      return item;
    });
    setDevTreeLinks(updatedData);
  }, []);

  //recibe el e
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //esta variable va a tener el nuevo arreglo que setearemos al state
    //iteramos sobre todo el arreglo y cuando encuentre el name que coincida con el del e, vamos a tomar una copia de ese link y cambiamos solo el url
    const updatedLinks = devTreeLinks.map(link => link.name === e.target.name ? {
      ...link,
      //Este codigo lo que hace es con un ternario validar el resultado del replace, validamos que despues de hacer el replace del prefijo el campo es un campo vacio, si es vacio el campo se queda vacio, y si no, se asigna el texto despues del prefijo 
      url: e.target.value.replace(`https://${link.name}/`, '') === '' ? '' : e.target.value.replace(`https://${link.name}/`, '')
      //si no coincide tenemos que retornar el link como estaba para no perder los demas
    } : link);
    //Actualizamos el state y esto re-renderizara el html
    setDevTreeLinks(updatedLinks);
  }


  const handleEnableLink = (socialNetwork: string) => {
    const updatedLinks = devTreeLinks.map(link => {
      if (link.name === socialNetwork) {
        if (link.url.length >= 1) {
          toast(`Red actualizada, debes de guardar los cambio para que se apliquen`)
          return {
            //tomamos una copia del link
            ...link,
            //cambiamos su valor por uno contrario
            enabled: !link.enabled
          }
        } else {
          toast.error(`La url de la red ${socialNetwork} no puede estar vacia`)
        }
      }
      return link;
    });

    //esto es lo que se almacenara en la BD
    setDevTreeLinks(updatedLinks);

    //extraemos los links del usuario
    const links: SocialNetork[] = JSON.parse(user.links);

    //esto va a ser lo que se va a ir llenando segun lo que habilitemos
    let updatedItems: SocialNetork[] = [];
    //obtenemos el elemento completo que estamos seleccionando
    const selectedSocialNetwork = updatedLinks.find(link => link.name === socialNetwork)
    //Si esta habilitada
    if (selectedSocialNetwork?.enabled) {
      //obtenemos el valor de los elementos habilitados y le sumamos uno
      const id = links.filter(link => link.enabled).length + 1
      //aqui validamos si ya axiste en el array de los links de la bd
      if (links.some(link => link.name === socialNetwork)) {
        //asignamos valores a updatedItems
        updatedItems = links.map(link => {
          //si existe la habilitamos y asignamos el ud
          if (link.name === socialNetwork) {
            return {
              ...link,
              enabled: true,
              id
            }
          } else {
            return link
          }
        })
        //si no existe creamos el elemento con el id
      } else {
        const newItem = {...selectedSocialNetwork, id}
        updatedItems = [...links, newItem]
      }
      //si no esta habilitada
    } else {
      //obtenemos el index del elemento
      const indexToUpdate = links.findIndex(link => link.name === socialNetwork);
      //validamos que exista para evitar agregar un elemento que no tiene valores
      if (indexToUpdate !== -1) {
        updatedItems = links.map(link => {
          if (link.name === socialNetwork) {
            //deshabilitamos y asignamos id 0 para que drag no lo tome en cuenta
            return {
              ...link,
              id: 0,
              enabled: false
            }
            //aqui obtenemos el id del elemento que se le puso 0 y restamos uno a los elementos que teniam un id mas alto
          } else if (link.id > links[indexToUpdate].id) {
            return {
              ...link,
              id: link.id - 1
            }
            //si no cumple nada, retornamos el link, que serian por ejemplo los que tienen id mas bajo
          } else {
            return link
          }
        })
      } else {
        updatedItems = links
      }
    }
    queryClient.setQueryData(['user'], (prevData: User) => {
      return {
        ...prevData,
        //pasamos a la query data solo los items activados
        links: JSON.stringify(updatedItems)
      }
    });
  }

  return (
    <div className=" space-y-5">
      <button
        className=" bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded, font-bold cursor-pointer"
        onClick={() => {
          mutate(queryClient.getQueryData(['user'])!);
        }}
      >Guardar cambios</button>
      {devTreeLinks.map((item) => (
        <DevTreeInput
          //En cada iteraccion con map siempre tenemos que asignar un key con el index mejor
          key={`${item.name}`}
          //pasamos el item
          item={item}
          handleUrlChange={handleUrlChange}
          handleEnableLink={handleEnableLink}
        />
      ))}

    </div>
  )
}
