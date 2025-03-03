import { Navigate, useParams } from "react-router-dom"
import { useQuery } from '@tanstack/react-query';
import { getUserByHandle } from "../api/DevTreeAPI";
import { HashLoader } from 'react-spinners';
import HandleData from "../components/HandleData";


export default function HandleView() {
  //extraemos el handlde de la pagina
  const params = useParams();
  const handle = params.handle!;

  //consultamos con useQuery
  const {data, error, isLoading} = useQuery({
    //para cachear multiples usuarios
    queryKey: ['handle', handle],
    queryFn: () => getUserByHandle(handle),
    retry: 1
  });

  if(isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <HashLoader color={"#ffffff"} size={200} />
      </div>
    );
  }
  if(error) return <Navigate to={'/404'}/>;

  if(data) return <HandleData data={data}/>
}

