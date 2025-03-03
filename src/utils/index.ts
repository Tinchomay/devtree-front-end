
//Esta funcion recibe varios valores en forma de array que puede ser un objeto
//El spread operator lo que hace es agruparlos en un array, asi no hay necesidad de mandarlos como un objeto
export function classNames(...clases : string[]) {
    //Al final revisa que no sean nulos los valores y los junta
    return clases.filter(Boolean).join(' ');
}
//Aqui cuando se llama esta funcion le estamos pasando dos parametros valores, uno segun el item.enabled y el que se le va a sumar a ambos segun el caso
// className={classNames(
//     item.enabled ? 'bg-blue-500' : 'bg-gray-200',
//     'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
//   )}