//El Outlet nos permite añadir elementos dentro del layout, que en este caso seran las rutas hijas de esta Route
import { Outlet } from "react-router-dom"
import { Toaster } from 'sonner';
import Logo from "../components/Logo";

export default function AuthLayout() {
  return (
    <>
        <div className=" bg-slate-800 min-h-screen">
            <div className=" max-w-xl mx-auto pt-10 px-5">
                <Logo/>
                <div className=" py-10">
                  {/* Indicamos en que lugar ira el contenido dinamico de las paginas con el Outlet */}
                  <Outlet />
                </div>
            </div>
        </div>
        <Toaster richColors position="top-right" expand={true} />
    </>
  )
}
