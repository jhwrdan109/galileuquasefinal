"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Dashboardprof: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialType, setTutorialType] = useState("fisica"); // "fisica" ou "sala"

  const quemSomosRef = useRef<HTMLDivElement>(null); // Referência para seção "Quem Somos"
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(`Prof. ${user.name || user.displayName || user.email}`);
      setLoading(false);
      
      // Sempre mostrar o tutorial
      setShowTutorial(true);
    } else {
      router.push("/login");
    }
  }, [router]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white text-xl">Carregando...</div>;
  }

  const scrollToQuemSomos = () => {
    quemSomosRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const closeTutorial = () => {
    setShowTutorial(false);
  };

  const switchToSalaTutorial = () => {
    setTutorialType("sala");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/kokushibo.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 ">
          <div className=" border border-purple-300 bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg shadow-2xl w-full max-w-5xl p-8 text-white mx-4 overflow-y-auto max-h-screen">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                {tutorialType === "fisica" ? "Tutorial - Simulação Física" : "Tutorial - Como Criar Sala"}
              </h2>
              <button 
                onClick={closeTutorial} 
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Pular Tutorial
              </button>
            </div>
            
            {tutorialType === "fisica" ? (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold mb-4">Instruções para a Simulação</h3>
                
                <div className="bg-purple-700 bg-opacity-40 p-6 rounded-lg mb-6">
                  <h4 className="text-xl font-semibold mb-3">1. Ajuste do Ângulo</h4>
                  <p className="text-lg mb-4">
                    Após criar a questão, o professor deve ajustar o ângulo da superfície inclinada utilizando o parafuso manípulo.
                    O valor do ângulo será exibido no indicador de angulação, permitindo a conferência da medida.
                  </p>
                </div>
                
                <div className="bg-purple-700 bg-opacity-40 p-6 rounded-lg mb-6">
                  <h4 className="text-xl font-semibold mb-3">2. Posicionamento da Barreira Móvel</h4>
                  <p className="text-lg mb-4">
                    Em seguida, o professor deve mover a barreira móvel para a distância especificada na questão.
                    Para isso, deve afrouxar o parafuso que fixa a barreira, movê-la para a posição desejada e, em seguida, 
                    apertar o parafuso para fixá-la no lugar. A indicação no lado direito da tela mostrará a distância 
                    medida desde a posição inicial do cubo.
                  </p>
                </div>
                
                <div className="bg-purple-700 bg-opacity-40 p-6 rounded-lg mb-6">
                  <h4 className="text-xl font-semibold mb-3">3. Início da Simulação</h4>
                  <p className="text-lg mb-4">
                    Após os ajustes, o professor deve iniciar a simulação clicando no botão "Iniciar Simulação".
                    O sistema realizará os cálculos necessários enquanto o cubo é liberado para o movimento.
                  </p>
                </div>
                
                <div className="bg-purple-700 bg-opacity-40 p-6 rounded-lg mb-6">
                  <h4 className="text-xl font-semibold mb-3">4. Encerramento da Simulação</h4>
                  <p className="text-lg mb-4">
                    Quando o cubo atingir o final do deslocamento, o professor deve clicar no botão "Terminar Simulação" 
                    para encerrar o teste e registrar os dados de análise.
                  </p>
                </div>
                
                <div className="mt-8 mb-8">
                  <h4 className="text-xl font-semibold mb-4">Vídeo Demonstrativo</h4>
                  <div className="bg-black bg-opacity-50 rounded-lg p-4 flex items-center justify-center h-72">
                    {/* Aqui você pode adicionar seu vídeo depois */}
                    <div className="text-center">
                      <p className="text-lg mb-2">Vídeo demonstrativo será exibido aqui</p>
                      <p className="text-sm text-gray-300">
                        (Substitua este placeholder pelo seu vídeo de demonstração)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-8">
                  <button
                    onClick={switchToSalaTutorial}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-md transition duration-300 text-lg"
                  >
                    Ver tutorial de como criar sala
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold mb-4">Como Criar uma Sala de Aula</h3>
                
                <div className="bg-purple-700 bg-opacity-40 p-6 rounded-lg mb-6">
                  <h4 className="text-xl font-semibold mb-3">1. Criação de Questões</h4>
                  <p className="text-lg mb-4">
                    Comece criando questões para sua sala de aula. Você pode criar tanto questões sobre o tema de Plano Inclinado 
                    quanto questões de outros assuntos relacionados à Física. O sistema é flexível para acomodar diversos tipos de conteúdo.
                  </p>
                </div>
                
                <div className="bg-purple-700 bg-opacity-40 p-6 rounded-lg mb-6">
                  <h4 className="text-xl font-semibold mb-3">2. Adição de Questões à Sala</h4>
                  <p className="text-lg mb-4">
                    Após criar as questões, adicione-as à sala de aula. Você pode selecionar múltiplas questões para compor 
                    uma única sala, organizando o conteúdo de acordo com seus objetivos pedagógicos.
                  </p>
                </div>
                
                <div className="bg-purple-700 bg-opacity-40 p-6 rounded-lg mb-6">
                  <h4 className="text-xl font-semibold mb-3">3. Geração do Código da Sala</h4>
                  <p className="text-lg mb-4">
                    Ao finalizar a configuração da sala, o sistema gerará automaticamente um código único. Este código deve ser 
                    compartilhado com seus alunos para que eles possam acessar a sala e participar das atividades.
                  </p>
                </div>
                
                <div className="mt-8 mb-8">
                  <h4 className="text-xl font-semibold mb-4">Imagem Demonstrativa</h4>
                  <div className="bg-black bg-opacity-50 rounded-lg p-4 flex items-center justify-center h-64">
                    {/* Placeholder para a imagem */}
                    <div className="text-center">
                      <p className="text-lg mb-2">Imagem demonstrativa será exibida aqui</p>
                      <p className="text-sm text-gray-300">
                        (Substitua este placeholder pela imagem de demonstração)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 mb-8">
                  <h4 className="text-xl font-semibold mb-4">Vídeo Tutorial</h4>
                  <div className="bg-black bg-opacity-50 rounded-lg p-4 flex items-center justify-center h-72">
                    {/* Placeholder para o vídeo */}
                    <div className="text-center">
                      <p className="text-lg mb-2">Vídeo tutorial será exibido aqui</p>
                      <p className="text-sm text-gray-300">
                        (Substitua este placeholder pelo vídeo de tutorial)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setTutorialType("fisica")}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-md transition duration-300 text-lg"
                  >
                    Voltar ao tutorial da simulação física
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="mb-6 md:mb-0">
            <Image
              onClick={() => router.push("")}
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
                  onClick={() => router.push("")}
                  className="text-white hover:text-purple-300 px-6 py-3 rounded-md border border-purple-400 hover:border-purple-300 transition duration-300"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  onClick={scrollToQuemSomos}
                  className="text-white hover:text-purple-300 px-6 py-3 rounded-md transition duration-300"
                >
                  Quem Somos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push("/simuproftestesupabase")}
                  className="text-white hover:text-purple-300 px-6 py-3 rounded-md transition duration-300"
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

        {/* Conteúdo principal */}
        <main className="flex flex-col items-start justify-center py-16">
          <h1 className="text-6xl md:text-4xl font-bold text-white mb-6 max-w-3xl text-left">
            Uma aprendizagem sobre Plano Inclinado de uma forma interativa
          </h1>

          <p className="text-xl text-purple-200 mb-12 max-w-3xl text-left">
            O Projeto Galileu busca melhorar a compreensão da matéria de Plano Inclinado da disciplina de Física, tornando-a mais eficaz.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setShowTutorial(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-md font-medium transition duration-300"
            >
              Ver Tutorial
            </button>
          </div>
        </main>
      </div>

      {/* Seção Quem Somos com borda preta */}
      <div
        ref={quemSomosRef}
        className="bg-white py-12  px-6 mt-24 border-t-4 border-purple-950 shadow-lg"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-purple-700 mb-4">Quem Somos</h2>
          <p className="text-base text-gray-800 leading-relaxed">
            Nós somos o Projeto Galileu, buscando melhorar a interação entre professor e aluno.
            Através da interação entre software e hardware, queremos tornar o estudo de Física
            mais acessível e interativo, focando no tema de Plano Inclinado para ajudar estudantes
            a melhorarem seu desempenho em vestibulares. Somos alunos da Fundação Matias Machline,
            cursando o terceiro ano do ensino médio técnico.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboardprof;