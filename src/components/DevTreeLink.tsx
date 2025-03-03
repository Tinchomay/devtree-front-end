import { useSortable } from '@dnd-kit/sortable';
import { SocialNetork } from '../interfaces/index';
import { CSS } from '@dnd-kit/utilities';

type DevTreeLinkProps ={
    link: SocialNetork
}

export default function DevTreeLink({link} : DevTreeLinkProps) {
  //estas variables las extraemos del useSortable
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
    //el useSortable necesita que les pasemos los id de los elementos
    id: link.id
  });

  //Este objetos de estilos seran los que les pongamos a los componentes
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }
  return (
    <li 
      //Este ref le da ubicacion del elemento a la libreria
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    className=' bg-white px-5 py-2 flex items-center gap-5 rounded-lg cursor-pointer'>
        <div
            className="w-12 h-12 bg-cover"
            style={{ backgroundImage: `url('/social/icon_${link.name}.svg')` }}
        >
        </div>
        <p className=' capitalize'> Visita mi: <span className='font-bold'>{link.name}</span></p>
    </li>
  )
}
