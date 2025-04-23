// app/dashboard/clientes/page.tsx
'use client';
import { Table, Tag, Input, Button, Space, Avatar, Card } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';

const mockData = [
  {
    key: '1',
    name: 'João Silva',
    phone: '(11) 98765-4321',
    email: 'joao.silva@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    key: '2',
    name: 'Maria Oliveira',
    phone: '(21) 91234-5678',
    email: 'maria.oliveira@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    key: '3',
    name: 'Carlos Santos',
    phone: '(31) 99876-5432',
    email: 'carlos.santos@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    key: '4',
    name: 'Ana Costa',
    phone: '(41) 98765-1234',
    email: 'ana.costa@example.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    key: '5',
    name: 'Pedro Almeida',
    phone: '(51) 91234-8765',
    email: 'pedro.almeida@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
];

export default function ClientesPage() {
  return (
    <div className="p-6">
      <Card
        title="Clientes"
        extra={
          <Space>
            <Input 
              placeholder="Buscar cliente..." 
              prefix={<SearchOutlined />} 
              style={{ width: 200 }}
            />
            <Button type="primary" icon={<UserAddOutlined />}>
              Novo Cliente
            </Button>
          </Space>
        }
      >
        <Table
          columns={[
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
              render: () => <Tag color="gold">VIP</Tag>,
            },
            {
              title: 'Ações',
              render: () => (
                <Space>
                  <Button size="small">Editar</Button>
                  <Button size="small" danger>Desativar</Button>
                </Space>
              ),
            },
          ]}
          dataSource={mockData}
        />
      </Card>
    </div>
  );
}