'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { database } from '../../../lib/firebaseConfig';
import { ref, set, onValue } from 'firebase/database';
import { ArrowLeft, Paperclip } from 'lucide-react';
import { Clock, XCircle, RadialGauge, Ruler } from 'lucide-react';

const CriarQuestao = () => {
  const [enunciado, setEnunciado] = useState('');
  const [resolucao, setResolucao] = useState('');
  const [alternativas, setAlternativas] = useState('');
  const [alternativasVisualizacao, setAlternativasVisualizacao] = useState(['', '', '', '', '']);
  const [tempoMinutos, setTempoMinutos] = useState(0);
  const [tempoSegundos, setTempoSegundos] = useState(0);
  const [anexo, setAnexo] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarModalTempo, setMostrarModalTempo] = useState(false);
  const [alternativaCorreta, setAlternativaCorreta] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialType, setTutorialType] = useState("fisica");
  const videoRef = useRef(null);
  const [sensorData, setSensorData] = useState({
    distancia: 0,
    angulo: 0,
    ultimaAtualizacao: null
  });
  const [erros, setErros] = useState({
    enunciado: '',
    resolucao: '',
    alternativas: '',
    incognita: '',
    alternativaCorreta: '',
  });
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(`Prof. ${user.name || user.email}`);
      setUserId(user.uid);
      setLoading(false);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Carregar dados do sensor do Firebase
  useEffect(() => {
    const sensorRef = ref(database, 'sensor/');
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensorData({
          distancia: data.distancia || 0,
          angulo: data.angulo || 0,
          ultimaAtualizacao: new Date().toLocaleString()
        });
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  // Quando o componente é montado, se alternativas tiver valor, preenche o array de visualização
  useEffect(() => {
    if (alternativas) {
      const alts = alternativas.split(',').map(alt => alt.trim());
      const novasAlternativas = [...alternativasVisualizacao];
      
      for (let i = 0; i < Math.min(alts.length, 5); i++) {
        novasAlternativas[i] = alts[i];
      }
      
      setAlternativasVisualizacao(novasAlternativas);
    }
  }, []); // Executa apenas na montagem

  // Função para atualizar uma alternativa específica
  const atualizarAlternativa = (index, valor) => {
    const novasAlternativas = [...alternativasVisualizacao];
    novasAlternativas[index] = valor;
    setAlternativasVisualizacao(novasAlternativas);
    
    // Converte o array de visualização para a string de alternativas
    setAlternativas(novasAlternativas.join(', '));
  };

  const closeTutorial = () => {
    setShowTutorial(false);
  };

  const switchToSalaTutorial = () => {
    setTutorialType("sala");
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white text-xl">Carregando...</div>;
  }

  const handleAnexoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAnexo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAnexo(null);
    setImageUrl(null);
  };

  const handleUseSensorData = () => {
    // Usando os dados do sensor para preencher ou complementar o enunciado
    const novoEnunciado = `${enunciado}\n\nDados do sensor: Distância: ${sensorData.distancia}m, Ângulo: ${sensorData.angulo}°`;
    setEnunciado(novoEnunciado);
  };

  const handleSalvarQuestao = async () => {
    if (!userId) return;

    // Valida que todas as alternativas estão preenchidas
    const todasAlternativasPreenchidas = alternativasVisualizacao.every(alt => alt.trim() !== '');

    const novosErros = {
      enunciado: !enunciado.trim() ? 'O enunciado é obrigatório.' : '',
      resolucao: !resolucao.trim() ? 'A resolução é obrigatória.' : '',
      alternativas: !todasAlternativasPreenchidas ? 'Todas as alternativas são obrigatórias.' : '',
      alternativaCorreta: !alternativaCorreta ? 'A alternativa correta é obrigatória.' : '',
    };
    setErros(novosErros);

    if (Object.values(novosErros).some((erro) => erro !== '')) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const tempoTotal = Math.max(0, tempoMinutos * 60 + tempoSegundos); // Impede tempo negativo
    let anexoUrl = null;

    if (anexo) {
      try {
        const filePath = `questoes/${userId}/${Date.now()}-${anexo.name}`;
        const { data, error } = await supabase.storage
          .from('arquivos')
          .upload(filePath, anexo);

        if (error) return;

        const { data: publicUrlData } = supabase.storage
          .from('arquivos')
          .getPublicUrl(data.path);

        anexoUrl = publicUrlData?.publicUrl || null;
      } catch {
        return;
      }
    }

    const letras = ['A', 'B', 'C', 'D', 'E'];
    const alternativasObj = {};
    const alternativasArray = alternativas.split(',').map((alt) => alt.trim());
    for (let i = 0; i < letras.length; i++) {
      alternativasObj[letras[i]] = alternativasArray[i] || '';
    }

    const chaveQuestao = enunciado.trim().substring(0, 20).replace(/\s+/g, '_');

    const novaQuestao = {
      enunciado,
      resolucao,
      alternativas: alternativasObj,
      alternativaCorreta,
      criadoEm: new Date().toISOString(),
      professor: userName,
      professorId: userId,
      tempo: tempoTotal,
      anexo: anexoUrl,
      sensorData: {
        distancia: sensorData.distancia,
        angulo: sensorData.angulo,
        dataLeitura: sensorData.ultimaAtualizacao
      }
    };

    try {
      const questaoRef = ref(database, `questoes/${userId}/${chaveQuestao}`);
      await set(questaoRef, novaQuestao);

      alert('Questão salva com sucesso!');
      setEnunciado('');
      setResolucao('');
      setAlternativas('');
      setAlternativasVisualizacao(['', '', '', '', '']);
      setTempoMinutos(0);
      setTempoSegundos(0);
      setAnexo(null);
      setImageUrl(null);
      setAlternativaCorreta('');

      // Redireciona para a página de escolha após salvar
      router.push("/escolhacriadasoucriarprof");
    } catch {
      alert('Erro ao salvar a questão.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/images/kokushibo.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="border border-purple-300 bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg shadow-2xl w-full max-w-5xl p-8 text-white mx-4 overflow-y-auto max-h-screen">
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
                  <div className="bg-black bg-opacity-50 rounded-lg p-4 flex items-center justify-center">
                    <video 
                      ref={videoRef}
                      className="w-full max-w-3xl rounded-lg shadow-lg" 
                      controls
                      src="/images/gabrielTutorial.mp4"
                      preload="metadata"
                    >
                      Seu navegador não suporta vídeos HTML5.
                    </video>
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
                  <h4 className="text-xl font-semibold mb-4">Vídeo Tutorial</h4>
                  <div className="bg-black bg-opacity-50 rounded-lg p-4 flex items-center justify-center">
                    <video 
                      className="w-full max-w-3xl rounded-lg shadow-lg" 
                      controls
                      src="/images/criarsala.mp4"
                      preload="metadata"
                    >
                      Seu navegador não suporta vídeos HTML5.
                    </video>
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

      {/* Imagem fixa na esquerda */}
      <div className="hidden md:block fixed right-0 bottom-0 z-10">
        <Image
          src="/images/galileufrente.png"
          alt="Galileu"
          width={200} // Ajuste o tamanho conforme necessário
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
                  onClick={() => router.push('/dashboardprof')}
                  className="text-white hover:text-purple-300 px-6 py-3 rounded-md transition duration-300"
                >
                  Início
                </button>
              </li>
             
              <li>
                <button
                  onClick={() => router.push('/simuproftestesupabase')}
                  className="text-white px-6 py-3 rounded-md font-bold border border-purple-400"
                >
                  Simulações
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/editarperfilprof')}
                  className="bg-purple-600 text-white px-8 py-3 rounded-md font-bold transition duration-300"
                >
                  {userName}
                </button>
              </li>
            </ul>
          </nav>
        </header>
        <div className="flex flex-col md:flex-row items-start justify-center gap-6">
          {/* Container principal para criar questão */}
          <div className="bg-purple-900 p-4 rounded-lg shadow-lg border border-purple-300 w-full md:w-2/3 text-center relative">
            <button
              onClick={() => router.push("/escolhacriadasoucriarprof")}
              className="absolute top-4 left-4 text-white hover:text-purple-300 transition duration-300"
            >
              <ArrowLeft size={32} />
            </button>
            <h1 className="text-2xl font-bold mb-6">Criar Questão</h1>

            {/* Botão para abrir o tutorial */}
            <div className="mb-4">
              <button
                type="button"
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md transition duration-300"
                onClick={() => setShowTutorial(true)}
              >
                Ver Tutorial de Simulação Física
              </button>
            </div>

            <form>
              <div className="mb-4">
                <label className="block mb-2 text-white">Enunciado</label>
                <textarea
                  className={`w-full p-2 border rounded text-black ${erros.enunciado ? 'border-red-500' : ''}`}
                  value={enunciado}
                  onChange={(e) => setEnunciado(e.target.value)}
                  rows={5}
                />
                {erros.enunciado && <p className="text-red-500 text-sm">{erros.enunciado}</p>}
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-white">Resolução</label>
                <textarea
                  className={`w-full p-2 border rounded text-black ${erros.resolucao ? 'border-red-500' : ''}`}
                  value={resolucao}
                  onChange={(e) => setResolucao(e.target.value)}
                  rows={5}
                />
                {erros.resolucao && <p className="text-red-500 text-sm">{erros.resolucao}</p>}
              </div>
              
              {/* Interface melhorada para as alternativas */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-white">Alternativas (A até E):</label>
                {['A', 'B', 'C', 'D', 'E'].map((letra, i) => (
                  <div key={i} className="flex items-center mb-2">
                    <span className="w-6 font-bold text-white">{letra})</span>
                    <input
                      type="text"
                      value={alternativasVisualizacao[i]}
                      onChange={(e) => atualizarAlternativa(i, e.target.value)}
                      className={`w-full p-2 border rounded-md text-black ${erros.alternativas ? 'border-red-500' : ''}`}
                    />
                  </div>
                ))}
                {erros.alternativas && <p className="text-red-500 text-sm">{erros.alternativas}</p>}
              </div>
              
              <div className="mb-4">
                {erros.incognita && <p className="text-red-500 text-sm">{erros.incognita}</p>}
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-white">Alternativa Correta</label>
                <select
                  value={alternativaCorreta}
                  onChange={(e) => setAlternativaCorreta(e.target.value)}
                  className={`w-full p-3 rounded-md text-black border border-gray-300 mb-4 ${erros.alternativaCorreta ? 'border-red-500' : ''}`}
                >
                  <option value="">Selecione a alternativa correta</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
                {erros.alternativaCorreta && <p className="text-red-500 text-sm">{erros.alternativaCorreta}</p>}
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-white">Tempo</label>
                <button
                  type="button"
                  className="bg-purple-600 text-white py-2 px-4 rounded-md"
                  onClick={() => setMostrarModalTempo(true)}
                >
                  Definir Tempo
                </button>
                {mostrarModalTempo && (
                  <div className="modal bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full flex items-center justify-center">
                    <div className="bg-purple-900 border border-purple-200 p-8 rounded-md">
                      <h3 className="text-xl font-bold mb-4">Tempo</h3>
                      <div className="flex items-center mb-4">
                        <div className="flex items-center mr-4">
                          <label htmlFor="minutos" className="text-white mr-2">Minutos</label>
                          <input
                            id="minutos"
                            type="number"
                            min="0"
                            value={tempoMinutos}
                            onChange={(e) => setTempoMinutos(Math.max(0, +e.target.value))}
                            placeholder="Minutos"
                            className="p-2 border rounded text-black w-20"
                          />
                        </div>
                        <span className="text-white">:</span>
                        <div className="flex items-center ml-4">
                          <label htmlFor="segundos" className="text-white mr-2">Segundos</label>
                          <input
                            id="segundos"
                            type="number"
                            min="0"
                            max="59"
                            value={tempoSegundos}
                            onChange={(e) => setTempoSegundos(Math.max(0, Math.min(59, +e.target.value)))}
                            placeholder="Segundos"
                            className="p-2 border rounded text-black w-20"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          className="bg-red-500 text-white py-2 px-4 rounded-md mr-2"
                          onClick={() => setMostrarModalTempo(false)}
                        >
                          Cancelar
                        </button>
                        <button
                          className="bg-green-500 text-white py-2 px-4 rounded-md"
                          onClick={() => setMostrarModalTempo(false)}
                        >
                          Confirmar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-white">Anexo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="p-2 border rounded"
                  onChange={handleAnexoChange}
                />
                {imageUrl && (
                  <div className="mt-4 relative">
                    <Image
                      src={imageUrl}
                      alt="Imagem anexa"
                      width={200}
                      height={200}
                      className="object-contain"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 text-red-500"
                      onClick={handleRemoveImage}
                    >
                      <XCircle size={24} />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="bg-green-500 text-white px-6 py-3 rounded-md"
                  onClick={handleSalvarQuestao}
                >
                  Salvar Questão
                </button>
              </div>
            </form>
          </div>

          {/* Container dos cards de sensores */}
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            {/* Card de Distância */}
            <div className="bg-purple-900 p-4 rounded-lg shadow-lg border border-purple-300 text-center">
              <div className="flex items-center justify-center mb-2">
                <Ruler size={24} className="text-purple-300 mr-2" />
                <h2 className="text-xl font-bold">Sensor de Distância</h2>
              </div>
              <div className="bg-purple-800 rounded-lg p-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">{sensorData.distancia.toFixed(2)} cm</span>
              </div>
              <p className="text-sm mt-2 text-purple-200">
                Última atualização: {sensorData.ultimaAtualizacao || 'Indisponível'}
              </p>
              {/* Botão para usar os dados do sensor */}
              <button
                onClick={handleUseSensorData}
                className="mt-3 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Usar dados no enunciado
              </button>
            </div>
            
            {/* Card de Ângulo */}
            <div className="bg-purple-900 p-4 rounded-lg shadow-lg border border-purple-300 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock size={24} className="text-purple-300 mr-2" />
                <h2 className="text-xl font-bold">Sensor de Ângulo</h2>
              </div>
              <div className="bg-purple-800 rounded-lg p-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">{sensorData.angulo.toFixed(2)}°</span>
              </div>
              <p className="text-sm mt-2 text-purple-200">
                Última atualização: {sensorData.ultimaAtualizacao || 'Indisponível'}
              </p>
            </div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriarQuestao;