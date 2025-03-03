import { SocialNetork, userHandle } from '../interfaces/index';

interface HandleDataProps {
    data : userHandle
}

export default function HandleData({data} : HandleDataProps) {
    const links : SocialNetork[] = JSON.parse(data.links).filter( (link : SocialNetork) => link.enabled);
  return (
    <div className=' space-y-6 text-white'>
        <p className='text-2xl md:text-5xl text-center font-black'>{data.handle}</p>
        {(data.image) ? <img src={data.image} className='max-w-[300px] mx-auto'/> : <img src='/logo.svg' className='max-w-[250px] mx-auto'/>}
        <p className='text-lg text-center font-bold'>{data.description}</p>
        <div className='mt-10 flex flex-col gap-6 md:w-2/3 mx-auto'>
            {links.length 
                ? links.map(link => (
                    <a
                        className='bg-white px-5 py-2 flex items-center gap-5 rounded W'
                        href={`https://${link.name}.com/${link.url}`} 
                        key={link.name}
                        target='_blank'
                        rel='noreferrer noopener'
                    >
                        <img className='w-12' src={`/social/icon_${link.name}.svg`} alt="imagen red social" />
                        <p className='text-black capitalize font-bold text-lg'>Visita mi: {link.name}</p>
                    </a>
                ))
                : <p className=' text-center '>Este perfil aun no tiene enlances</p>}
        </div>
    </div>
  )
}
