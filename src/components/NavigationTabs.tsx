import { BookmarkSquareIcon, UserIcon } from '@heroicons/react/20/solid'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const tabs = [
    { name: 'Links', href: '/admin', icon: BookmarkSquareIcon },
    { name: 'Mi Perfil', href: '/admin/profile', icon: UserIcon },
]

//nos aseguramos que las clases sean validas y las une
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function NavigationTabs() {

    //Este es un hook de react para obtener la ruta actual
    const location = useLocation();
    //Este hook sirve para navegar
    const navigate = useNavigate();

    //definimos el tipo de elemento en base al select
    const handleChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
        //navegamos a la ubicacion
        navigate(e.target.value);
    };

    return (
        <div className='mb-5'>
            {/* parte en celular */}
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                    Selecciona una opción
                </label>
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white py-2"
                    //Aqui se manda el evento
                    onChange={ handleChange }
                >
                    {/* Iteramos sobre las tabs para mostrar las opcionees */}
                    {tabs.map((tab) => (
                        <option 
                            value={tab.href}
                            key={tab.name}
                        >{tab.name}</option>
                    ))}
                </select>
            </div>

            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            //Esto crea los <a></a>
                            <Link
                                key={tab.name}
                                to={tab.href}
                                className={classNames(
                                    // Aqui evaluamos si es la ubicacion actual y ponemos color segun sea el caso
                                    location.pathname === tab.href
                                        ? 'border-blue-500 text-blue-500'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                    'group inline-flex items-center border-b-2 py-4 px-1 text-xl'
                                )}
                            >
                                {/* Esto es un componente que se reemplaza con el map del tab de heroicon*/}
                                <tab.icon
                                    className={classNames(
                                        //se pone de color segun si estamos en la ubicacion
                                        location.pathname === tab.href ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500',
                                        '-ml-0.5 mr-2 h-5 w-5'
                                    )}
                                    aria-hidden="true"
                                />
                                <span>{tab.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}