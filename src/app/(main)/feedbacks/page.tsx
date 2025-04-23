// app/dashboard/feedbacks/page.tsx
'use client';

import { Card, List, Rate, Tag, Space, Button, Input, Select, Avatar, Divider, Badge } from 'antd';
import { SearchOutlined, FilterOutlined, StarFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

const { Search } = Input;
const { Option } = Select;

interface FeedbackType {
  id: string;
  client: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  status: 'publicado' | 'pendente' | 'arquivado';
}

export default function FeedbacksPage() {
  // Dados mockados de feedbacks
  const feedbacks: FeedbackType[] = [
    {
      id: '1',
      client: 'João Silva',
      rating: 5,
      comment: 'Atendimento excelente! O profissional foi muito atencioso e o resultado ficou perfeito.',
      date: '2023-05-15',
      service: 'Corte de Cabelo',
      status: 'publicado'
    },
    {
      id: '2',
      client: 'Maria Souza',
      rating: 4,
      comment: 'Gostei muito do serviço, porém a espera foi um pouco longa.',
      date: '2023-05-14',
      service: 'Manicure',
      status: 'publicado'
    },
    {
      id: '3',
      client: 'Carlos Oliveira',
      rating: 3,
      comment: 'Serviço razoável, mas esperava mais pela qualidade do estabelecimento.',
      date: '2023-05-12',
      service: 'Barba',
      status: 'pendente'
    },
    {
      id: '4',
      client: 'Ana Paula',
      rating: 5,
      comment: 'Melhor experiência que já tive! Recomendo a todos.',
      date: '2023-05-10',
      service: 'Coloração',
      status: 'publicado'
    },
    {
      id: '5',
      client: 'Roberto Costa',
      rating: 2,
      comment: 'Não fiquei satisfeito com o resultado final do serviço.',
      date: '2023-05-08',
      service: 'Corte Social',
      status: 'arquivado'
    },
  ];

  // Filtros
  const ratingFilters = [
    { value: 5, label: '5 estrelas' },
    { value: 4, label: '4 estrelas' },
    { value: 3, label: '3 estrelas' },
    { value: 2, label: '2 estrelas' },
    { value: 1, label: '1 estrela' },
  ];

  const statusFilters = [
    { value: 'publicado', label: 'Publicado' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'arquivado', label: 'Arquivado' },
  ];

  return (
    <div className="feedbacks-container">
      <Card
        title={
          <Space>
            <span>Avaliações dos Clientes</span>
            <Badge 
              count={feedbacks.length} 
              style={{ backgroundColor: '#1890ff' }} 
              showZero 
            />
          </Space>
        }
        extra={
          <Space wrap>
            <Select
              placeholder="Filtrar por nota"
              style={{ width: 150 }}
              allowClear
            >
              {ratingFilters.map(filter => (
                <Option key={filter.value} value={filter.value}>
                  <Space>
                    <Rate 
                      disabled 
                      value={filter.value} 
                      style={{ fontSize: 14 }} 
                      character={<StarFilled />}
                    />
                  </Space>
                </Option>
              ))}
            </Select>
            
            <Select
              placeholder="Filtrar por status"
              style={{ width: 150 }}
              allowClear
            >
              {statusFilters.map(filter => (
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
        }
      >
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            pageSize: 4,
            showSizeChanger: false,
          }}
          dataSource={feedbacks}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              extra={
                <Tag color={item.status === 'publicado' ? 'green' : 
                          item.status === 'pendente' ? 'orange' : 'gray'}>
                  {item.status.toUpperCase()}
                </Tag>
              }
            >
              <List.Item.Meta
                avatar={<Avatar size="large">{item.client.charAt(0)}</Avatar>}
                title={
                  <Space>
                    <span>{item.client}</span>
                    <Rate 
                      disabled 
                      value={item.rating} 
                      style={{ fontSize: 14 }} 
                      character={<StarFilled />}
                    />
                    <span className="text-sm text-gray-500">
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
              
              <Space>
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

      <style jsx global>{`
        .feedbacks-container {
          height: 100%;
        }
        .ant-list-item {
          padding: 16px 0 !important;
        }
        .ant-list-item-meta {
          margin-bottom: 8px !important;
        }
        .ant-card-head {
          border-bottom: none !important;
        }
        .ant-card-body {
          padding-top: 0 !important;
        }
      `}</style>
    </div>
  );
}