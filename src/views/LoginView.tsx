
import { useForm } from "react-hook-form"
import { Link, Navigate, useNavigate } from "react-router-dom"
import ErrorMessage from "../components/ErrorMessage";
import { LoginForm } from "../interfaces";
import api from "../config/cliente-axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export default function LoginView() {

  const token = localStorage.getItem('AUTH_TOKEN');
  if (token) {
    return <Navigate to="/admin" />;
  }

  const navigate = useNavigate();
  
  const initialValues = {
    email: "",
    password: "",
  }

  const {register, handleSubmit, formState : {errors}} = useForm<LoginForm>({
    defaultValues: initialValues,
  });

  const handleLogin = async (formData : LoginForm) => {
    try {
      const {data} = await api.post('/auth/login', formData);
      //utilizamoslocaStorage y set item para guardarlo en localStorage
      localStorage.setItem('AUTH_TOKEN', data);
      navigate('/admin');
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK' && !error.response) {
          toast.error('Error de CORS: La solicitud fue bloqueada por el navegador debido a políticas de CORS.');
        } else if (error.response) {
          toast.error(error.response.data);
        }
      } else {
        console.error(error);
      }
    }
  }
  
  return (
    //retornamos un fragment para poder retornar multiples elementos
    <>
      <h1 className=" text-4xl text-white font-bold">Iniciar Sesión</h1>
      <form 
        onSubmit={handleSubmit(handleLogin)}
        className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
        noValidate
    >
        <div className="grid grid-cols-1 space-y-3">
            <label htmlFor="email" className="text-2xl text-slate-500">E-mail</label>
            <input
                id="email"
                type="email"
                placeholder="Email de Registro"
                className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                {...register("email", {
                    required: "El Email es obligatorio",
                    pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "E-mail no válido",
                    },
                })}
            />
            {errors.email && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
        </div>
        <div className="grid grid-cols-1 space-y-3">
            <label htmlFor="password" className="text-2xl text-slate-500">Password</label>
            <input
                id="password"
                type="password"
                placeholder="Password de Registro"
                className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                {...register("password", {
                    required: "El Password es obligatorio",
                })}
            />
            {errors.password && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
        </div>

        <input
            type="submit"
            className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
            value='Iniciar Sesión'
        />
    </form>
      
      <nav className="mt-10">
         <Link 
          to="/auth/register"
          className=" text-center text-white text-lg block">
          ¿No tienes una cuenta? Crea una aqui.
         </Link>
      </nav>
    </>
  )
}
