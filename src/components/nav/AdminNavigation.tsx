import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


export default function AdminNavigation() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const closeSession = () => {
        //removemos el token
        localStorage.removeItem('AUTH_TOKEN');
        //invalidamos y no se puede hacer el refetch porque ya no hay toquen
        queryClient.invalidateQueries({queryKey: ['user']})
        toast.success('Sesion cerrada correctamente');
        setTimeout(() => {
            navigate('/auth/login');
        }, 1000);
    }
  return (
    <button
        className=" bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer"
        onClick={closeSession}
    >
        Cerrar Sesión
    </button>
  )
}
