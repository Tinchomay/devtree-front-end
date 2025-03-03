import Header from "../components/Header";
import SearchForm from "./SearchForm";

export default function HomeView() {
  return (
    <>
        <Header/>

        <main className=" bg-gray-100 py-10 min-h-screen lg:bg-[url('/bg.svg')] bg-right-top lg:bg-[length:50%] bg-no-repeat">
          <div className=" max-w-5xl mx-auto mt-10">
            <div className=" lg:w-1/2 px-10 lg:p-0 space-y-6">
              <h1 className="text-6xl font-black">
                Todas tus <span className="text-cyan-400">Redes Sociales </span> en un enlace
              </h1>
              <p className="text-slate-800 text-xl">
                Únete a mas de 200 mil developers compartiendo sus redes sociales, comparte tu perfil de TikTok, Facebook, Instagram, YouTube, Github y más
              </p>
              <SearchForm/>
            </div>
          </div>
        </main>
    </>
  )
}
