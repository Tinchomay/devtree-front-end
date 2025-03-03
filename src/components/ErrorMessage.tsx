//asignamos que el tipo de dato sera React.ReactNode porque es un elemento que se renderiza en react y puede ser undefined tambien
export default function ErrorMessage({children} : {children: React.ReactNode}) {
  return (
    <p className="bg-red-50 text-red-600 p-3 uppercase text-sm font-bold text-center">{children}</p>
  )
}
