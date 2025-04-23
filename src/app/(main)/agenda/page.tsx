// app/dashboard/agenda/page.tsx
'use client';

import { Card, Table, Tag, Space, Button, Input, DatePicker, Badge, Avatar } from 'antd';
import { SearchOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

interface AppointmentType {
  key: string;
  time: string;
  client: string;
  service: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
  payment: 'pago' | 'pendente';
}

export default function AgendaPage() {
  // Dados mockados da agenda
  const appointments: AppointmentType[] = [
    {
      key: '1',
      time: '09:00',
      client: 'João Silva',
      service: 'Corte de Cabelo',
      status: 'confirmado',
      payment: 'pago'
    },
    {
      key: '2',
      time: '10:30',
      client: 'Maria Souza',
      service: 'Manicure Completa',
      status: 'confirmado',
      payment: 'pendente'
    },
    {
      key: '3',
      time: '14:00',
      client: 'Carlos Oliveira',
      service: 'Barba',
      status: 'pendente',
      payment: 'pendente'
    },
    {
      key: '4',
      time: '15:30',
      client: 'Ana Paula',
      service: 'Coloração',
      status: 'confirmado',
      payment: 'pago'
    },
    {
      key: '5',
      time: '16:45',
      client: 'Roberto Costa',
      service: 'Corte Social',
      status: 'cancelado',
      payment: 'pendente'
    },
  ];

  // Colunas da tabela
  const columns: ColumnsType<AppointmentType> = [
    {
      title: 'Horário',
      dataIndex: 'time',
      key: 'time',
      width: 100,
      sorter: (a, b) => a.time.localeCompare(b.time),
    },
    {
      title: 'Cliente',
      dataIndex: 'client',
      key: 'client',
      render: (text, record) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
            {text.charAt(0)}
          </Avatar>
          <span className={record.status === 'cancelado' ? 'line-through text-gray-400' : ''}>
            {text}
          </span>
        </Space>
      ),
    },

    {
      title: 'Serviço',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        switch (status) {
          case 'confirmado':
            color = 'green';
            break;
          case 'pendente':
            color = 'orange';
            break;
          case 'cancelado':
            color = 'red';
            break;
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Confirmado', value: 'confirmado' },
        { text: 'Pendente', value: 'pendente' },
        { text: 'Cancelado', value: 'cancelado' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Pagamento',
      dataIndex: 'payment',
      key: 'payment',
      render: (payment) => (
        <Tag color={payment === 'pago' ? 'green' : 'orange'}>
          {payment.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small">Editar</Button>
          <Button type="link" size="small" danger>
            {record.status === 'cancelado' ? 'Remover' : 'Cancelar'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="agenda-container">
      <Card
        title={
          <Space>
            <span>Agenda do Dia</span>
            <Badge count={appointments.length} style={{ backgroundColor: '#1890ff' }} />
          </Space>
        }
        extra={
          <Space>
            <DatePicker
              defaultValue={dayjs()}
              format="DD/MM/YYYY"
              style={{ width: 150 }}
            />
            <Input
              placeholder="Buscar cliente"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Button icon={<FilterOutlined />}>Filtrar</Button>
            <Button type="primary" icon={<PlusOutlined />}>
              Novo Agendamento
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={appointments}
          pagination={{ pageSize: 5 }}
          rowClassName={(record) =>
            record.status === 'cancelado' ? 'line-through text-gray-400' : ''
          }
        />
      </Card>
    </div>
  );
}