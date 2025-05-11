"use client";
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push } from 'firebase/database';
import { app } from '../../../lib/firebaseConfig';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const CriarQuestaoDispositivo = () => {
  const [sensor, setSensor] = useState<any>(null);
  const [tempoMinutos, setTempoMinutos] = useState(0);
  const [tempoSegundos, setTempoSegundos] = useState(0);
  const [mostrarModalTempo, setMostrarModalTempo] = useState(false);
  const [enunciado, setEnunciado] = useState('');
  const [resolucao, setResolucao] = useState('');
  const [incognita, setIncognita] = useState('');
  const [alternativas, setAlternativas] = useState<{ [key: string]: string }>({
    A: '', B: '', C: '', D: '', E: '',
  });
  const [respostaCorreta, setRespostaCorreta] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();
  const tempoTotal = Math.max(0, tempoMinutos * 60 + tempoSegundos);

  useEffect(() => {
    const db = getDatabase(app);
    const sensorRef = ref(db, 'sensor');

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(`Prof. ${user.name || user.email}`);
      setUserId(user.uid);
      setLoading(false);
    } else {
      router.push("/login");
    }

    onValue(sensorRef, (snapshot) => {
      const dados = snapshot.val();
      if (dados) setSensor(dados);
    });
  }, [router]);

  const criarQuestao = () => {
    if (!sensor) {
      alert('Sensor não encontrado!');
      return;
    }

    const novaQuestao = {
      enunciado,
      tempo: tempoTotal,
      resolucao,
      criadoEm: new Date().toISOString(),
      professor: userName,
      dados_usados: {
        aceleracao: sensor.aceleracao,
        distancia: sensor.distancia,
        angulo: sensor.angulo,
        tempo: sensor.tempo,
      },
      incognita,
      alternativas,
      respostaCorreta,
    };

    const db = getDatabase(app);
    const questoesRef = ref(db, `questoesComBaseNosSensores/${userId}`);
    push(questoesRef, novaQuestao).then(() => {
      alert('Questão criada com sucesso!');
      setEnunciado('');
      setTempoMinutos(0);
      setTempoSegundos(0);
      setResolucao('');
      setIncognita('');
      setAlternativas({ A: '', B: '', C: '', D: '', E: '' });
      setRespostaCorreta('');
    });
  };

  const atualizarAlternativa = (letra: string, value: string) => {
    setAlternativas((prev) => ({ ...prev, [letra]: value }));
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white text-xl">Carregando...</div>;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/images/FundoCanva.png')",
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Galileu + botão de ajuda */}
      <div className="hidden md:flex flex-col items-center fixed left-0 bottom-0 z-10 ml-4 mb-4 gap-4">
        <Image src="/images/galileufrente.png" alt="Galileu" width={200} height={300} />
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 transition"
        >
         Exemplo de como criar
        </button>
      </div>

      {/* Modal de ajuda */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto relative">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Como Criar Questões Utilizando Dados do Sensor</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-purple-700">Exemplo 1: Tempo de Queda</h3>
              <p className="mb-2"><strong>Enunciado:</strong> "Um objeto é solto de uma altura de {sensor?.distancia || 'X'} metros em uma superfície inclinada com ângulo de {sensor?.angulo || 'Y'}° em relação à horizontal. Considerando a aceleração da gravidade como {sensor?.aceleracao || 'Z'} m/s², calcule o tempo que o objeto leva para atingir o solo."</p>
              <p className="mb-2"><strong>Resolução:</strong> Para calcular o tempo de queda em um plano inclinado, usamos a componente da aceleração da gravidade na direção do plano: a = g·sen(θ). Depois aplicamos a equação de movimento: d = (1/2)·a·t². Isolando t, temos: t = √(2d/(g·sen(θ)))</p>
              <p><strong>Incógnita:</strong> tempo</p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-purple-700">Exemplo 2: Distância Percorrida</h3>
              <p className="mb-2"><strong>Enunciado:</strong> "Um objeto se move com aceleração constante de {sensor?.aceleracao || 'X'} m/s² ao longo de uma rampa com inclinação de {sensor?.angulo || 'Y'}°. Se o movimento durou {sensor?.tempo || 'Z'} segundos, qual foi a distância percorrida pelo objeto?"</p>
              <p className="mb-2"><strong>Resolução:</strong> Usamos a equação do movimento uniformemente acelerado: d = (1/2)·a·t². Substituindo os valores, encontramos a distância.</p>
              <p><strong>Incógnita:</strong> distancia</p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-purple-700">Exemplo 3: Aceleração Resultante</h3>
              <p className="mb-2"><strong>Enunciado:</strong> "Um objeto percorre uma distância de {sensor?.distancia || 'X'} metros em uma rampa com inclinação de {sensor?.angulo || 'Y'}° em relação à horizontal durante {sensor?.tempo || 'Z'} segundos, partindo do repouso. Qual é a aceleração do objeto?"</p>
              <p className="mb-2"><strong>Resolução:</strong> Utilizando a equação do movimento uniformemente acelerado: d = (1/2)·a·t². Isolando a aceleração: a = 2d/t²</p>
              <p><strong>Incógnita:</strong> aceleracao</p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-purple-700">Exemplo 4: Ângulo da Rampa</h3>
              <p className="mb-2"><strong>Enunciado:</strong> "Um objeto desliza por uma rampa e percorre {sensor?.distancia || 'X'} metros em {sensor?.tempo || 'Y'} segundos, sob uma aceleração de {sensor?.aceleracao || 'Z'} m/s². Qual é o ângulo de inclinação da rampa em relação à horizontal?"</p>
              <p className="mb-2"><strong>Resolução:</strong> Se a aceleração é constante, podemos comparar com a componente da gravidade na direção do plano inclinado: a = g·sen(θ). Isolando θ: θ = arcsen(a/g)</p>
              <p><strong>Incógnita:</strong> angulo</p>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2 text-purple-700">Fórmulas Úteis</h3>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-semibold mb-1">Movimento em Plano Inclinado:</p>
                <ul className="list-disc pl-5 mb-2">
                  <li>Aceleração ao longo do plano: a = g·sen(θ)</li>
                  <li>Força normal: N = m·g·cos(θ)</li>
                  <li>Força de atrito: Fa = μ·N = μ·m·g·cos(θ)</li>
                  <li>Aceleração com atrito: a = g·sen(θ) - μ·g·cos(θ)</li>
                </ul>
                
                <p className="font-semibold mb-1">Equações do Movimento Uniformemente Acelerado:</p>
                <ul className="list-disc pl-5 mb-2">
                  <li>Velocidade final: v = v₀ + a·t</li>
                  <li>Posição: d = v₀·t + (1/2)·a·t²</li>
                  <li>Relação velocidade-posição: v² = v₀² + 2·a·d</li>
                </ul>
                
                <p className="font-semibold mb-1">Componentes do Movimento:</p>
                <ul className="list-disc pl-5">
                  <li>Componente x da aceleração: ax = a·cos(θ)</li>
                  <li>Componente y da aceleração: ay = a·sen(θ)</li>
                  <li>Distância horizontal percorrida: dx = d·cos(θ)</li>
                  <li>Distância vertical percorrida: dy = d·sen(θ)</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Fechar
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16">
          <Image src="/images/markim-Photoroom.png" alt="Logo" width={150} height={50} />
          <nav>
            <ul className="flex flex-wrap justify-center gap-6">
              <li><button onClick={() => router.push('/dashboardprof')} className="text-white hover:text-purple-300 px-6 py-3">Início</button></li>
              <li><button onClick={() => router.push('/simuproftestesupabase')} className="text-white font-bold rounded-lg shadow-lg border border-purple-400 px-6 py-3">Simulações</button></li>
              <li><button onClick={() => router.push('/editarperfilprof')} className="bg-purple-600 text-white px-8 py-3 font-bold rounded-md">{userName}</button></li>
            </ul>
          </nav>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Dados do sensor */}
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-4">Dados do Sensor</h3>
            {sensor ? (
              <div className="grid grid-cols-2 gap-6 text-black">
                {['aceleracao', 'distancia', 'angulo', 'tempo'].map((key) => (
                  <div key={key} className="bg-white p-4 rounded-lg shadow-lg">
                    <h4 className="font-semibold text-lg">{key.charAt(0).toUpperCase() + key.slice(1)}:</h4>
                    <p>{sensor[key]}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Carregando dados do sensor...</p>
            )}
          </div>

          {/* Formulário */}
          <div className="flex-1 bg-purple-900 rounded-lg shadow-lg border border-purple-300 py-8 px-4">
            <h2 className="text-2xl font-semibold mb-4 text-white">Criar Questão (Com Base no Sensor)</h2>

            <label className="block text-white font-semibold">Enunciado:</label>
            <input value={enunciado} onChange={(e) => setEnunciado(e.target.value)} className="w-full p-2 mb-4 rounded text-black" />

            <label className="block text-white font-semibold">Resolução:</label>
            <input value={resolucao} onChange={(e) => setResolucao(e.target.value)} className="w-full p-2 mb-4 rounded text-black" />

            <label className="block text-white font-semibold">Incógnita:</label>
            <select value={incognita} onChange={(e) => setIncognita(e.target.value)} className="w-full p-2 mb-4 rounded text-black">
              <option value="">Selecione uma incógnita</option>
              <option value="velocidade">Velocidade</option>
              <option value="px">Px</option>
              <option value="py">Py</option>
              <option value="força normal">Força Normal</option>
              <option value="força de atrito">Força de Atrito</option>
              <option value="aceleração">Aceleração</option>
              <option value="tempo">Tempo</option>
              <option value="distancia">Distância</option>
              <option value="angulo">Ângulo</option>
            </select>

            <label className="block text-white font-semibold">Alternativas:</label>
            {['A', 'B', 'C', 'D', 'E'].map((letra) => (
              <div key={letra} className="flex items-center mb-2">
                <span className="w-6 text-white font-bold">{letra})</span>
                <input
                  type="text"
                  value={alternativas[letra]}
                  onChange={(e) => atualizarAlternativa(letra, e.target.value)}
                  className="w-full p-2 rounded text-black"
                />
              </div>
            ))}

            <label className="block text-white font-semibold mt-4">Resposta Correta (A-E):</label>
            <input
              type="text"
              maxLength={1}
              value={respostaCorreta}
              onChange={(e) => setRespostaCorreta(e.target.value.toUpperCase())}
              className="w-full p-2 mb-4 rounded text-black"
            />

            <label className="block mb-2 text-white">Tempo</label>
            <div>
            <button onClick={() => setMostrarModalTempo(true)} className="bg-purple-600 text-white py-2 px-4 rounded mb-4">
              Definir Tempo
            </button>
            </div>
            <button onClick={criarQuestao} className="bg-green-500 text-white py-2 px-6 rounded font-bold">
              Criar Questão
            </button>
          </div>
          
        </div>
      </div>

      {/* Modal de tempo */}
      {mostrarModalTempo && (
        <div className="modal bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="bg-purple-900 border border-purple-200 p-8 rounded-md">
            <h3 className="text-xl font-bold mb-4 text-white">Definir Tempo</h3>
            <div className="flex gap-6 mb-4">
              <div>
                <label htmlFor="minutos" className="text-white block">Minutos</label>
                <input
                  id="minutos"
                  type="number"
                  min="0"
                  value={tempoMinutos}
                  onChange={(e) => setTempoMinutos(Math.max(0, +e.target.value))}
                  className="p-2 border rounded text-black w-20"
                />
              </div>
              <div>
                <label htmlFor="segundos" className="text-white block">Segundos</label>
                <input
                  id="segundos"
                  type="number"
                  min="0"
                  max="59"
                  value={tempoSegundos}
                  onChange={(e) => setTempoSegundos(Math.max(0, Math.min(59, +e.target.value)))}
                  className="p-2 border rounded text-black w-20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setMostrarModalTempo(false)}>
                Cancelar
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setMostrarModalTempo(false)}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CriarQuestaoDispositivo;