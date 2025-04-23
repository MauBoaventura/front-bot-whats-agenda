// app/dashboard/criar-agendamento/page.tsx
'use client';

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
import { useState } from 'react';

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
  const [loading, setLoading] = useState(false);

  // Dados mockados
  const clients: ClientType[] = [
    { id: '1', name: 'João Silva', phone: '(11) 99999-9999', email: 'joao@email.com' },
    { id: '2', name: 'Maria Souza', phone: '(11) 98888-8888', email: 'maria@email.com' },
    { id: '3', name: 'Carlos Oliveira', phone: '(11) 97777-7777', email: 'carlos@email.com' },
  ];

  const services: ServiceType[] = [
    { id: '1', name: 'Corte de Cabelo', duration: 30, price: 50 },
    { id: '2', name: 'Barba', duration: 20, price: 30 },
    { id: '3', name: 'Manicure', duration: 45, price: 40 },
    { id: '4', name: 'Coloração', duration: 90, price: 120 },
  ];

  const professionals = [
    { id: '1', name: 'Ana Paula' },
    { id: '2', name: 'Roberto Carlos' },
    { id: '3', name: 'Juliana Santos' },
  ];

  const onFinish = async (values: { date: dayjs.Dayjs; time: dayjs.Dayjs }) => {
    setLoading(true);
    try {
      // Simular chamada API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Dados do agendamento:', {
        ...values,
        client: selectedClient,
        service: selectedService,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
      });

      message.success('Agendamento criado com sucesso!');
      form.resetFields();
      setSelectedClient(null);
      setSelectedService(null);
    } catch {
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
                rules={[{ required: true, message: 'Selecione um profissional' }]}
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