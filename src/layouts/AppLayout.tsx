import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/DevTreeAPI";
import DevTree from "../components/DevTree";
import { HashLoader } from 'react-spinners';

export default function AppLayout() {
    
    //utilizamos el useQuery podemos obtener multiples datos la peticion
    const {data, isLoading, isError} = useQuery({
        //como primer argumento necesita la funcion que realiza la petición
        //aqui la funcion retornara un user porque la definimos en la funcion
        queryFn: getUser,
        //El segundo es como va a guardar los datos
        queryKey: ["user"],
        //si no se logra obtener respuesta cuantas veces que intente
        retry: 1,
        //para que no haga consultas cada vez que cambiemos de pagina
        refetchOnWindowFocus: false
    });

    if(isLoading) return (
        <div className="flex justify-center items-center min-h-[80vh]">
          <HashLoader color={"#00000"} size={200} />
        </div>
      );
    if(isError) {
      const token = localStorage.getItem('AUTH_TOKEN');
      if(token) {
        localStorage.removeItem('AUTH_TOKEN')
      }
      return <Navigate to={'/auth/login'}/>
    } 
    
    //Si tenemos datos renderizamos el componente
    if(data) return <DevTree data={data} />
 
}