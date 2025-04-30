// app/dashboard/criar-agendamento/page.tsx
'use client';

import { get, post } from '@/services'; // Importa os métodos centralizados
import {
  PhoneOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Tag,
  TimePicker
} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useEffect, useState } from 'react';

dayjs.locale('pt-br');

const { Option } = Select;
const { TextArea } = Input;

interface ClientType {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface ServiceType {
  id: string;
  name: string;
  duration: number; // em minutos
  price: number;
}

export default function CriarAgendamentoPage() {
  const [form] = Form.useForm();
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(false);

  const professionals = [
    { id: '1', name: 'Ana Paula' },
    { id: '2', name: 'Roberto Carlos' },
    { id: '3', name: 'Juliana Santos' },
  ];

  // Função para buscar os serviços da API
  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await get('/servicos'); // Usando o serviço `get`
      const formattedServices: ServiceType[] = data
        .filter((item: any) => item.status === true)
        .map((item: any) => ({
          id: String(item.id),
          name: item.nome,
          duration: item.duracao,
          price: parseFloat(item.preco),
        }));

      setServices(formattedServices);
    } catch (error) {
      console.error(error);
      message.error('Erro ao carregar os serviços');
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar os clientes da API
  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await get('/clientes'); // Usando o serviço `get`
      const formattedClients: ClientType[] = data.map((item: any) => ({
        id: String(item.id),
        name: item.nome,
        phone: item.telefone,
        email: item.email,
      }));

      setClients(formattedClients);
    } catch (error) {
      console.error(error);
      message.error('Erro ao carregar os clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(); // Buscar clientes ao carregar a página
    fetchServices(); // Buscar serviços ao carregar a página
  }, []);

  const onFinish = async () => {
    setLoading(true);
    try {
      const formData = form.getFieldsValue();
      const selectedClient = clients.find(c => c.id === formData.client);

      const dataHora = new Date(
        formData.date.year(),
        formData.date.month(),
        formData.date.date(),
        formData.time.hour(),
        formData.time.minute()
      );

      const appointmentData = {
        clienteTelefone: selectedClient?.phone || '',
        clienteNome: selectedClient?.name,
        servico: formData.service,
        profissional: formData.professional ? { id: formData.professional } : undefined,
        data: dataHora,
        horario: formData.time.format('HH:mm'),
        observacao: formData.notes || undefined,
        status: 'pendente',
        statusPagamento: 'nao_pago',
        lembreteEnviado: false,
      };

      console.log('Dados que serão enviados:', appointmentData);

      await post('/agendamento', appointmentData); // Usando o serviço `post`

      message.success('Agendamento criado com sucesso!');
      form.resetFields();
      setSelectedClient(null);
      setSelectedService(null);
    } catch (error) {
      console.error(error);
      message.error('Erro ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-appointment-container">
      <Card
        title="Novo Agendamento"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => form.submit()}
            loading={loading}
          >
            Confirmar Agendamento
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            date: dayjs(),
            time: dayjs().add(1, 'hour').startOf('hour'),
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Divider orientation="left">Cliente</Divider>

              <Form.Item
                label="Buscar Cliente"
                name="client"
                rules={[{ required: true, message: 'Selecione um cliente' }]}
              >
                <Select
                  showSearch
                  placeholder="Digite para buscar cliente"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (String(option?.label) ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(value) => {
                    const client = clients.find(c => c.id === value);
                    setSelectedClient(client || null);
                  }}
                  options={clients.map(client => ({
                    value: client.id,
                    label: (
                      <Space>
                        <Avatar size="small" icon={<UserOutlined />} />
                        <span>{client.name}</span>
                        <Tag>{client.phone}</Tag>
                      </Space>
                    ),
                  }))}
                />
              </Form.Item>

              {selectedClient && (
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <Space direction="vertical">
                    <Space>
                      <Avatar size="large" icon={<UserOutlined />} />
                      <div>
                        <h4>{selectedClient.name}</h4>
                        <p><PhoneOutlined /> {selectedClient.phone}</p>
                        <p>{selectedClient.email}</p>
                      </div>
                    </Space>
                  </Space>
                </div>
              )}
            </Col>

            <Col span={12}>
              <Divider orientation="left">Serviço</Divider>

              <Form.Item
                label="Selecione o Serviço"
                name="service"
                rules={[{ required: true, message: 'Selecione um serviço' }]}
              >
                <Select
                  placeholder="Selecione um serviço"
                  onChange={(value) => {
                    const service = services.find(s => s.id === value);
                    setSelectedService(service || null);
                  }}
                >
                  {services.map(service => (
                    <Option key={service.id} value={service.id}>
                      <Space>
                        <span>{service.name}</span>
                        <Tag>{service.duration} min</Tag>
                        <Tag color="green">R$ {service.price.toFixed(2)}</Tag>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {selectedService && (
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <Space direction="vertical">
                    <h4>Detalhes do Serviço</h4>
                    <p><strong>Duração:</strong> {selectedService.duration} minutos</p>
                    <p><strong>Preço:</strong> R$ {selectedService.price.toFixed(2)}</p>
                  </Space>
                </div>
              )}
            </Col>
          </Row>

          <Divider />

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="Data"
                name="date"
                rules={[{ required: true, message: 'Selecione uma data' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf('day');
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Horário"
                name="time"
                rules={[{ required: true, message: 'Selecione um horário' }]}
              >
                <TimePicker
                  style={{ width: '100%' }}
                  format="HH:mm"
                  minuteStep={15}
                  showNow={false}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Profissional"
                name="professional"
                rules={[{ required: false, message: 'Selecione um profissional' }]}
              >
                <Select placeholder="Selecione o profissional">
                  {professionals.map(pro => (
                    <Option key={pro.id} value={pro.id}>{pro.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Observações"
            name="notes"
          >
            <TextArea rows={4} placeholder="Adicione alguma observação importante..." />
          </Form.Item>
        </Form>
      </Card>

      <style jsx global>{`
        .create-appointment-container {
          height: 100%;
        }
        .client-info, .service-info {
          background: #f9f9f9;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        .ant-card-head {
          border-bottom: none !important;
        }
        .ant-divider {
          margin-top: 0 !important;
        }
      `}</style>
    </div>
  );
}