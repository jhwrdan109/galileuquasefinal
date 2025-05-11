"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SimulacoesProf: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(`Prof. ${user.name || user.email}`);
      setLoading(false);
    } else {
      router.push("/login");
    }
  }, [router]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white text-xl">Carregando...</div>;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/images/FundoCanva.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Imagem fixa na esquerda */}
      <div className="hidden md:block  fixed left-0 bottom-0 z-10">
        <Image
          src="/images/galileufrente.png"
          alt="Galileu"
          width={300} // Ajuste o tamanho conforme necessário
          height={300}
          className="object-contain"
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="mb-6 md:mb-0">
            <Image
              src="/images/markim-Photoroom.png"
              alt="Logo Projeto Galileu"
              width={150}
              height={50}
              className="hover:scale-105 transition-transform duration-300"
            />
          </div>

          <nav>
            <ul className="flex flex-wrap justify-center gap-6">
              <li>
                <button
                  onClick={() => router.push("/dashboardprof")}
                  className="text-white hover:text-purple-300 px-6 py-3 rounded-md transition duration-300"
                >
                  Início
                </button>
              </li>
            
              <li>
                <button
                  onClick={() => router.push("")}
                  className="text-white px-6 py-3 rounded-md font-bold border border-purple-400"
                >
                  Simulações
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/editarperfilprof")}
                  className="bg-purple-600 text-white px-8 py-3 rounded-md font-bold transition duration-300"
                >
                  {userName}
                </button>
              </li>
            </ul>
          </nav>
        </header>

        <main className="flex flex-col items-center justify-center text-center py-16">
          <h1 className="text-6xl md:text-4xl font-bold text-white mb-8">Simulações</h1>
          <div className="flex flex-col gap-6">
            <button
              onClick={() => router.push("/criarsalaproftestesupabase")}
              className="bg-purple-900 text-white px-8 py-3 rounded-md font-bold flex items-center gap-2 text-lg shadow-md hover:bg-purple-950 transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M480-144 216-276v-240L48-600l432-216 432 216v312h-72v-276l-96 48v240L480-144Zm0-321 271-135-271-135-271 135 271 135Zm0 240 192-96v-159l-192 96-192-96v159l192 96Zm0-240Zm0 81Zm0 0Z"/></svg>Criar Nova Sala de Aula
            </button>
          <button
  onClick={() => router.push("/escolhacriadasoucriarprof")}
  className="bg-purple-900 text-white px-6 py-3 rounded-md font-bold flex items-center justify-center gap-2 text-lg shadow-md hover:bg-purple-950 transition duration-300"
>
 <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M144-264v-72h672v72H144Zm0-180v-72h672v72H144Zm0-180v-72h672v72H144Z"/></svg> Questões
</button>

          </div>
        </main>
      </div>
    </div>
  );
};

export default SimulacoesProf;
