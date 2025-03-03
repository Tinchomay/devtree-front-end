import { useForm } from 'react-hook-form';
import ErrorMessage from '../components/ErrorMessage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileForm, User } from '../interfaces';
import { updateUser, uploadImage } from '../api/DevTreeAPI';
import { toast } from 'sonner';
import { useRef } from 'react';

export default function ProfileView() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    //vamos a utilizar los datos cacheados de la consulta previa que se realiza en AppLayout para obtener el user
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData<User>(['user'])!;

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({ defaultValues: {
        handle: data.handle,
        description: data.description
    } });

    //utilizamos el hook useMutation
    const updateProfileMutation = useMutation({
        mutationFn: updateUser,
        //si hay un error se maneja aqui directamente
        onError: (error) => {
            toast.error(error.message)
        },
        //Si sale bien se maneja aqui
        onSuccess: (data) => {
            toast.success(data);
            //con esto eliminamos la key user del client y obligamos a hacer el fetch de nuevo
            queryClient.invalidateQueries({
                queryKey: ['user']
            });
        },    
    });

    //creamos la funcion de la mutacion con la funcion de la api del front que se pasa el file automaticamente
    const updateImageMutation = useMutation({
        mutationFn: uploadImage,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (image) => {
            //Esta vez no vamos a invalidar el query si no vamos a actualizar directamente la propiedad
            queryClient.setQueryData(['user'], (prevData : User) => {
                //vamos a cambiar el valor de la image, por esto retornamos con una copia de los datos y reemplazamos la propiedad con lo que nos manda el back
                return {
                    ...prevData,
                    image
                }
            });
            toast.success('Imagen cambiada correctamente');
        },    
    });

    const handleChangeImage = (e : React.ChangeEvent<HTMLInputElement>) => {
        //los archivos estaran en el evento target como files, son un array asi que con [] podemos acceder a ellos
        if (e.target.files) {
            //asignamos el archivo
            const file = e.target.files[0];
            //utilizamos la mutacion con el metodo mutate, enviamos el archivo y lo demas es para dejar vacio el campo
            updateImageMutation.mutate(file, {
                onSettled: () => {
                    if (fileInputRef.current) {
                        fileInputRef.current.value = ""; 
                    }
                }
            });
        }
    }

    const handleUserProfileForm = (formData : ProfileForm) => {
        const user : User = queryClient.getQueryData(['user'])!;
        user.description = formData.description;
        user.handle = formData.handle
        updateProfileMutation.mutate(user);
        queryClient.invalidateQueries({
            queryKey: ['user']
        });
    }

    return (
        <form
            className="bg-white p-10 rounded-lg space-y-5"
            onSubmit={handleSubmit(handleUserProfileForm)}
        >
            <legend className="text-2xl text-slate-800 text-center">Editar Información</legend>
            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Handle:</label>
                <input
                    id="handle"
                    type="text"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="Handle o Nombre de Usuario"
                    {...register("handle", {
                        required: "El nombre de usuario obligatorio"
                    })}
                />
                {errors.handle && (
                    <ErrorMessage>{errors.handle.message}</ErrorMessage>
                )}
            </div>
            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="description"
                >Descripción:</label>
                <textarea
                    id="description"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="Tu Descripción"
                    {...register("description", {
                        required: "La descripción es obligatoria",
                        minLength: {
                            value: 3,
                            message: "La descripción debe tener al menos 3 caracteres"
                        }
                    })}
                />
                {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
            </div>
            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="image"
                >Imagen:</label>
                <input
                    id="image"
                    type="file"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleChangeImage}
                />
            </div>
            <input
                type="submit"
                className={(updateImageMutation.isPending || updateProfileMutation.isPending) ? "bg-gray-400 p-2 text-lg w-full uppercase text-white rounded-lg font-bold cursor-pointer" : "bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"}
                value='Guardar Cambios'
                disabled={updateImageMutation.isPending || updateProfileMutation.isPending}
            />
        </form>
    )
}