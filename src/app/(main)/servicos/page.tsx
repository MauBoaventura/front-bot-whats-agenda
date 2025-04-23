// app/dashboard/servicos/page.tsx
'use client';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, InputNumber, Table, Tag } from 'antd';
import { useState } from 'react';

export default function ServicosPage() {
  const [services, setServices] = useState([
    {
      id: '1',
      name: 'Corte Masculino',
      duration: 30,
      price: 50,
      category: 'Cabelo',
      active: true,
    },
    {
      id: '2',
      name: 'Corte Feminino',
      duration: 60,
      price: 80,
      category: 'Cabelo',
      active: true,
    },
    {
      id: '3',
      name: 'Manicure',
      duration: 40,
      price: 30,
      category: 'Unhas',
      active: true,
    },
    {
      id: '4',
      name: 'Pedicure',
      duration: 50,
      price: 40,
      category: 'Unhas',
      active: true,
    },
    {
      id: '5',
      name: 'Massagem Relaxante',
      duration: 90,
      price: 120,
      category: 'Bem-estar',
      active: true,
    },
    {
      id: '6',
      name: 'Limpeza de Pele',
      duration: 60,
      price: 100,
      category: 'Estética',
      active: true,
    },
  ]);

  return (
    <div className="p-6">
      <Card
        title="Serviços"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Adicionar Serviço
          </Button>
        }
      >
        <Table
          columns={[
            { title: 'Nome', dataIndex: 'name' },
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
                    newServices[index].duration = val;
                    setServices(newServices);
                  }}
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
          ]}
          dataSource={services}
        />
      </Card>
    </div>
  );
}