"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDatabase, ref, onValue, set, push, update } from "firebase/database";
import { app } from "../../../lib/firebaseConfig";
import ForcasSVG from "@/components/ForcasSVG";
import Image from "next/image";
import GalieluExplicacaoInicio from "../galileuexplicacaoinicio/page"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const InfoCard = ({
  title,
  value,
  unit,
}: {
  title: string;
  value: number | null;
  unit: string;
}) => (
  <div className="p-6 bg-white rounded-lg shadow-lg text-center">
    <h4 className="text-xl font-semibold text-black">{title}</h4>
    <p className="text-2xl font-bold text-black">
      {value !== null ? `${value.toFixed(2)} ${unit}` : "Carregando..."}
    </p>
  </div>
);

const ExplicacaoGalileu: React.FC<{
  angulo: number | null;
  forcaPeso: number | null;
  forcaNormal: number | null;
  forcaAtrito: number | null;
  aceleracao: number | null;
  velocidade: number | null;
  px: number | null;
  py: number | null;
  forcaResultante: number | null;
  distancia: number | null;
  tempo: number | null;
}> = ({ 
  angulo, 
  forcaPeso, 
  forcaNormal, 
  forcaAtrito, 
  aceleracao,
  velocidade,
  px,
  py,
  forcaResultante,
  distancia,
  tempo
}) => {
  const [explicando, setExplicando] = useState(false);
  const [textoAtual, setTextoAtual] = useState("");
  const [indiceExplicacao, setIndiceExplicacao] = useState(0);
  const [tooltipVisivel, setTooltipVisivel] = useState<string | null>(null);
  
  const explicacoes = [
    {
      id: "angulo",
      titulo: "Ângulo (θ)",
      texto: "O ângulo de inclinação da rampa em relação à horizontal. Quanto maior o ângulo, maior a componente da força peso na direção do movimento."
    },
    {
      id: "velocidade",
      titulo: "Velocidade (v)",
      texto: "A rapidez com que o objeto se desloca ao longo da rampa, medida em metros por segundo (m/s)."
    },
    {
      id: "forcaPeso",
      titulo: "Força Peso (P)",
      texto: "A força com a qual a gravidade atrai o objeto para baixo. Ela é calculada pela fórmula P = m × g, onde m é a massa do objeto e g é a aceleração da gravidade."
    },
    {
      id: "px",
      titulo: "Componente x do Peso (Px)",
      texto: "A componente da força peso paralela à superfície da rampa. Calculada como Px = P × sen(θ), esta é a força que efetivamente impulsiona o objeto para baixo na rampa."
    },
    {
      id: "py",
      titulo: "Componente y do Peso (Py)",
      texto: "A componente da força peso perpendicular à superfície da rampa. Calculada como Py = P × cos(θ), esta componente é contrabalançada pela força normal."
    },
    {
      id: "forcaNormal",
      titulo: "Força Normal (N)",
      texto: "A força que a superfície exerce sobre o objeto, sempre perpendicular à superfície de contato. Em um plano inclinado, ela é igual à componente y do peso: N = P × cos(θ)."
    },
    {
      id: "forcaAtrito",
      titulo: "Força de Atrito (Fa)",
      texto: "A força que resiste ao movimento do objeto. Sua intensidade é dada por Fa = μ × N, onde μ é o coeficiente de atrito entre as superfícies."
    },
    {
      id: "forcaResultante",
      titulo: "Força Resultante (Fr)",
      texto: "A soma de todas as forças agindo sobre o objeto na direção do movimento. Na rampa, é calculada como Fr = Px - Fa. Esta força resultante é responsável pela aceleração do objeto."
    },
    {
      id: "aceleracao",
      titulo: "Aceleração (a)",
      texto: "A taxa de variação da velocidade do objeto ao longo do tempo. Pela Segunda Lei de Newton, a = Fr / m, onde Fr é a força resultante e m é a massa do objeto."
    },
    {
      id: "distancia",
      titulo: "Distância (d)",
      texto: "O comprimento do caminho percorrido pelo objeto ao longo da rampa, medido em metros (m)."
    },
    {
      id: "tempo",
      titulo: "Tempo (t)",
      texto: "A duração do movimento do objeto, medida em segundos (s)."
    }
  ];

  const getExplicacaoPorId = (id: string) => {
    return explicacoes.find(exp => exp.id === id);
  };

  const mostrarTooltip = (id: string) => {
    setTooltipVisivel(id);
  };

  const esconderTooltip = () => {
    setTooltipVisivel(null);
  };

  const iniciarExplicacao = () => {
    setExplicando(true);
    setIndiceExplicacao(0);
    setTextoAtual("");
  };

  useEffect(() => {
    if (!explicando) return;

    let textoCompleto = "";
    const explicacaoAtual = explicacoes[indiceExplicacao];
    
    if (!explicacaoAtual) {
      setExplicando(false);
      return;
    }

    textoCompleto = `${explicacaoAtual.titulo}: ${explicacaoAtual.texto}`;
    
    let indiceCaractere = 0;
    const velocidadeDigitacao = 25; // milissegundos por caractere

    const intervalo = setInterval(() => {
      if (indiceCaractere <= textoCompleto.length) {
        setTextoAtual(textoCompleto.substring(0, indiceCaractere));
        indiceCaractere++;
      } else {
        clearInterval(intervalo);
        setTimeout(() => {
          setIndiceExplicacao(prev => prev + 1);
          setTextoAtual("");
        }, 1000);
      }
    }, velocidadeDigitacao);

    return () => clearInterval(intervalo);
  }, [explicando, indiceExplicacao]);

  // Componente de tooltip
  const Tooltip = ({ id }: { id: string }) => {
    const explicacao = getExplicacaoPorId(id);
    if (!explicacao) return null;
    
    return (
      <div className="absolute z-10 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-xs transform -translate-y-full -translate-x-1/4 mb-2 opacity-90">
        <h4 className="font-bold text-sm mb-1">{explicacao.titulo}</h4>
        <p className="text-xs">{explicacao.texto}</p>
        <div className="absolute w-3 h-3 bg-gray-900 transform rotate-45 left-1/4 bottom-0 translate-y-1/2"></div>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-8 mb-5">
      <h3 className="text-lg font-bold mb-4 text-black">Explicação dos Valores</h3>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 flex flex-col items-center justify-center p-4">
          <img 
            src="https://media.discordapp.net/attachments/1362902994634408210/1370849912949964900/galileu_boca_2.gif?ex=6820fef8&is=681fad78&hm=fe85d17e1ce3a99de86013aa7439e14a709e2af2c68d291a5c0019a9f40c952e&=&width=640&height=640" 
            alt="Galileu explicando" 
            className="w-48 h-48 rounded-full mb-4"
          />
          <button
            onClick={iniciarExplicacao}
            disabled={explicando}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition duration-300 disabled:bg-gray-400"
          >
            {explicando ? "Explicando..." : "Peça ao Galileu explicar"}
          </button>
        </div>
        <div className="md:w-2/3 space-y-4 text-black p-4">
          {explicando ? (
            <div className="border-l-4 border-purple-600 pl-4 py-2 min-h-32 flex items-center">
              <p className="text-lg">{textoAtual}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onMouseEnter={() => mostrarTooltip("velocidade")}
                onMouseLeave={esconderTooltip}
                className="border-l-4 border-green-600 pl-4 py-2 relative cursor-help"
              >
                <p><strong className="text-green-600">Velocidade:</strong> {velocidade !== null ? `${velocidade.toFixed(2)} m/s` : "Carregando..."}</p>
                {tooltipVisivel === "velocidade" && <Tooltip id="velocidade" />}
              </div>
              <div 
                onMouseEnter={() => mostrarTooltip("px")}
                onMouseLeave={esconderTooltip}
                className="border-l-4 border-blue-600 pl-4 py-2 relative cursor-help"
              >
                <p><strong className="text-blue-600">Px:</strong> {px !== null ? `${px.toFixed(2)} N` : "Carregando..."}</p>
                {tooltipVisivel === "px" && <Tooltip id="px" />}
              </div>
              <div 
                onMouseEnter={() => mostrarTooltip("py")}
                onMouseLeave={esconderTooltip}
                className="border-l-4 border-indigo-600 pl-4 py-2 relative cursor-help"
              >
                <p><strong className="text-indigo-600">Py:</strong> {py !== null ? `${py.toFixed(2)} N` : "Carregando..."}</p>
                {tooltipVisivel === "py" && <Tooltip id="py" />}
              </div>
              <div 
                onMouseEnter={() => mostrarTooltip("forcaAtrito")}
                onMouseLeave={esconderTooltip}
                className="border-l-4 border-orange-500 pl-4 py-2 relative cursor-help"
              >
                <p><strong className="text-orange-500">Força de Atrito:</strong> {forcaAtrito !== null ? `${forcaAtrito.toFixed(2)} N` : "Carregando..."}</p>
                {tooltipVisivel === "forcaAtrito" && <Tooltip id="forcaAtrito" />}
              </div>
              <div 
                onMouseEnter={() => mostrarTooltip("forcaPeso")}
                onMouseLeave={esconderTooltip}
                className="border-l-4 border-red-600 pl-4 py-2 relative cursor-help"
              >
                <p><strong className="text-red-600">Força Peso:</strong> {forcaPeso !== null ? `${forcaPeso.toFixed(2)} N` : "Carregando..."}</p>
                {tooltipVisivel === "forcaPeso" && <Tooltip id="forcaPeso" />}
              </div>
              <div 
                onMouseEnter={() => mostrarTooltip("forcaResultante")}
                onMouseLeave={esconderTooltip}
                className="border-l-4 border-purple-600 pl-4 py-2 relative cursor-help"
              >
                <p><strong className="text-purple-600">Força Resultante:</strong> {forcaResultante !== null ? `${forcaResultante.toFixed(2)} N` : "Carregando..."}</p>
                {tooltipVisivel === "forcaResultante" && <Tooltip id="forcaResultante" />}
              </div>
              <div 
                onMouseEnter={() => mostrarTooltip("forcaNormal")}
                onMouseLeave={esconderTooltip}
                className="border-l-4 border-green-500 pl-4 py-2 relative cursor-help"
              >
                <p><strong className="text-green-500">Força Normal:</strong> {forcaNormal !== null ? `${forcaNormal.toFixed(2)} N` : "Carregando..."}</p>
                {tooltipVisivel === "forcaNormal" && <Tooltip id="forcaNormal" />}
              </div>
              <div 
                onMouseEnter={() => mostrarTooltip("aceleracao")}
                onMouseLeave={esconderTooltip}
                className="border-l-4 border-pink-500 pl-4 py-2 relative cursor-help"
              >
                <p><strong className="text-pink-500">Aceleração:</strong> {aceleracao !== null ? `${aceleracao.toFixed(2)} m/s²` : "Carregando..."}</p>
                {tooltipVisivel === "aceleracao" && <Tooltip id="aceleracao" />}
              </div>
              <div 
                onMouseEnter={() => mostrarTooltip("distancia")}
                onMouseLeave={esconderTooltip}
                className="border-l-4 border-yellow-500 pl-4 py-2 relative cursor-help"
              >
                <p><strong className="text-yellow-500">Distância:</strong> {distancia !== null ? `${distancia.toFixed(2)} cm` : "Carregando..."}</p>
                {tooltipVisivel === "distancia" && <Tooltip id="distancia" />}
              </div>
              <div 
                onMouseEnter={() => mostrarTooltip("tempo")}
                onMouseLeave={esconderTooltip}
                className="border-l-4 border-cyan-500 pl-4 py-2 relative cursor-help"
              >
                <p><strong className="text-cyan-500">Tempo:</strong> {tempo !== null ? `${tempo.toFixed(2)} s` : "Carregando..."}</p>
                {tooltipVisivel === "tempo" && <Tooltip id="tempo" />}
              </div>
              <div 
                onMouseEnter={() => mostrarTooltip("angulo")}
                onMouseLeave={esconderTooltip}
                className="border-l-4 border-amber-500 pl-4 py-2 relative cursor-help"
              >
                <p><strong className="text-amber-500">Ângulo:</strong> {angulo !== null ? `${angulo.toFixed(2)}°` : "Carregando..."}</p>
                {tooltipVisivel === "angulo" && <Tooltip id="angulo" />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AnaliseSimulacao: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [simulacaoId, setSimulacaoId] = useState<string | null>(null);
  
  // Valores vindos do Firebase
  const [distancia, setDistancia] = useState<number | null>(null);
  const [angulo, setAngulo] = useState<number | null>(null);
  const [velocidade, setVelocidade] = useState<number | null>(null);
  const [px, setPx] = useState<number | null>(null);
  const [py, setPy] = useState<number | null>(null);
  const [tempo, setTempo] = useState<number | null>(null);
  const [aceleracao, setAceleracao] = useState<number | null>(null);
  const [forcaPeso, setForcaPeso] = useState<number | null>(null);
  const [forcaNormal, setForcaNormal] = useState<number | null>(null);
  const [forcaAtrito, setForcaAtrito] = useState<number | null>(null);
  
  // Calcula força resultante localmente
  const forcaResultante = py !== null && forcaAtrito !== null 
    ? py - forcaAtrito 
    : null;

  // Dados para o gráfico
  const [dadosGrafico, setDadosGrafico] = useState<Array<{angulo: number, aceleracao: number}>>([]);

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

  useEffect(() => {
    if (!simulationStarted || !simulacaoId) return;

    const database = getDatabase(app);
    const simulacaoDadosRef = ref(database, `simulacoes/${simulacaoId}/dados`);

    const updateSimulationData = () => {
      set(simulacaoDadosRef, {
        distancia,
        angulo,
        velocidade,
        px,
        py,
        tempo,
        aceleracao,
        forcaPeso,
        forcaNormal,
        forcaAtrito,
        forcaResultante: forcaResultante !== null ? forcaResultante.toFixed(2) : 0
      }).catch((error) => {
        console.error("Erro ao atualizar dados da simulação:", error);
      });
    };

    if (distancia !== null && angulo !== null && velocidade !== null) {
      updateSimulationData();
    }

    const interval = setInterval(updateSimulationData, 5000);
    
    return () => clearInterval(interval);
  }, [
    simulationStarted, 
    simulacaoId, 
    distancia, 
    angulo, 
    velocidade, 
    px, 
    py, 
    tempo,
    aceleracao, 
    forcaPeso, 
    forcaNormal, 
    forcaAtrito,
    forcaResultante
  ]);

  useEffect(() => {
    if (!simulationStarted) return;

    const database = getDatabase(app);

    const distRef = ref(database, "sensor/distancia");
    const angRef = ref(database, "sensor/angulo");
    const velRef = ref(database, "sensor/velocidade");
    const pxRef = ref(database, "sensor/px");
    const pyRef = ref(database, "sensor/py");
    const tempoRef = ref(database, "sensor/tempo");
    const accRef = ref(database, "sensor/aceleracao");
    const pesoRef = ref(database, "sensor/peso");
    const normalRef = ref(database, "sensor/normal");
    const atritoRef = ref(database, "sensor/atrito");
    const graficoRef = ref(database, "sensor/dadosGrafico");

    const unsub1 = onValue(distRef, (snap) => {
      if (snap.exists()) {
        setDistancia(parseFloat(parseFloat(snap.val()).toFixed(2)));
      }
    });
    
    const unsub2 = onValue(angRef, (snap) => {
      if (snap.exists()) {
        setAngulo(parseFloat(parseFloat(snap.val()).toFixed(2)));
      }
    });
    
    const unsub3 = onValue(velRef, (snap) => {
      if (snap.exists()) {
        setVelocidade(parseFloat(parseFloat(snap.val()).toFixed(2)));
      }
    });
    
    const unsub4 = onValue(pxRef, (snap) => {
      if (snap.exists()) {
        setPx(parseFloat(parseFloat(snap.val()).toFixed(2)));
      }
    });
    
    const unsub5 = onValue(pyRef, (snap) => {
      if (snap.exists()) {
        setPy(parseFloat(parseFloat(snap.val()).toFixed(2)));
      }
    });
    
    const unsub6 = onValue(tempoRef, (snap) => {
      if (snap.exists()) {
        setTempo(parseFloat(parseFloat(snap.val()).toFixed(2)));
      }
    });
    
    const unsub7 = onValue(accRef, (snap) => {
      if (snap.exists()) {
        setAceleracao(parseFloat(parseFloat(snap.val()).toFixed(2)));
      }
    });
    
    const unsub8 = onValue(pesoRef, (snap) => {
      if (snap.exists()) {
        setForcaPeso(parseFloat(parseFloat(snap.val()).toFixed(2)));
      }
    });
    
    const unsub9 = onValue(normalRef, (snap) => {
      if (snap.exists()) {
        setForcaNormal(parseFloat(parseFloat(snap.val()).toFixed(2)));
      }
    });
    
    const unsub10 = onValue(atritoRef, (snap) => {
      if (snap.exists()) {
        setForcaAtrito(parseFloat(parseFloat(snap.val()).toFixed(2)));
      }
    });
    
    const unsub11 = onValue(graficoRef, (snap) => {
      if (snap.exists()) {
        const graficoData = snap.val();
        if (Array.isArray(graficoData)) {
          setDadosGrafico(graficoData);
          
          if (simulacaoId) {
            const graficoSimulacaoRef = ref(database, `simulacoes/${simulacaoId}/grafico`);
            set(graficoSimulacaoRef, graficoData).catch((error) => {
              console.error("Erro ao atualizar gráfico na simulação:", error);
            });
          }
        } else {
          console.error("Dados do gráfico não estão em formato de array");
        }
      }
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
      unsub5();
      unsub6();
      unsub7();
      unsub8();
      unsub9();
      unsub10();
      unsub11();
    };
  }, [simulationStarted, simulacaoId]);

  const gerarDadosGrafico = () => {
    const database = getDatabase(app);
    const graficoRef = ref(database, "sensor/dadosGrafico");
    
    const dadosGerados = Array.from({length: 91}, (_, i) => ({
      angulo: i,
      aceleracao: i > 0 ? parseFloat((Math.sin(i * Math.PI / 180) * 9.8).toFixed(2)) : 0
    }));
    
    set(graficoRef, dadosGerados).catch(error => {
      console.error("Erro ao gerar dados do gráfico:", error);
    });
  };

  const iniciarSimulacao = () => {
    if (simulationStarted) return;

    const database = getDatabase(app);
    
    const simulacoesRef = ref(database, "simulacoes");
    const novaSimulacaoRef = push(simulacoesRef);
    const novoSimulacaoId = novaSimulacaoRef.key;
    
    const timestampInicio = new Date().toISOString();
    
    const liberarRef = ref(database, "sensor/liberar");
      
    set(novaSimulacaoRef, {
      userName,
      timestamp: timestampInicio,
      status: "iniciada",
      dados: {
        distancia: 0,
        angulo: 0,
        velocidade: 0,
        px: 0,
        py: 0,
        tempo: 0,
        aceleracao: 0,
        forcaPeso: 0,
        forcaNormal: 0,
        forcaAtrito: 0,
        forcaResultante: 0
      }
    })
      .then(() => {
        return set(liberarRef, true);
      })
      .then(() => {
        setSimulacaoId(novoSimulacaoId);
        setSimulationStarted(true);
        
        const graficoRef = ref(database, "sensor/dadosGrafico");
        onValue(graficoRef, (snap) => {
          if (!snap.exists() || !Array.isArray(snap.val()) || snap.val().length === 0) {
            gerarDadosGrafico();
          }
        }, { onlyOnce: true });
      })
      .catch((error) => {
        console.error("Erro ao iniciar simulação:", error);
      });
  };

  const finalizarSimulacao = () => {
    if (!simulationStarted || !simulacaoId) return;

    const database = getDatabase(app);
    const liberarRef = ref(database, "sensor/liberar");
    const simulacaoRef = ref(database, `simulacoes/${simulacaoId}`);

    set(liberarRef, false)
      .then(() => {
        return update(simulacaoRef, { status: "finalizada" });
      })
      .then(() => {
        setSimulationStarted(false);
        setSimulacaoId(null);
      })
      .catch((error) => {
        console.error("Erro ao finalizar simulação:", error);
      });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white text-xl">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{
      backgroundImage: "url('/images/FundoCanva.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    }}>
      <GalieluExplicacaoInicio/>
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16">
          <Image
            onClick={() => router.push("/dashboardaluno")}
            src="/images/markim-Photoroom.png"
            alt="Logo Projeto Galileu"
            width={150}
            height={50}
            className="hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
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

        <div className="relative max-w-5xl mx-auto bg-purple-900 bg-opacity-60 border border-purple-300 p-8 rounded-xl mt-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Análise</h2>

          {!simulationStarted ? (
            <div className="flex justify-center space-x-4">
              <button
                onClick={iniciarSimulacao}
                className="bg-purple-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-purple-600 transition duration-300 shadow-lg"
              >
                Iniciar Simulação
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-center space-x-4 mb-10">
                <button
                  onClick={finalizarSimulacao}
                  className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-500 transition duration-300 shadow-lg"
                >
                  Fim da Simulação
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-black mb-14">
                <InfoCard title="Distância" value={distancia} unit="cm" />
                <InfoCard title="Ângulo" value={angulo} unit="°" />
                <InfoCard title="Velocidade" value={velocidade} unit="m/s" />
                <InfoCard title="Px" value={px} unit="N" />
                <InfoCard title="Py" value={py} unit="N" />
                <InfoCard title="Tempo" value={tempo} unit="s" />
                <InfoCard title="Força Peso" value={forcaPeso} unit="N" />
                <InfoCard title="Força Normal" value={forcaNormal} unit="N" />
                <InfoCard title="Força Atrito" value={forcaAtrito} unit="N" />
                <InfoCard title="Aceleração" value={aceleracao} unit="m/s²" />
                <InfoCard title="Força Resultante" value={forcaResultante} unit="N" />
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg mb-12">
                <h3 className="text-xl font-semibold text-black mb-4">Representação das Forças</h3>
                <div className="flex justify-center items-center h-96">
                  <ForcasSVG
                    forcaPeso={forcaPeso ?? 0}
                    forcaNormal={forcaNormal ?? 0}
                    forcaAtrito={forcaAtrito ?? 0}
                    px={px ?? 0}
                    py={py ?? 0}
                    forcaResultante={forcaResultante ?? 0}
                    anguloInicial={30}
                    anguloFirebase={angulo}
                  />
                </div>
              </div>

              <ExplicacaoGalileu
                angulo={angulo}
                forcaPeso={forcaPeso}
                forcaNormal={forcaNormal}
                forcaAtrito={forcaAtrito}
                aceleracao={aceleracao}
                velocidade={velocidade}
                px={px}
                py={py}
                forcaResultante={forcaResultante}
                distancia={distancia}
                tempo={tempo}
              />
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-black mb-4">
                  Gráfico: Aceleração vs Ângulo
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart 
                    data={dadosGrafico.length > 0 ? dadosGrafico : Array.from({length: 91}, (_, i) => ({angulo: i, aceleracao: 0}))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="angulo" 
                      label={{ value: "Ângulo (°)", position: "insideBottomRight", offset: 0 }}
                      domain={[0, 90]}
                      ticks={[0, 15, 30, 45, 60, 75, 90]}
                    />
                    <YAxis 
                      label={{ value: "Aceleração (m/s²)", angle: -90, position: "insideLeft" }}
                      domain={[0, 10]}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} m/s²`, "Aceleração"]}
                      labelFormatter={(label) => `Ângulo: ${label}°`}
                    />
                    <Line
                      type="monotone"
                      dataKey="aceleracao"
                      stroke="#7c3aed"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnaliseSimulacao;