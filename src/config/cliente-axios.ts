import axios from "axios";

//creamos la instancia de axios
const api = axios.create({
    //definimos la url
    baseURL: import.meta.env.VITE_API_URL,
});

//los interceptors son funciones que se ejecutan siempre en cada request, aqui añadimos el token a todas las peticiones si existe
//utilizamos config que es la configuracion de las request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    //agregamos el token a la cabecera
    if(token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
})

export default api;