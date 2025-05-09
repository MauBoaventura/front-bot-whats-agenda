'use client';

import { useMessage } from '@/hooks/useMessage';
import { get, post, put } from '@/services'; // Importa os métodos centralizados
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

interface ServiceType {
  id: string;
  nome: string;
  duracao: number;
  preco: number;
  categoria: string;
  status: boolean;
}

export default function ServicosPage() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const message = useMessage();

  // Função para buscar os serviços da API
  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await get('/servicos'); // Usando o serviço `get`
      const formattedData: ServiceType[] = data.map((item: any) => ({
        id: String(item.id),
        nome: item.nome,
        duracao: item.duracao,
        preco: parseFloat(item.preco),
        categoria: item.categoria,
        status: item.status,
      }));
      setServices(formattedData);
    } catch (error) {
      console.error(error);
      message.error('Erro ao carregar os serviços');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateService = async (values: any) => {
    setLoading(true);
    try {
      const newService: ServiceType = {
        id: values.id || null,
        nome: values.nome,
        duracao: values.duracao,
        preco: values.preco,
        categoria: values.categoria,
        status: values.status,
      };

      if (!newService.id) {
        // Criação de um novo serviço
        const createdService = await post('/servicos', newService); // Usando o serviço `post`
        setServices((prevServices) => [...prevServices, createdService]);
        message.success('Serviço criado com sucesso!');
      } else {
        // Atualização de um serviço existente
        const updatedService = await put(`/servicos/${newService.id}`, newService); // Usando o serviço `put`
        setServices((prevServices) =>
          prevServices.map((s) => (s.id === updatedService.id ? updatedService : s))
        );
        message.success('Serviço atualizado com sucesso!');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error('Erro ao salvar o serviço');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleServiceStatus = async (service: ServiceType) => {
    setLoading(true);
    try {
      const updatedService = { ...service, status: !service.status };
      const response = await put(`/servicos/${service.id}`, updatedService); // Usando o serviço `put`
      setServices((prevServices) =>
        prevServices.map((s) => (s.id === service.id ? response : s))
      );
      message.success(
        `Serviço ${updatedService.status ? 'ativado' : 'desativado'} com sucesso!`
      );
    } catch (error) {
      console.error(error);
      message.error('Erro ao atualizar o status do serviço');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(); // Busca os serviços ao carregar a página

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Executa na primeira renderização
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sharedColumns: ColumnsType<ServiceType> = [
    {
      title: 'Nome',
      dataIndex: 'nome',
    },
    {
      title: 'Duração (min)',
      dataIndex: 'duracao',
      render: (value) => `${value} min`,
    },
    {
      title: 'Preço',
      dataIndex: 'preco',
      render: (value) => `R$ ${value.toFixed(2)}`,
    },
    {
      title: 'Categoria',
      dataIndex: 'categoria',
      render: (cat) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Ativo' : 'Inativo'}
        </Tag>
      ),
    },
    {
      title: '',
      align: 'right',
      width: 50,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: 'Editar',
                onClick: () => handleEditService(record),
              },
              {
                key: 'disable',
                label: record.status ? 'Desativar' : 'Ativar',
                danger: record.status,
                onClick: () => handleToggleServiceStatus(record),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text">⋮</Button>
        </Dropdown>
      ),
    },
  ];

  const mobileColumns: ColumnsType<ServiceType> = [
    {
      title: 'Serviço',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-medium">{record.nome}</span>
          <div className="text-xs text-gray-500">
            {record.duracao} min • R$ {record.preco.toFixed(2)}
          </div>
          <div className="text-xs pt-1">
            <Tag color="blue">{record.categoria}</Tag>{' '}
            <Tag color={record.status ? 'green' : 'red'}>
              {record.status ? 'Ativo' : 'Inativo'}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: '',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: 'Editar',
                onClick: () => handleEditService(record),
              },
              {
                key: 'disable',
                label: record.status ? 'Desativar' : 'Ativar',
                danger: record.status,
                onClick: () => handleToggleServiceStatus(record),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text">⋮</Button>
        </Dropdown>
      ),
      width: 40,
    },
  ];

  const handleEditService = (service: ServiceType) => {
    form.setFieldsValue(service);
    setIsModalVisible(true);
  };

  return (
    <div className="p-4">
      <Card
        title="Serviços"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="small"
            onClick={() => setIsModalVisible(true)}
          >
            Adicionar Serviço
          </Button>
        }
      >
        <Table
          columns={isMobile ? mobileColumns : sharedColumns}
          dataSource={services}
          loading={loading}
          pagination={{ pageSize: 5, simple: true }}
          size="small"
          scroll={{ x: true }}
          rowKey="id"
        />
      </Card>

      <Modal
        title={form.getFieldValue('id') ? 'Editar Serviço' : 'Criar Serviço'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
        okText={form.getFieldValue('id') ? 'Salvar' : 'Criar'}
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateOrUpdateService}
        >
          <Form.Item label="ID" name="id" hidden={!form.getFieldValue('id')}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Nome"
            name="nome"
            rules={[{ required: true, message: 'Por favor, insira o nome do serviço' }]}
          >
            <Input placeholder="Ex: Corte Masculino" />
          </Form.Item>
          <Form.Item
            label="Duração (min)"
            name="duracao"
            rules={[{ required: true, message: 'Por favor, insira a duração do serviço' }]}
          >
            <InputNumber min={15} max={180} placeholder="Ex: 30" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Preço (R$)"
            name="preco"
            rules={[{ required: true, message: 'Por favor, insira o preço do serviço' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              placeholder="Ex: 50.00"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            label="Categoria"
            name="categoria"
            rules={[{ required: true, message: 'Por favor, selecione a categoria' }]}
          >
            <Select placeholder="Selecione uma categoria">
              <Select.Option value="Cabelo">Cabelo</Select.Option>
              <Select.Option value="Unhas">Unhas</Select.Option>
              <Select.Option value="Estética">Estética</Select.Option>
              <Select.Option value="Bem-estar">Bem-estar</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Por favor, selecione o status' }]}
          >
            <Select placeholder="Selecione o status">
              <Select.Option value={true}>Ativo</Select.Option>
              <Select.Option value={false}>Inativo</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
