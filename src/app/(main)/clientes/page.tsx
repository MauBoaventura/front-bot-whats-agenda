'use client';
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
  Grid,
  Input,
  Space,
  Table,
  Tag,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

const { useBreakpoint } = Grid;

interface AppointmentType {
  key: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  loyalty: string;
}

const mockData: AppointmentType[] = [
  {
    key: '1',
    name: 'João Silva',
    phone: '(11) 98765-4321',
    email: 'joao.silva@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    loyalty: 'VIP',
  },
  {
    key: '2',
    name: 'Maria Oliveira',
    phone: '(21) 91234-5678',
    email: 'maria.oliveira@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    loyalty: 'Regular',
  },
  {
    key: '3',
    name: 'Carlos Santos',
    phone: '(31) 99876-5432',
    email: 'carlos.santos@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    loyalty: 'Premium',
  },
  {
    key: '4',
    name: 'Ana Costa',
    phone: '(41) 98765-1234',
    email: 'ana.costa@example.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
    loyalty: 'VIP',
  },
  {
    key: '5',
    name: 'Pedro Almeida',
    phone: '(51) 91234-8765',
    email: 'pedro.almeida@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    loyalty: 'Regular',
  },
];

export default function ClientesPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [searchText, setSearchText] = useState('');
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const [loyaltyFilter, setLoyaltyFilter] = useState<string | null>(null);

  const filteredData = mockData.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchText.toLowerCase()) ||
      client.phone.includes(searchText) ||
      client.email.toLowerCase().includes(searchText.toLowerCase());

    const matchesLoyalty = !loyaltyFilter || client.loyalty === loyaltyFilter;

    return matchesSearch && matchesLoyalty;
  });

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
              <Button type="primary" icon={<UserAddOutlined />}>
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
          pagination={{ pageSize: 5, simple: isMobile }}
          size="small"
          scroll={{ x: true }}
        />
      </Card>

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
