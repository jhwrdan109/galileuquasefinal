"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Dashboardaluno: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const quemSomosRef = useRef<HTMLDivElement>(null);

  const tutorialSteps = [
    {
      title: "Bem-vindo ao Projeto Galileu",
      description: "Vamos te mostrar como entrar na sala e ver simulações anteriores.",
      image:
      "https://media.discordapp.net/attachments/1362902994634408210/1370850653957787709/Sharing_my_pixel_art1.gif?ex=6820ffa9&is=681fae29&hm=379863f3c50bb2a9deb4e9d363c3f4a7d97523309ef98d9b4dc3550b68da1b0b&=&width=640&height=640"
    },
    {
      title: "Entrando na sala virtual",
      description: "Clique no botão 'Simulações' no menu superior, após isso, clique em 'Entrar na simulação', espere o código ser gerado pelo professor e colie-o nessa página.",
      image: "https://files.fm/u/bastyb2tw9?k=5a340abe",
    },
    {
      title: "Visualizando Simulações Anteriores",
      description: "Na página de simulações, você pode acessar simulações anteriores clicando no botão de mesmo nome, nessa página você pode ver dados de análises que já ocorreram e até compará-las.",
      image: "/images/tutorial-step3.png",
    },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || user.email);
      setLoading(false);
      setShowTutorial(true);
    } else {
      router.push("/login");
    }
  }, [router]);

  const scrollToQuemSomos = () => {
    quemSomosRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeTutorial = () => {
    setShowTutorial(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white text-xl">
        Carregando...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/FundoCanva.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-gradient-to-br from-purple-800 to-purple-900 border border-purple-300 rounded-lg shadow-2xl w-full max-w-3xl p-8 text-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Tutorial</h2>
              <button
                onClick={closeTutorial}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Pular Tutorial
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">{tutorialSteps[currentStep].title}</h3>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2 mb-4 md:mb-0 relative h-64 bg-black bg-opacity-20 rounded-lg p-2 flex items-center justify-center">
                  <Image
                    src={tutorialSteps[currentStep].image}
                    alt={`Tutorial passo ${currentStep + 1}`}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                  />
                </div>
                <div className="md:w-1/2">
                  <p className="text-lg mb-4">{tutorialSteps[currentStep].description}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className={`bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md transition duration-300 ${currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={currentStep === 0}
              >
                Anterior
              </button>
              <div className="flex space-x-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${currentStep === index ? "bg-white" : "bg-purple-300"}`}
                  />
                ))}
              </div>
              <button
                onClick={nextStep}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md transition duration-300"
              >
                {currentStep < tutorialSteps.length - 1 ? "Próximo" : "Concluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16">
          <Image
            onClick={() => router.push("/")}
            src="/images/markim-Photoroom.png"
            alt="Logo Projeto Galileu"
            width={150}
            height={50}
            className="cursor-pointer hover:scale-105 transition-transform duration-300"
          />

          <nav>
            <ul className="flex flex-wrap justify-center gap-6">
              <li>
                <button
                  className="text-white px-6 py-3 rounded-md border border-purple-400 bg-transparent hover:text-purple-300 hover:border-purple-300 transition duration-300 shadow-md hover:shadow-lg"
                  onClick={() => router.push("")}
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={scrollToQuemSomos}
                  className="text-white px-6 py-3 rounded-md border border-purple-400 bg-transparent hover:text-purple-300 hover:border-purple-300 transition duration-300 shadow-md hover:shadow-lg"
                >
                  Quem Somos
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/simulacoesaluno")}
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

        <main className="flex flex-col items-start justify-center py-16">
          <h1 className="text-6xl md:text-4xl font-bold text-white mb-6 max-w-3xl text-left">
            Uma aprendizagem sobre Plano Inclinado de uma forma interativa
          </h1>

          <p className="text-xl text-purple-200 mb-12 max-w-3xl text-left">
            O Projeto Galileu busca melhorar a compreensão da matéria de Plano Inclinado da disciplina de Física, tornando-a mais eficaz.
          </p>
        </main>
      </div>

      <div
        ref={quemSomosRef}
        className="bg-white py-12 px-6 mt-24 border-t-4 border-purple-950 shadow-lg"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-purple-700 mb-4">Quem Somos</h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            Nós somos o Projeto Galileu, buscando melhorar a interação entre professor e aluno. Através da interação entre software e hardware, queremos tornar o estudo de Física mais acessível e interativo, focando no tema de Plano Inclinado para ajudar estudantes a melhorarem seu desempenho em vestibulares. Somos alunos da Fundação Matias Machline, cursando o terceiro ano do ensino médio técnico.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboardaluno;
