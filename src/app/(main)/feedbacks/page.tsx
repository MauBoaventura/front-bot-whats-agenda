'use client';

import { FilterOutlined, SearchOutlined, StarFilled } from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Input,
  List,
  Rate,
  Select,
  Space,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useEffect, useState } from 'react';

dayjs.locale('pt-br');

const { Option } = Select;
const { Search } = Input;

interface FeedbackType {
  id: string;
  client: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  status: 'publicado' | 'pendente' | 'arquivado';
}

const feedbacks: FeedbackType[] = [
  {
    id: '1',
    client: 'João Silva',
    rating: 5,
    comment:
      'Atendimento excelente! O profissional foi muito atencioso e o resultado ficou perfeito.',
    date: '2023-05-15',
    service: 'Corte de Cabelo',
    status: 'publicado',
  },
  {
    id: '2',
    client: 'Maria Souza',
    rating: 4,
    comment: 'Gostei muito do serviço, porém a espera foi um pouco longa.',
    date: '2023-05-14',
    service: 'Manicure',
    status: 'publicado',
  },
  {
    id: '3',
    client: 'Carlos Oliveira',
    rating: 3,
    comment:
      'Serviço razoável, mas esperava mais pela qualidade do estabelecimento.',
    date: '2023-05-12',
    service: 'Barba',
    status: 'pendente',
  },
  {
    id: '4',
    client: 'Ana Paula',
    rating: 5,
    comment: 'Melhor experiência que já tive! Recomendo a todos.',
    date: '2023-05-10',
    service: 'Coloração',
    status: 'publicado',
  },
  {
    id: '5',
    client: 'Roberto Costa',
    rating: 2,
    comment: 'Não fiquei satisfeito com o resultado final do serviço.',
    date: '2023-05-08',
    service: 'Corte Social',
    status: 'arquivado',
  },
];

export default function FeedbacksPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const ratingFilters = [5, 4, 3, 2, 1].map((val) => ({
    value: val,
    label: `${val} estrelas`,
  }));

  const statusFilters = [
    { value: 'publicado', label: 'Publicado' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'arquivado', label: 'Arquivado' },
  ];

  return (
    <div className="p-4">
      <Card
        title={
          <Space wrap>
            <span>Avaliações dos Clientes</span>
            <Badge count={feedbacks.length} style={{ backgroundColor: '#1890ff' }} />
          </Space>
        }
        extra={
          !isMobile && (
            <Space wrap>
              <Select placeholder="Filtrar por nota" style={{ width: 150 }} allowClear>
                {ratingFilters.map((filter) => (
                  <Option key={filter.value} value={filter.value}>
                    <Rate disabled value={filter.value} character={<StarFilled />} />
                  </Option>
                ))}
              </Select>

              <Select placeholder="Filtrar por status" style={{ width: 150 }} allowClear>
                {statusFilters.map((filter) => (
                  <Option key={filter.value} value={filter.value}>
                    {filter.label}
                  </Option>
                ))}
              </Select>

              <Search
                placeholder="Buscar feedbacks"
                allowClear
                enterButton={<SearchOutlined />}
                style={{ width: 200 }}
              />

              <Button icon={<FilterOutlined />}>Mais Filtros</Button>
            </Space>
          )
        }
      >
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            pageSize: isMobile ? 2 : 4,
            showSizeChanger: false,
          }}
          dataSource={feedbacks}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              extra={
                <Tag
                  color={
                    item.status === 'publicado'
                      ? 'green'
                      : item.status === 'pendente'
                      ? 'orange'
                      : 'gray'
                  }
                >
                  {item.status.toUpperCase()}
                </Tag>
              }
            >
              <List.Item.Meta
                avatar={<Avatar size="large">{item.client.charAt(0)}</Avatar>}
                title={
                  <Space direction={isMobile ? 'vertical' : 'horizontal'}>
                    <span className="font-medium">{item.client}</span>
                    <Rate disabled value={item.rating} character={<StarFilled />} />
                    <span className="text-gray-500 text-sm">
                      {dayjs(item.date).format('DD/MM/YYYY')}
                    </span>
                  </Space>
                }
                description={
                  <Space direction="vertical" size={4}>
                    <Tag color="blue">{item.service}</Tag>
                    <div>{item.comment}</div>
                  </Space>
                }
              />

              <Divider />

              <Space wrap>
                <Button size="small" type={item.status === 'pendente' ? 'primary' : 'default'}>
                  {item.status === 'pendente' ? 'Aprovar' : 'Editar'}
                </Button>
                <Button size="small" danger={item.status !== 'arquivado'}>
                  {item.status === 'arquivado' ? 'Excluir' : 'Arquivar'}
                </Button>
              </Space>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
