import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getDatabase, ref, onValue } from "firebase/database";

type Props = {};

const ForcasSVG: React.FC<Props> = () => {
  const centerX = 150;
  const centerY = 150;
  const ESCALA = 150;

  const [angulo, setAngulo] = useState(30);
  const [aceleracao, setAceleracao] = useState(6.9);
  const [atritoFirebase, setAtritoFirebase] = useState(0);
  const [pesoFirebase, setPesoFirebase] = useState<number | null>(null);
  const [normalFirebase, setNormalFirebase] = useState<number | null>(null);
  const [pyFirebase, setPyFirebase] = useState<number | null>(null);

  const [mostrarPeso, setMostrarPeso] = useState(true);
  const [mostrarNormal, setMostrarNormal] = useState(true);
  const [mostrarAtrito, setMostrarAtrito] = useState(true);
  const [mostrarResultante, setMostrarResultante] = useState(true);
  const [mostrarTodasForcas, setMostrarTodasForcas] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const sensorRef = ref(db, "sensor");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.aceleracao !== undefined) {
          setAceleracao(Number(data.aceleracao));
        }
        if (data.angulo !== undefined) {
          setAngulo(Number(data.angulo));
        }
        if (data.atrito !== undefined) {
          setAtritoFirebase(Number(data.atrito));
        }
        if (data.peso !== undefined) {
          setPesoFirebase(Number(data.peso));
        }
        if (data.normal !== undefined) {
          setNormalFirebase(Number(data.normal));
        }
        if (data.py !== undefined) {
          setPyFirebase(Number(data.py));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const rad = (angulo * Math.PI) / 180;
  const direcaoAtrito = aceleracao > 0 ? -1 : 1;
  const forcaResultante = pyFirebase !== null && atritoFirebase !== undefined 
    ? pyFirebase - atritoFirebase 
    : 0; // Py - atrito

  const forcaPeso = pesoFirebase ?? 0;
  const forcaNormal = normalFirebase ?? 0;

  // Vetores
  const vetorPesoX = 0;
  const vetorPesoY = ESCALA * forcaPeso;

  const vetorNormalX = -ESCALA * forcaNormal * Math.sin(rad);
  const vetorNormalY = -ESCALA * forcaNormal * Math.cos(rad);

  const vetorAtritoX = ESCALA * atritoFirebase * Math.cos(rad) * direcaoAtrito;
  const vetorAtritoY = ESCALA * atritoFirebase * Math.sin(rad) * direcaoAtrito;

  const vetorResultanteX = ESCALA * forcaResultante * Math.cos(rad);
  const vetorResultanteY = ESCALA * forcaResultante * Math.sin(rad);

  const desenharVetor = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    cor: string,
    texto: string,
    deslocaTextoX: number,
    deslocaTextoY: number,
    largura: number = 3
  ) => (
    <>
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={cor}
        strokeWidth={largura}
        markerEnd="url(#arrow)"
        initial={{ x1, y1, x2, y2 }}
        animate={{ x2, y2 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <text
        x={x2 + deslocaTextoX}
        y={y2 + deslocaTextoY}
        fill={cor}
        fontSize="12"
        fontWeight="bold"
      >
        {texto}
      </text>
    </>
  );

  const alternarTodasForcas = () => {
    const novoEstado = !mostrarTodasForcas;
    setMostrarTodasForcas(novoEstado);
    setMostrarPeso(novoEstado);
    setMostrarNormal(novoEstado);
    setMostrarAtrito(novoEstado);
    setMostrarResultante(novoEstado);
  };

  return (
    <div className="flex flex-col justify-center items-center mb-2">
      <svg width="340" height="340" viewBox="0 0 350 250">
        <defs>
          <marker
            id="arrow"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,8 L8,4 z" fill="black" />
          </marker>
        </defs>

        <polygon points="50,230 250,230 250,120" fill="#d3d3d3" />
        <rect
          x={centerX - 30}
          y={centerY - 25}
          width="50"
          height="50"
          fill="#8884d8"
          transform={`rotate(${-angulo}, ${centerX}, ${centerY})`}
        />

        {mostrarPeso &&
          desenharVetor(
            centerX,
            centerY,
            centerX + vetorPesoX,
            centerY + vetorPesoY,
            "red",
            `Peso (${forcaPeso.toFixed(2)} N)`,
            10,
            15
          )}
        {mostrarNormal &&
          desenharVetor(
            centerX,
            centerY,
            centerX + vetorNormalX,
            centerY + vetorNormalY,
            "green",
            `Normal (${forcaNormal.toFixed(2)} N)`,
            -40,
            0
          )}
        {mostrarAtrito &&
          desenharVetor(
            centerX,
            centerY,
            centerX + vetorAtritoX,
            centerY + vetorAtritoY,
            "orange",
            `Atrito (${atritoFirebase.toFixed(2)} N)`,
            -40,
            10
          )}
        {mostrarResultante &&
          desenharVetor(
            centerX,
            centerY,
            centerX + vetorResultanteX,
            centerY + vetorResultanteY,
            "blue",
            `Resultante (${forcaResultante.toFixed(2)} N)`,
            10,
            0
          )}
      </svg>

     
      <div className="mt-4 flex flex-wrap gap-2 justify-center py-5">
        <button
          onClick={() => setMostrarPeso(!mostrarPeso)}
          className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          {mostrarPeso ? "Esconder Peso" : "Mostrar Peso"}
        </button>
        <button
          onClick={() => setMostrarNormal(!mostrarNormal)}
          className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {mostrarNormal ? "Esconder Normal" : "Mostrar Normal"}
        </button>
        <button
          onClick={() => setMostrarAtrito(!mostrarAtrito)}
          className="px-4 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          {mostrarAtrito ? "Esconder Atrito" : "Mostrar Atrito"}
        </button>
        <button
          onClick={() => setMostrarResultante(!mostrarResultante)}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 py-2"
        >
          {mostrarResultante ? "Esconder Resultante" : "Mostrar Resultante"}
        </button>
      </div>

      <div className="">
        <button
          onClick={alternarTodasForcas}
          className="px-4 py-1 mb-12 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          {mostrarTodasForcas ? "Esconder Todas as Forças" : "Mostrar Todas as Forças"}
        </button>
      </div>
    </div>
  );
};

export default ForcasSVG;