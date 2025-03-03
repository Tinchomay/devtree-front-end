import { isAxiosError } from "axios";
import api from "../config/cliente-axios";
import { User, userHandle } from "../interfaces";

export async function getUser() {
    try {
        const {data} = await api.get<User>('/user');
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            //Lanzamos el error para que pueda ser manejado por el error de useQuery
            throw new Error(error.response.data.error);
        }
    }
}

export async function updateUser(formData : User) {
    try {
        const {data} = await api.patch<string>('/user', formData);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function uploadImage(file: File) {
    //utilizaremos el formData para mandar los archivos
    let formData = new FormData();
    //agregamos la imagen al formData
    formData.append('image', file);

    try {
        const {data : {image}} : {data : {image: string}} = await api.post('/user/image', formData);
        return image;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function getUserByHandle( handle : string){
    try {
        const {data} = await api.get<userHandle>(`/${handle}`)
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function searchByHandle( handle : string){
    try {
        const {data} = await api.post<string>(`/search`, {handle})
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}