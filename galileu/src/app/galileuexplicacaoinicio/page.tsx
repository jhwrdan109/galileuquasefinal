"use client"
import React, { useState, useEffect } from "react";

const GalileuExplicacaoModal = () => {
  const [showModal, setShowModal] = useState(true);
  const [explicacaoIndex, setExplicacaoIndex] = useState(0);
  const [textoAtual, setTextoAtual] = useState("");
  const [animacaoCompleta, setAnimacaoCompleta] = useState(false);

  const explicacoes = [
    {
      titulo: "Ângulo (θ)",
      texto: "O ângulo de inclinação da rampa em relação à horizontal. Quanto maior o ângulo, maior a componente da força peso na direção do movimento."
    },
    {
      titulo: "Velocidade (v)",
      texto: "A rapidez com que o objeto se desloca ao longo da rampa, medida em metros por segundo (m/s)."
    },
    {
      titulo: "Força Peso (P)",
      texto: "A força com a qual a gravidade atrai o objeto para baixo. Ela é calculada pela fórmula P = m × g, onde m é a massa do objeto e g é a aceleração da gravidade."
    },
    {
      titulo: "Componente x do Peso (Px)",
      texto: "A componente da força peso paralela à superfície da rampa. Calculada como Px = P × sen(θ), esta é a força que efetivamente impulsiona o objeto para baixo na rampa."
    },
    {
      titulo: "Componente y do Peso (Py)",
      texto: "A componente da força peso perpendicular à superfície da rampa. Calculada como Py = P × cos(θ), esta componente é contrabalançada pela força normal."
    },
    {
      titulo: "Força Normal (N)",
      texto: "A força que a superfície exerce sobre o objeto, sempre perpendicular à superfície de contato. Em um plano inclinado, ela é igual à componente y do peso: N = P × cos(θ)."
    },
    {
      titulo: "Força de Atrito (Fa)",
      texto: "A força que resiste ao movimento do objeto. Sua intensidade é dada por Fa = μ × N, onde μ é o coeficiente de atrito entre as superfícies."
    },
    {
      titulo: "Força Resultante (Fr)",
      texto: "A soma de todas as forças agindo sobre o objeto na direção do movimento. Na rampa, é calculada como Fr = Px - Fa. Esta força resultante é responsável pela aceleração do objeto."
    },
    {
      titulo: "Aceleração (a)",
      texto: "A taxa de variação da velocidade do objeto ao longo do tempo. Pela Segunda Lei de Newton, a = Fr / m, onde Fr é a força resultante e m é a massa do objeto."
    },
    {
      titulo: "Distância (d)",
      texto: "O comprimento do caminho percorrido pelo objeto ao longo da rampa, medido em metros (m)."
    },
    {
      titulo: "Tempo (t)",
      texto: "A duração do movimento do objeto, medida em segundos (s)."
    }
  ];

  useEffect(() => {
    if (!showModal) return;

    const explicacaoAtual = explicacoes[explicacaoIndex];
    if (!explicacaoAtual) {
      return;
    }

    const textoCompleto = `${explicacaoAtual.titulo}: ${explicacaoAtual.texto}`;
    
    let indiceCaractere = 0;
    const velocidadeDigitacao = 25; // milissegundos por caractere
    setAnimacaoCompleta(false);

    const intervalo = setInterval(() => {
      if (indiceCaractere <= textoCompleto.length) {
        setTextoAtual(textoCompleto.substring(0, indiceCaractere));
        indiceCaractere++;
      } else {
        clearInterval(intervalo);
        setAnimacaoCompleta(true);
      }
    }, velocidadeDigitacao);

    return () => clearInterval(intervalo);
  }, [showModal, explicacaoIndex]);

  const handleNext = () => {
    if (explicacaoIndex < explicacoes.length - 1) {
      setExplicacaoIndex(explicacaoIndex + 1);
      setTextoAtual("");
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (explicacaoIndex > 0) {
      setExplicacaoIndex(explicacaoIndex - 1);
      setTextoAtual("");
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-purple-900 border-2 border-purple-300 rounded-xl p-6 max-w-3xl w-full mx-4 relative">
        <div className="flex items-center mb-6">
          <img 
            src="https://media.discordapp.net/attachments/1362902994634408210/1370851417639616602/galileu_boca_3.gif?ex=6821005f&is=681faedf&hm=45b13f2665289ac9e30619849675f5d3a2540f7e8b034f7878ce390f2e3f1ba9&=&width=640&height=640" 
            alt="Galileu explicando" 
            className="w-24 rounded-full mr-4"
          />
          <h2 className="text-2xl font-bold text-white">Explicação dos Valores</h2>
        </div>
        
        <div className="min-h-48 bg-purple-800 bg-opacity-50 rounded-lg p-6 mb-6">
          <p className="text-lg text-white">
            {textoAtual}
            {textoAtual && !animacaoCompleta && <span className="animate-pulse">|</span>}
          </p>
        </div>
        
        <div className="flex justify-between">
          <div>
            <button
              onClick={handlePrevious}
              disabled={explicacaoIndex === 0}
              className="px-4 py-2 bg-purple-700 text-white rounded mr-2 hover:bg-purple-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-600 transition duration-300"
            >
              {explicacaoIndex < explicacoes.length - 1 ? "Próximo" : "Finalizar"}
            </button>
          </div>
          <button
            onClick={handleSkip}
            className="px-6 py-2 bg-transparent border border-purple-300 text-white rounded hover:bg-purple-800 transition duration-300"
          >
            Pular Explicação
          </button>
        </div>
        
        <div className="mt-4 flex justify-center">
          <div className="flex space-x-1">
            {explicacoes.map((_, idx) => (
              <div 
                key={idx}
                className={`h-2 w-2 rounded-full ${idx === explicacaoIndex ? 'bg-purple-300' : 'bg-purple-600'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalileuExplicacaoModal;