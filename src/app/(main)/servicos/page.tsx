'use client';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  InputNumber,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

interface ServiceType {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
  active: boolean;
}

export default function ServicosPage() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);

  // Função para buscar os serviços da API
  const fetchServices = async () => {
    setLoading(true);
    try {alert(`${process.env.NEXT_PUBLIC_API_BASE_URL}/servicos`)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/servicos`);
      if (!response.ok) {
        throw new Error('Erro ao buscar serviços');
      }

      // Dados recebidos da API
      const data: any[] = await response.json();

      // Converter os dados para o formato da entidade Servico
      const formattedData: ServiceType[] = data.map((item) => ({
        id: String(item.id), // Convertendo para string, se necessário
        name: item.nome, // Mapeando 'nome' para 'name'
        duration: item.duracao, // Mapeando 'duracao' para 'duration'
        price: parseFloat(item.preco), // Garantindo que 'preco' seja um número
        category: item.categoria, // Mapeando 'categoria' para 'category'
        active: item.status, // Mapeando 'status' para 'active'
      }));

      setServices(formattedData);
    } catch (error) {
      console.error(error);
      message.error('Erro ao carregar os serviços');
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
      dataIndex: 'name',
    },
    {
      title: 'Duração (min)',
      dataIndex: 'duration',
      render: (value, record, index) => (
        <InputNumber
          min={15}
          max={180}
          defaultValue={value}
          onChange={(val) => {
            const newServices = [...services];
            newServices[index].duration = val ?? 0;
            setServices(newServices);
          }}
          size="small"
        />
      ),
    },
    {
      title: 'Preço',
      dataIndex: 'price',
      render: (value) => `R$ ${value.toFixed(2)}`,
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      render: (cat) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'active',
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Ativo' : 'Inativo'}
        </Tag>
      ),
    },
  ];

  const mobileColumns: ColumnsType<ServiceType> = [
    {
      title: 'Serviço',
      render: (_, record, index) => (
        <div className="flex flex-col">
          <span className="font-medium">{record.name}</span>
          <div className="text-xs text-gray-500">
            {record.duration} min • R$ {record.price.toFixed(2)}
          </div>
          <div className="text-xs pt-1">
            <Tag color="blue">{record.category}</Tag>{' '}
            <Tag color={record.active ? 'green' : 'red'}>
              {record.active ? 'Ativo' : 'Inativo'}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: '',
      render: () => (
        <Dropdown
          menu={{
            items: [
              { key: 'edit', label: 'Editar' },
              { key: 'disable', label: 'Desativar', danger: true },
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

  return (
    <div className="p-4">
      <Card
        title="Serviços"
        extra={
          <Button type="primary" icon={<PlusOutlined />} size="small">
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
    </div>
  );
}
