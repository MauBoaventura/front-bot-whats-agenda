'use client';
import { useMessage } from "@/hooks/useMessage";
import {
  FilterOutlined,
  MoreOutlined,
  SearchOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Drawer,
  Dropdown,
  Form,
  Grid,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

const { useBreakpoint } = Grid;

interface AppointmentType {
  key: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  loyalty: string;
}

export default function ClientesPage() {
  const screens = useBreakpoint();
  const  message  = useMessage();
  const isMobile = !screens.md;

  const [searchText, setSearchText] = useState('');
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const [loyaltyFilter, setLoyaltyFilter] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clients, setClients] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Função para buscar os clientes da API
  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clientes`);
      if (!response.ok) {
        throw new Error('Erro ao buscar clientes');
      }

      const data = await response.json();

      // Formatar os dados recebidos da API
      const formattedData: AppointmentType[] = data.map((item: any) => ({
        key: String(item.id),
        name: item.nome,
        phone: item.telefone,
        email: item.email,
        avatar: item.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 10) + 1}`,
        loyalty: item.fidelidade || 'Regular',
      }));

      setClients(formattedData);
    } catch (error) {
      console.error(error);
      message.error('Erro ao carregar os clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(); // Buscar clientes ao carregar a página
  }, []);

  const filteredData = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchText.toLowerCase()) ||
      client.phone.includes(searchText) ||
      client.email.toLowerCase().includes(searchText.toLowerCase());

    const matchesLoyalty = !loyaltyFilter || client.loyalty === loyaltyFilter;

    return matchesSearch && matchesLoyalty;
  });

    const handleCreateClient = async (values: AppointmentType) => {
    setLoading(true);
    try {
      // Enviar os dados para a API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: values.name,
          telefone: values.phone,
          email: values.email,
          fidelidade: values.loyalty,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message?.join(', ') || 'Erro ao criar cliente';
        message.error(errorMessage);
        return;
      }

      const newClient = await response.json();

      // Atualizar a lista localmente
      setClients((prev) => [
        ...prev,
        {
          key: String(newClient.id),
          name: newClient.nome,
          phone: newClient.telefone,
          email: newClient.email,
          avatar: newClient.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 10) + 1}`,
          loyalty: newClient.fidelidade || 'Regular',
        },
      ]);

      message.success('Cliente criado com sucesso!');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error('Erro ao criar o cliente');
    } finally {
      setLoading(false);
    }
  };

  const mobileColumns: ColumnsType<AppointmentType> = [
    {
      title: 'Cliente',
      render: (_, record) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <Avatar src={record.avatar} size="small" />
            <span className="font-medium">{record.name}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">{record.phone}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      render: (_, record) => (
        <Tag
          color={
            record.loyalty === 'VIP'
              ? 'gold'
              : record.loyalty === 'Premium'
              ? 'blue'
              : 'default'
          }
          className="text-xs"
        >
          {record.loyalty}
        </Tag>
      ),
    },
    {
      title: '',
      render: () => (
        <Dropdown
          menu={{
            items: [
              { key: '1', label: 'Editar' },
              { key: '2', label: 'Desativar', danger: true },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      ),
      width: 40,
    },
  ];

  const desktopColumns: ColumnsType<AppointmentType> = [
    {
      title: 'Cliente',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} />
          <span>{record.name}</span>
        </div>
      ),
    },
    { title: 'Telefone', dataIndex: 'phone' },
    { title: 'E-mail', dataIndex: 'email' },
    {
      title: 'Fidelidade',
      render: (_, record) => (
        <Tag
          color={
            record.loyalty === 'VIP'
              ? 'gold'
              : record.loyalty === 'Premium'
              ? 'blue'
              : 'default'
          }
        >
          {record.loyalty}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      render: () => (
        <Space>
          <Button size="small">Editar</Button>
          <Button size="small" danger>
            Desativar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <Card
        title="Clientes"
        extra={
          isMobile ? (
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              size="small"
              className="md:hidden"
              onClick={() => setIsModalVisible(true)}
            />
          ) : (
            <Space>
              <Input
                placeholder="Buscar cliente..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200 }}
              />
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Novo Cliente
              </Button>
            </Space>
          )
        }
      >
        {isMobile && (
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Buscar cliente..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="small"
              className="flex-1"
            />
            <Button
              icon={<FilterOutlined />}
              onClick={() => setIsFilterDrawerVisible(true)}
              size="small"
            />
          </div>
        )}

        <Table
          columns={isMobile ? mobileColumns : desktopColumns}
          dataSource={filteredData}
          loading={loading}
          pagination={{ pageSize: 5, simple: isMobile }}
          size="small"
          scroll={{ x: true }}
        />
      </Card>

      {/* Modal para criar cliente */}
      <Modal
        title="Novo Cliente"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Criar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateClient}>
          <Form.Item
            label="Nome"
            name="name"
            rules={[{ required: true, message: 'Por favor, insira o nome do cliente' }]}
          >
            <Input placeholder="Ex: João Silva" />
          </Form.Item>
          <Form.Item
            label="Telefone"
            name="phone"
            rules={[{ required: true, message: 'Por favor, insira o telefone do cliente' }]}
          >
            <Input placeholder="Ex: (11) 98765-4321" />
          </Form.Item>
          <Form.Item
            label="E-mail"
            name="email"
            rules={[{ required: false, message: 'Por favor, insira o e-mail do cliente' }]}
          >
            <Input placeholder="Ex: joao.silva@example.com" />
          </Form.Item>
          <Form.Item
            label="Nível de Fidelidade"
            name="loyalty"
            rules={[{ required: true, message: 'Por favor, selecione o nível de fidelidade' }]}
          >
            <Select placeholder="Selecione o nível de fidelidade">
              <Select.Option value="VIP">VIP</Select.Option>
              <Select.Option value="Premium">Premium</Select.Option>
              <Select.Option value="Regular">Regular</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Filtro Drawer apenas no mobile */}
      {isMobile && (
        <Drawer
          title="Filtrar Clientes"
          placement="bottom"
          open={isFilterDrawerVisible}
          onClose={() => setIsFilterDrawerVisible(false)}
          height="auto"
        >
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="font-medium mb-2">Nível de Fidelidade</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  type={!loyaltyFilter ? 'primary' : 'default'}
                  onClick={() => setLoyaltyFilter(null)}
                  size="small"
                >
                  Todos
                </Button>
                <Button
                  type={loyaltyFilter === 'VIP' ? 'primary' : 'default'}
                  onClick={() => setLoyaltyFilter('VIP')}
                  size="small"
                >
                  VIP
                </Button>
                <Button
                  type={loyaltyFilter === 'Premium' ? 'primary' : 'default'}
                  onClick={() => setLoyaltyFilter('Premium')}
                  size="small"
                >
                  Premium
                </Button>
                <Button
                  type={loyaltyFilter === 'Regular' ? 'primary' : 'default'}
                  onClick={() => setLoyaltyFilter('Regular')}
                  size="small"
                >
                  Regular
                </Button>
              </div>
            </div>
            <Button type="primary" block onClick={() => setIsFilterDrawerVisible(false)}>
              Aplicar Filtros
            </Button>
          </div>
        </Drawer>
      )}
    </div>
  );
}
