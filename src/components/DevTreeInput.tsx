import { Switch } from '@headlessui/react';
import { DevTreeLink } from "../interfaces";
import { classNames } from '../utils';

type DevTreeInputProps = {
  item: DevTreeLink;
  handleUrlChange : (e : React.ChangeEvent<HTMLInputElement>) => void;
  handleEnableLink : (socialNetwork: string) => void;
}

export default function DevTreeInput({ item, handleUrlChange, handleEnableLink }: DevTreeInputProps) {
  //Aqui si el value tiene un valor se agrega el prefijo, si no queda vacio para que no se este repitiendo, basicamente aqui el prefijo es visual, no se guarda en la base de datos por el replace
  const displayValue = item.url ? `https://${item.name}/${item.url}` : '';
  return (
    <div className="bg-white shadow-sm flex items-center p-4 gap-3">
      <div
        className="w-12 h-12 bg-cover"
        style={{ backgroundImage: `url('/social/icon_${item.name}.svg')` }}
      >
      </div>
      <input
        type="text"
        className=" flex-1 border border-gray-200 rounded-lg"
        //utilizamos el value para que se agregue el valor segun el state
        value={displayValue}
        //si hay cambios llamamos a una funcion que esta en el padre
        onChange={handleUrlChange}
        //con esto identificamos que valor vamos a cambiar
        name={item.name}
      />
      <Switch
        checked={item.enabled}
        onChange={() => {
          handleEnableLink(item.name);
        }}
        className={classNames(
          item.enabled ? 'bg-blue-500' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        )}
      >
        <span
        //este aria-hidden oculta el elemento de los lectores de pantalla
          aria-hidden="true"
          className={classNames(
            item.enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
    </div>
  )
}
