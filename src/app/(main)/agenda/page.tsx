// app/dashboard/agenda/page.tsx
'use client';

import { useMessage } from '@/hooks/useMessage';
import { get, post, put } from '@/services'; // Importa as funções do serviço
import { FilterOutlined, MoreOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Card, DatePicker, Drawer, Dropdown, Form, Input, Modal, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

dayjs.locale('pt-br');

interface AppointmentType {
  key: string;
  time: string;
  client: string;
  service: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
  payment: 'nao_pago' | 'pago' | 'em_processamento';
}

const paymentLabels: Record<string, string> = {
  nao_pago: 'Não Pago',
  pago: 'Pago',
  em_processamento: 'Em Processamento',
};

export default function AgendaPage() {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [services, setServices] = useState<{ id: string; nome: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const message = useMessage();

  // Função para buscar os serviços da API
  const fetchServices = async () => {
    try {
      const data = await get('/servicos'); // Usando o serviço `get`
      setServices(data);
    } catch (error) {
      console.error(error);
      message.error('Erro ao carregar os serviços');
    }
  };

  // Função para buscar os dados da agenda
  const fetchAppointments = async (date: string) => {
    setLoading(true);
    try {
      const data = await get('/agenda', { date }); // Usando o serviço `get` com parâmetros
      const formattedData = data.map((item: any) => ({
        key: item.id.toString(),
        time: item.horario,
        client: item.clienteNome || item.clienteTelefone,
        service: item.servico.nome,
        status: item.status,
        payment: item.statusPagamento,
      }));
      setAppointments(formattedData);
    } catch (error) {
      console.error(error);
      message.error('Erro ao carregar os agendamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchAppointments(selectedDate.format('YYYY-MM-DD'));
  }, [selectedDate]);

  // Função para editar um agendamento
  const handleEditAppointment = (appointment: AppointmentType) => {
    form.setFieldsValue(appointment);
    setIsModalVisible(true);
  };

  // Função para cancelar um agendamento
  const handleCancelAppointment = async (appointment: AppointmentType) => {
    setLoading(true);
    try {
      await put(`/agenda/${appointment.key}`, { status: 'cancelado' }); // Usando o serviço `put`
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.key === appointment.key ? { ...appt, status: 'cancelado' } : appt
        )
      );
      message.success('Agendamento cancelado com sucesso!');
    } catch (error) {
      console.error(error);
      message.error('Erro ao cancelar o agendamento');
    } finally {
      setLoading(false);
    }
  };

  // Função para salvar alterações no agendamento
  const handleSaveAppointment = async (values: AppointmentType) => {
    setLoading(true);
    try {
      const transformedData = {
        clienteTelefone: values.client,
        clienteNome: values.client,
        servico: values.service,
        horario: values.time,
        status: values.status,
        statusPagamento: values.payment,
        lembreteEnviado: false,
      };

      const response = values.key
        ? await put(`/agenda/${values.key}`, transformedData) // Atualização
        : await post('/agenda', transformedData); // Criação

      const updatedAppointment = response;
      const formattedAppointment = {
        key: updatedAppointment.id.toString(),
        time: updatedAppointment.horario,
        client: updatedAppointment.clienteNome || updatedAppointment.clienteTelefone,
        service: updatedAppointment.servico.nome,
        status: updatedAppointment.status,
        payment: updatedAppointment.statusPagamento,
      };

      setAppointments((prev) =>
        values.key
          ? prev.map((appt) => (appt.key === values.key ? { ...appt, ...formattedAppointment } : appt))
          : [...prev, formattedAppointment]
      );

      message.success('Agendamento salvo com sucesso!');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error('Erro ao salvar o agendamento');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch =
      appt.client.toLowerCase().includes(searchText.toLowerCase()) ||
      appt.service.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = !statusFilter || appt.status === statusFilter;
    const matchesPayment = !paymentFilter || appt.payment === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  //criar uma variavel para armazenar o valor da largura de tela e caso mude a largura de tela, atualizar o valor da variavel 
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Atualiza imediatamente caso o componente monte com tamanho diferente
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            color={
              record.payment === 'pago'
                ? 'green'
                : record.payment === 'em_processamento'
                  ? 'blue'
                  : 'red'
            }
            className="text-xs"
          >
            {paymentLabels[record.payment].toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 40,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: 'Editar',
                onClick: () => handleEditAppointment(record),
              },
              {
                key: 'cancel',
                label: 'Cancelar',
                danger: true,
                onClick: () => handleCancelAppointment(record),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      ),
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
        <Tag
          color={
            payment === 'pago'
              ? 'green'
              : payment === 'em_processamento'
                ? 'blue'
                : 'red'
          }
        >
          {paymentLabels[payment].toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: 'Editar',
                onClick: () => handleEditAppointment(record),
              },
              {
                key: 'cancel',
                label: 'Cancelar',
                danger: true,
                onClick: () => handleCancelAppointment(record),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
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
              value={selectedDate}
              onChange={(date) => setSelectedDate(date || dayjs())} // Atualiza a data selecionada
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
          columns={screenWidth <= 768 ? mobileColumns : columns}
          dataSource={filteredAppointments}
          loading={loading} // Adiciona o estado de carregamento
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
          <Button type="primary" icon={<PlusOutlined />} block
            onClick={() => router.push('/agendamento')}
          >
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

      {/* Modal para editar agendamento */}
      <Modal
        title="Editar Agendamento"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveAppointment}
        >
          <Form.Item name="key" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Cliente"
            name="client"
            rules={[{ required: true, message: 'Por favor, insira o nome do cliente' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Serviço"
            name="service"
            rules={[{ required: true, message: 'Por favor, selecione o serviço' }]}
          >
            <Select placeholder="Selecione um serviço">
              {services.map((service) => (
                <Select.Option key={service.id} value={service.id}>
                  {service.nome}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Horário"
            name="time"
            rules={[{ required: true, message: 'Por favor, insira o horário' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Por favor, selecione o status' }]}
          >
            <Select>
              <Select.Option value="confirmado">Confirmado</Select.Option>
              <Select.Option value="pendente">Pendente</Select.Option>
              <Select.Option value="cancelado">Cancelado</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Pagamento"
            name="payment"
            rules={[{ required: true, message: 'Por favor, selecione o status de pagamento' }]}
          >
            <Select>
              <Select.Option value="pago">Pago</Select.Option>
              <Select.Option value="em_processamento">Em Processamento</Select.Option>
              <Select.Option value="nao_pago">Não Pago</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}