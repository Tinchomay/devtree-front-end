import { useForm } from "react-hook-form"
import ErrorMessage from "../components/ErrorMessage"
import slugify from 'react-slugify';
import { useMutation } from "@tanstack/react-query";
import { searchByHandle } from "../api/DevTreeAPI";
import { HashLoader } from "react-spinners";
import { Link } from "react-router-dom";

export default function SearchForm() {
    const initialValues = { handle: '' }
    const {register, watch, handleSubmit, formState : {errors}} = useForm({
        defaultValues: initialValues,
    })

    //Esta vez no vamos a hacer nada en funciones, si no vamos a renderizar el resultado
    const mutation = useMutation({
        mutationFn: searchByHandle,
    });

    //vamos a obtener el valor del handle individualment
    const handle = watch('handle');
    const handleSearch = () => {
        let slug = slugify(handle, { delimiter: '_' });
        mutation.mutate(slug);
    }

  return (
    <form
        onSubmit={handleSubmit(handleSearch)}
        className="space-y-5">
        <div className="relative flex items-center  bg-white  px-2">
        <label
            htmlFor="handle"
        >devtree.com/</label>
        <input
            type="text"
            id="handle"
            className="border-none bg-transparent p-2 focus:ring-0 flex-1"
            placeholder="elonmusk, zuck, jeffbezos"
            {...register("handle", {
                required: "Un Nombre de Usuario es obligatorio",
            })}
        />
        </div>
        {errors.handle && (
        <ErrorMessage>{errors.handle.message}</ErrorMessage>
        )}
        <div className="mt-2">
            {mutation.isPending && <HashLoader color={"#000000"} />}
            {mutation.error && <p className="text-red-600 font-black">{mutation.error.message}</p>}
            {mutation.data && <p className="text-cyan-500 font-black">{mutation.data}  <Link className="text-black text-lg hover:text-indigo-400" to={'/auth/register'} state={{ handle: slugify(handle, { delimiter: '_' }) }}> Da click aqui para crear una cuenta</Link></p>}
        </div>
        <input
        type="submit"
        className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer mt-4"
        value='Obtener mi DevTree'
        />
    </form>
  )
}
