import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import LinkTreeView from './views/LinkTreeView';
import ProfileView from './views/ProfileView';
import HandleView from './views/HandleView';
import NotFoundView from './views/NotFoundView';
import HomeView from './views/HomeView';


//En el router vamos a definir las rutas
export default function Router(){
    return (
        //Requiero el BrowserRouter
        <BrowserRouter>
            {/* Aqui estaran todas las rutas */}
            <Routes>
                {/* Con Route definimos las rutas */}
                <Route element={<AuthLayout/>}>
                    {/* Aqui van las rutas */}
                    <Route path="/auth/login" element={<LoginView />} />
                    <Route path="/auth/register" element={<RegisterView />} />
                </Route>
                {/* podemos definir la ruta principal en el Route y con un index utilizar esa ruta */}
                <Route path='/admin' element={<AppLayout/>}>
                    <Route index={true} element={<LinkTreeView/>} />
                    {/* para anidar rutas en base al Route padre solo ponemos la ruta sin el diagonal*/}
                    <Route path='profile' element={<ProfileView/>} />
                </Route>
                {/* Utilizamos : para que lo que este despues lo podamos capturar */}
                <Route path='/:handle' element={<AuthLayout/>}>
                {/* No olvidar el index para que sea la vista del path de arriba */}
                    <Route element={<HandleView/>} index={true} />
                </Route>
                {/* Definimos ruta con un solo elemento */}
                <Route path='/' element={<HomeView/>}/>
                
                <Route path='/404' element={<AuthLayout/>}>
                    <Route element={<NotFoundView/>} index={true}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}