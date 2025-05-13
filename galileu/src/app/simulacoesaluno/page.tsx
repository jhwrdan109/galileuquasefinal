"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SimulacoesAluno: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || user.email);
      setLoading(false);
    } else {
      router.push("/login");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white text-xl">
        Carregando...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/images/kokushibo.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Imagem fixa na esquerda */}
      <div className="hidden md:block fixed left-0 bottom-0 z-10">
        <Image
          src="/images/galileuimagem.png"
          alt="Galileu"
          width={300}
          height={300}
          className="object-contain"
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="mb-6 md:mb-0">
            <Image
              onClick={() => router.push("/dashboardaluno")}
              src="/images/markim-Photoroom.png"
              alt="Logo Projeto Galileu"
              width={150}
              height={50}
              className="hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </div>

          <nav>
            <ul className="flex flex-wrap justify-center gap-6">
              <li>
                <button
                  onClick={() => router.push("/dashboardaluno")}
                  className="text-white px-6 py-3 rounded-md border border-purple-400 bg-transparent hover:text-purple-300 hover:border-purple-300 transition duration-300 shadow-md hover:shadow-lg"
                >
                  Início
                </button>
              </li>
             
              <li>
                <button
                  className="text-white px-6 py-3 rounded-md border border-purple-400 bg-transparent hover:text-purple-300 hover:border-purple-300 transition duration-300 shadow-md hover:shadow-lg"
                >
                  Simulações
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/editarperfilaluno")}
                  className="bg-purple-600 text-white px-8 py-3 rounded-md font-bold transition duration-300 shadow-lg hover:bg-purple-500 hover:shadow-xl"
                >
                  {userName}
                </button>
              </li>
            </ul>
          </nav>
        </header>

        <main className="flex flex-col items-center justify-center text-center py-16">
          <h1 className="text-6xl md:text-4xl font-bold text-white mb-8">
            Simulações
          </h1>
          <div className="flex flex-col gap-6">
            <button
              onClick={() => router.push("/codigoaluno")}
              className="bg-purple-900 text-white px-8 py-3 rounded-md font-bold flex items-center gap-2 text-lg shadow-md hover:bg-purple-950 transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M336-216v-528l408 264-408 264Zm73-265Zm-1 133 204-132-204-132v264Z"/></svg> Entrar na Simulação
            </button>
            <button
              onClick={() => router.push("/analisegeraltesteum")}
              className="bg-purple-900 text-center text-white px-8 py-3 rounded-md font-bold flex items-center gap-2 text-lg shadow-md hover:bg-purple-950 transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M630-444H192v-72h438L429-717l51-51 288 288-288 288-51-51 201-201Z"/></svg>Ir para análise geral
            </button>
            <button
              onClick={() => router.push("/simulacoesanterioresaluno")}
              className="bg-purple-900 text-white px-6 py-3 rounded-md font-bold flex items-center gap-2 text-lg shadow-md hover:bg-purple-950 transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M96-216v-72h384v72H96Zm0-180v-72h192v72H96Zm0-180v-72h192v72H96Zm717 360L660-369q-23 16-50.5 24.5T552-336q-79.68 0-135.84-56.23-56.16-56.22-56.16-136Q360-608 416.23-664q56.22-56 136-56Q632-720 688-663.84q56 56.16 56 135.84 0 30-8.5 57.5T711-420l153 153-51 51ZM552-408q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Z"/></svg>Simulações Anteriores
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SimulacoesAluno;
