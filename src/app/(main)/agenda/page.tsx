// app/dashboard/agenda/page.tsx
'use client';

import { FilterOutlined, MoreOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Card, DatePicker, Drawer, Dropdown, Input, MenuProps, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useState } from 'react';

dayjs.locale('pt-br');

interface AppointmentType {
  key: string;
  time: string;
  client: string;
  service: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
  payment: 'pago' | 'pendente';
}

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

export default function AgendaPage() {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Adicione no topo do seu componente (dentro do AgendaPage)
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string | null>(null);

  // Atualize a função de filtragem
  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch =
      appt.client.toLowerCase().includes(searchText.toLowerCase()) ||
      appt.service.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = !statusFilter || appt.status === statusFilter;
    const matchesPayment = !paymentFilter || appt.payment === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });



  // Colunas simplificadas para mobile
  const mobileColumns: ColumnsType<AppointmentType> = [
    {
      title: 'Horário',
      dataIndex: 'time',
      key: 'time',
      width: 80,
      sorter: (a, b) => a.time.localeCompare(b.time),
    },
    {
      title: 'Cliente/Serviço',
      key: 'clientService',
      render: (_, record) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <Avatar size="small" style={{ backgroundColor: '#1890ff', marginRight: 8 }}>
              {record.client.charAt(0)}
            </Avatar>
            <span className={record.status === 'cancelado' ? 'line-through text-gray-400' : ''}>
              {record.client}
            </span>
          </div>
          <span className="text-xs text-gray-500">{record.service}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'statusPayment',
      width: 100,
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Tag
            color={
              record.status === 'confirmado' ? 'green' :
                record.status === 'pendente' ? 'orange' : 'red'
            }
            className="text-xs"
          >
            {record.status.toUpperCase()}
          </Tag>
          <Tag
            color={record.payment === 'pago' ? 'green' : 'orange'}
            className="text-xs"
          >
            {record.payment.toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 40,
      render: (_, record) => {
        const items: MenuProps['items'] = [
          {
            key: '1',
            label: 'Editar',
          },
          {
            key: '2',
            label: record.status === 'cancelado' ? 'Remover' : 'Cancelar',
            danger: true,
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        );
      },
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
    <div className="agenda-container p-2">
      <Card
        title={
          <Space>
        <span>Agenda do Dia</span>
        <Badge count={filteredAppointments.length} style={{ backgroundColor: '#1890ff' }} />
          </Space>
        }
        extra={
          <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsDrawerVisible(true)}
        size="small"
          />
        }
      >
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex gap-2">
        <DatePicker
          defaultValue={dayjs()}
          format="DD/MM/YYYY"
          style={{ width: '100%' }}
          size="small"
        />
        <Button
          icon={<FilterOutlined />}
          onClick={() => setIsDrawerVisible(true)}
          size="small"
        />
          </div>
          <Input
        placeholder="Buscar cliente ou serviço"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        size="small"
          />
        </div>

        <Table
          columns={window.innerWidth <= 768 ? mobileColumns : columns}
          dataSource={filteredAppointments}
          pagination={{ pageSize: 5, simple: true }}
          rowClassName={(record) =>
        record.status === 'cancelado' ? 'line-through text-gray-400' : ''
          }
          scroll={{ x: true }}
          size="small"
        />
      </Card>

      <Drawer
        title="Filtros e Ações"
        placement="bottom"
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        height="auto"
      >
        <div className="flex flex-col gap-4">
          <Button type="primary" icon={<PlusOutlined />} block>
            Novo Agendamento
          </Button>

          <div>
            <h4 className="font-medium mb-2">Filtrar por Status</h4>
            <div className="flex flex-wrap gap-2">
              <Tag.CheckableTag
                checked={!statusFilter}
                onChange={() => setStatusFilter(null)}
              >
                Todos
              </Tag.CheckableTag>
              <Tag.CheckableTag
                checked={statusFilter === 'confirmado'}
                onChange={() => setStatusFilter('confirmado')}
              >
                Confirmados
              </Tag.CheckableTag>
              <Tag.CheckableTag
                checked={statusFilter === 'pendente'}
                onChange={() => setStatusFilter('pendente')}
              >
                Pendentes
              </Tag.CheckableTag>
              <Tag.CheckableTag
                checked={statusFilter === 'cancelado'}
                onChange={() => setStatusFilter('cancelado')}
              >
                Cancelados
              </Tag.CheckableTag>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Filtrar por Pagamento</h4>
            <div className="flex flex-wrap gap-2">
              <Tag.CheckableTag
                checked={!paymentFilter}
                onChange={() => setPaymentFilter(null)}
              >
                Todos
              </Tag.CheckableTag>
              <Tag.CheckableTag
                checked={paymentFilter === 'pago'}
                onChange={() => setPaymentFilter('pago')}
              >
                Pagos
              </Tag.CheckableTag>
              <Tag.CheckableTag
                checked={paymentFilter === 'pendente'}
                onChange={() => setPaymentFilter('pendente')}
              >
                Pendentes
              </Tag.CheckableTag>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}