'use client'; // Necessário para hooks e interatividade

import { useState } from 'react';
import { FiCalendar, FiClock, FiEdit, FiPlus, FiStar, FiList } from 'react-icons/fi';

export default function AgendamentoPage() {
  // Estado para controlar qual seção está ativa
  const [activeSection, setActiveSection] = useState<'agenda' | 'feedbacks' | 'horario' | 'criar' | 'definir'>('agenda');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Painel de Agendamentos</h1>
        <p className="text-gray-600">Gerencie seus horários e atendimentos</p>
      </header>

      {/* Menu de Navegação */}
      <nav className="mb-8 flex flex-wrap gap-4 border-b pb-4">
        <button
          onClick={() => setActiveSection('agenda')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${activeSection === 'agenda' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <FiCalendar /> Agenda do Dia
        </button>
        <button
          onClick={() => setActiveSection('feedbacks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${activeSection === 'feedbacks' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <FiStar /> Feedbacks
        </button>
        <button
          onClick={() => setActiveSection('horario')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${activeSection === 'horario' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <FiEdit /> Editar Horário de Funcionamento
        </button>
        <button
          onClick={() => setActiveSection('criar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${activeSection === 'criar' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <FiPlus /> Criar Agendamento
        </button>
        <button
          onClick={() => setActiveSection('definir')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${activeSection === 'definir' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <FiClock /> Definir Horários de Atendimento
        </button>
      </nav>

      {/* Conteúdo Dinâmico */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeSection === 'agenda' && <AgendaDoDia />}
        {activeSection === 'feedbacks' && <Feedbacks />}
        {activeSection === 'horario' && <EditarHorarioFuncionamento />}
        {activeSection === 'criar' && <CriarAgendamento />}
        {activeSection === 'definir' && <DefinirHorariosAtendimento />}
      </div>
    </div>
  );
}

// Componentes das seções (podem ser movidos para arquivos separados)
function AgendaDoDia() {
  const appointments = [
    { id: 1, client: 'João Silva', time: '09:00', service: 'Corte de Cabelo' },
    { id: 2, client: 'Maria Souza', time: '10:30', service: 'Manicure' },
    { id: 3, client: 'Carlos Oliveira', time: '14:00', service: 'Barba' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Agenda do Dia</h2>
      <div className="space-y-4">
        {appointments.map((app) => (
          <div key={app.id} className="border p-4 rounded-lg hover:bg-gray-50">
            <p className="font-medium">{app.client}</p>
            <p className="text-gray-600">{app.time} - {app.service}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Feedbacks() {
  const feedbacks = [
    { id: 1, client: 'Ana Lima', rating: 5, comment: 'Atendimento excelente!' },
    { id: 2, client: 'Pedro Rocha', rating: 4, comment: 'Muito bom, mas demorou um pouco.' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Feedbacks</h2>
      <div className="space-y-4">
        {feedbacks.map((fb) => (
          <div key={fb.id} className="border p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`${i < fb.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="font-medium">{fb.client}</p>
            </div>
            <p className="mt-2 text-gray-700">{fb.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditarHorarioFuncionamento() {
  const [horario, setHorario] = useState({
    segunda: { aberto: true, inicio: '08:00', fim: '18:00' },
    terca: { aberto: true, inicio: '08:00', fim: '18:00' },
    // ... outros dias
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Editar Horário de Funcionamento</h2>
      <div className="space-y-4">
        {Object.entries(horario).map(([dia, info]) => (
          <div key={dia} className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={info.aberto}
                onChange={(e) => setHorario({ ...horario, [dia]: { ...info, aberto: e.target.checked } })}
              />
              <span className="capitalize font-medium">{dia}</span>
            </label>
            {info.aberto && (
              <div className="flex gap-2">
                <input
                  type="time"
                  value={info.inicio}
                  onChange={(e) => setHorario({ ...horario, [dia]: { ...info, inicio: e.target.value } })}
                  className="border p-2 rounded"
                />
                <span>às</span>
                <input
                  type="time"
                  value={info.fim}
                  onChange={(e) => setHorario({ ...horario, [dia]: { ...info, fim: e.target.value } })}
                  className="border p-2 rounded"
                />
              </div>
            )}
          </div>
        ))}
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Salvar Horários
        </button>
      </div>
    </div>
  );
}

function CriarAgendamento() {
  const [form, setForm] = useState({
    cliente: '',
    servico: '',
    data: '',
    horario: '',
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Criar Agendamento</h2>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Cliente</label>
          <input
            type="text"
            value={form.cliente}
            onChange={(e) => setForm({ ...form, cliente: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Serviço</label>
          <input
            type="text"
            value={form.servico}
            onChange={(e) => setForm({ ...form, servico: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Data</label>
          <input
            type="date"
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Horário</label>
          <input
            type="time"
            value={form.horario}
            onChange={(e) => setForm({ ...form, horario: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Agendar
        </button>
      </form>
    </div>
  );
}

function DefinirHorariosAtendimento() {
  const [intervalos, setIntervalos] = useState([
    { inicio: '08:00', fim: '12:00' },
    { inicio: '13:00', fim: '18:00' },
  ]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Definir Horários de Atendimento</h2>
      <div className="space-y-4">
        {intervalos.map((intervalo, index) => (
          <div key={index} className="flex items-center gap-4">
            <input
              type="time"
              value={intervalo.inicio}
              onChange={(e) => {
                const novosIntervalos = [...intervalos];
                novosIntervalos[index].inicio = e.target.value;
                setIntervalos(novosIntervalos);
              }}
              className="border p-2 rounded"
            />
            <span>às</span>
            <input
              type="time"
              value={intervalo.fim}
              onChange={(e) => {
                const novosIntervalos = [...intervalos];
                novosIntervalos[index].fim = e.target.value;
                setIntervalos(novosIntervalos);
              }}
              className="border p-2 rounded"
            />
            <button
              onClick={() => setIntervalos(intervalos.filter((_, i) => i !== index))}
              className="text-red-500 hover:text-red-700"
            >
              Remover
            </button>
          </div>
        ))}
        <button
          onClick={() => setIntervalos([...intervalos, { inicio: '', fim: '' }])}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
        >
          <FiPlus /> Adicionar Intervalo
        </button>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Salvar Horários
        </button>
      </div>
    </div>
  );
}