import { useForm } from "react-hook-form"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import ErrorMessage from "../components/ErrorMessage";
import { RegisterForm } from '../interfaces/index';
import { isAxiosError } from "axios";
import { toast } from 'sonner';
import api from "../config/cliente-axios";

export default function RegisterView() {

  const token = localStorage.getItem('AUTH_TOKEN');
  if (token) {
    return <Navigate to="/admin" />;
  }

  const navigate = useNavigate();

  const location = useLocation();

  //definimos estos valores para que ts infiera que son strings los datos del form
  const initialValues = {
    name  : '',
    email : '',
    handle: location.state && location.state.handle ? location.state.handle : '',
    password : '',
    password_confirmation: ''
  };

    //estos elementos nos permite obtener las funciones del form state
    //register permite definir los campos, watch para estar revisando live los elementos, handle para obtener los datos y el formState en errors para obtener los errores
    //si le pasamos los tipos de datos al useForm tendremos mas control
  const { register, watch, handleSubmit, formState : {errors} } = useForm<RegisterForm>({
    //Aqui los utilizamos
    defaultValues : initialValues
  });

  //utilizamos el watch junto con el elemento que queremos escuchar 
  const password = watch('password');

  //en automatico se pasan los datos que el usuario mando
  const handleRegister = async (formData : RegisterForm) => {
    try {
      const {data} = await api.post(`/auth/register`, formData);
      toast.success(data.message);
      localStorage.setItem('AUTH_TOKEN', data.token)
      if(data.token){
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      }
    } catch (error) {
      //utilizamos la funcion isAxiosError de axios para comprobar el error
      if(isAxiosError(error) && error.response) {
        toast.error(error.response.data);
      }
    }
  }
  return (
    <>
      <h1 className=" text-4xl text-white font-bold">Crear cuenta</h1>
      <form 
          onSubmit={handleSubmit( handleRegister)}
          className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
      >
          <div className="grid grid-cols-1 space-y-3">
              <label htmlFor="name" className="text-2xl text-slate-500">Nombre</label>
              <input
                  id="name"
                  type="text"
                  placeholder="Tu Nombre"
                  className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                  {...register('name', {
                    required: "El nombre es obligatorio",
                    minLength: {
                      value: 3,
                      message: "El nombre debe tener al menos 3 caracteres"
                    }
                  })}
              />
              {/* con codigo de js validamos si existe errors.name y si existe llamamos al componente pasando el valor que queremos renderizar con llaves */}
              {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>
          <div className="grid grid-cols-1 space-y-3">
              <label htmlFor="email" className="text-2xl text-slate-500">E-mail</label>
              <input
                  id="email"
                  type="email"
                  placeholder="Email de Registro"
                  className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                  {...register('email', {
                    required: "El email es obligatorio",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "El email no es válido"
                    }
                  })}
              />
              {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </div>
          <div className="grid grid-cols-1 space-y-3">
              <label htmlFor="handle" className="text-2xl text-slate-500">Handle</label>
              <input
                  id="handle"
                  type="text"
                  placeholder="Nombre de usuario: sin espacios"
                  className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                  {...register('handle', {
                    required: "El handle es obligatorio",
                  })}
              />
              {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
          </div>
          <div className="grid grid-cols-1 space-y-3">
              <label htmlFor="password" className="text-2xl text-slate-500">Password</label>
              <input
                  id="password"
                  type="password"
                  placeholder="Password de Registro"
                  className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                  // Utilizamos el register con spread operator y asignamos el valor que ira a nuestra api y tambien agregamos las reglas de validacion
                  {...register('password', {
                    required: "El password es obligatorio",
                    minLength: {
                      value: 8,
                      message: "El nombre debe tener al menos 8 caracteres"
                    }
                  })}
              />
              {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </div>
          <div className="grid grid-cols-1 space-y-3">
              <label htmlFor="password_confirmation" className="text-2xl text-slate-500">Repetir Password</label>
              <input
                  id="password_confirmation"
                  type="password"
                  placeholder="Repetir Password"
                  className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                  {...register('password_confirmation', {
                    required: "Repetir el password es obligatorio",
                    minLength: {
                      value: 8,
                      message: "El nombre debe tener al menos 8 caracteres"
                    },
                    //Aqui vamos a utilizar el elemento validate para validar, en el arrow function comparamos y si no es valida retornamos con un or el mensaje. El value es el valor del input que toma en automatico
                    validate: (value) => value === password || 'Los passwords no son iguales' 
                    //esto se veria asi 
                    // validate: (value) => {
                    //   if (value === password) {
                    //       return true;
                    //   } else {
                    //       return 'Los passwords no son iguales';
                    //   }
                    // }
                  
                  })}
              />
              {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>}
          </div>

          <input
              type="submit"
              className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
              value='Crear Cuenta'
          />  
      </form>
      <nav className="mt-10">
         <Link 
          to="/auth/login"
          className=" text-center text-white text-lg block">
          ¿Ya tienes una cuenta? Inicia sesión.
         </Link>
      </nav>
    </>
  )
}
