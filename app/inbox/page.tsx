"use client";
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const lecciones = [
  { mes: 'Marzo', temas: ['Simulación de redes', 'Python', 'Structured Query Language', 'Iniciando en C++', 'Ciberseguridad', 'User experience'] },
  { mes: 'Febrero', temas: ['Crear procesos en C', 'Internet of Things', 'Creación de páginas web', 'Array vacío en C++', 'Árbol de búsqueda binaria'] },
  { mes: 'Enero', temas: ['Introducción a la programación', 'Algoritmos de búsqueda', 'Estructuras de datos', 'Programación orientada a objetos', 'Ciclos en C++'] },
  { mes: 'Diciembre', temas: ['Introducción a la programación', 'Algoritmos de búsqueda', 'Estructuras de datos', 'Programación orientada a objetos', 'Ciclos en C++'] },
  { mes: 'Noviembre', temas: ['Introducción a la programación', 'Algoritmos de búsqueda', 'Estructuras de datos', 'Programación orientada a objetos', 'Ciclos en C++'] },
];

export default function InboxPage() {
  const [temaSeleccionado, setTemaSeleccionado] = useState('');

  return (
    <div className='flex h-screen bg-fondo overflow-hidden'>
      <Sidebar onSelectTema={setTemaSeleccionado} />
      <div className="flex-1 flex flex-col p-5">
        <div className='flex-1 flex flex-col'>
          <Historial temaSeleccionado={temaSeleccionado} />
          <div className='flex-1 flex flex-col justify-end'>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ onSelectTema }: { onSelectTema: React.Dispatch<React.SetStateAction<string>> }) {
  return (
    <div className='flex-1 flex flex-col bg-logo p-5 rounded-xl'>
      <ScrollArea>
        <div className='flex flex-col space-y-4'>
          {lecciones.map((leccion, index) => (
            <div key={index}>
              <h3 className='text-white font-bold text-3xl'>{leccion.mes}</h3>
              {leccion.temas.map((tema, idx) => (
                <div
                  key={idx}
                  className='cursor-pointer text-1xl text-white hover:underline'
                  onClick={() => onSelectTema(tema)}
                >
                  {tema}
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function Historial({ temaSeleccionado }: { temaSeleccionado: string }) {
  const historial = temaSeleccionado || "Selecciona una lección de la barra lateral para ver su contenido aquí.";
  
  return (
    <div className='flex flex-col'>
      <div className='HistorialTitle text-white font-inherit text-3xl text-center mt-24 ml-2'>
        Historial
        <div className='HistorialContainer w-[950px] rounded-lg mt-2 ml-12 mr-12'>
          <h4 className='HistorialText text-white font-inherit text-2xl text-center mt-4'>
            {historial}
          </h4>
        </div>
      </div>
    </div>
  );
}
