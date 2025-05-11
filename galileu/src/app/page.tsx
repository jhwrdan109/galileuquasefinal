"use client";

import Header from "../app/header";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react"; // Substituímos o FaRocket pelo Rocket do lucide-react

import "@fontsource/poppins";

const LandingPage: React.FC = () => {
  const router = useRouter();
  const quemSomosRef = useRef<HTMLDivElement>(null);

  const scrollToQuemSomos = () => {
    quemSomosRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      <Header scrollToQuemSomos={scrollToQuemSomos} />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 pt-48">
        <main className="flex flex-col items-start justify-center py-16">
          <motion.h1
            className="text-6xl md:text-4xl font-bold text-white mb-6 max-w-3xl text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Uma aprendizagem sobre Plano Inclinado de uma forma interativa
          </motion.h1>

          <motion.p
            className="text-xl text-purple-200 mb-12 max-w-3xl text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            O Projeto Galileu busca melhorar a compreensão da matéria de Plano Inclinado da disciplina de Física, tornando-a mais eficaz.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <button
              onClick={() => router.push("/login")}
              className="bg-purple-600 text-white px-8 py-3 rounded-md hover:bg-purple-500 font-bold transition duration-300 flex items-center gap-2"
            >
              <span className="animate-bounce">
                <Rocket className="w-6 h-6" />
              </span>
              Começar Agora
            </button>
          </motion.div>
        </main>
      </div>

      {/* Quem Somos */}
      <motion.div
        ref={quemSomosRef}
        className="bg-white py-12 px-6 mt-24 border-t-4 border-purple-950 shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-purple-700 ">Quem Somos</h2>
          <p className="text-base text-gray-800 leading-relaxed">
            Nós somos o Projeto Galileu, buscando melhorar a interação entre professor e aluno.
            Através da interação entre software e hardware, queremos tornar o estudo de Física
            mais acessível e interativo, focando no tema de Plano Inclinado para ajudar estudantes
            a melhorarem seu desempenho em vestibulares. Somos alunos da Fundação Matias Machline,
            cursando o terceiro ano do ensino médio técnico.
          </p>
        </div>
      </motion.div>

      {/* Diferenciais */}
      <motion.div
        className="bg-white py-16 px-6   border-purple-200"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-purple-800 ">Nossos Diferenciais</h2>
          <p className="text-lg text-gray-700 mb-10">
            O Projeto Galileu vai além do ensino tradicional, oferecendo recursos que tornam o aprendizado de Física mais eficiente e envolvente.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border ">
            <motion.div
              className="bg-white border border-purple-300 rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold text-purple-700 mb-2 ">Criação de Questões</h3>
              <p className="text-gray-600">
                Professores podem criar, editar e armazenar questões específicas de plano inclinado, adaptadas ao nível da turma.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg border border-purple-300  transition duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold text-purple-700 mb-2">Interatividade Aumentada</h3>
              <p className="text-gray-600">
                Maior conexão entre aluno e professor com feedbacks em tempo real e explicações inteligentes através do "Professor Galileu".
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-md p-6   border border-purple-300  hover:shadow-lg transition duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold text-purple-700 mb-2">Dados Reais e Visuais</h3>
              <p className="text-gray-600">
                Visualização de dados reais captados por sensores, com gráficos dinâmicos que facilitam a compreensão prática dos conceitos.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
