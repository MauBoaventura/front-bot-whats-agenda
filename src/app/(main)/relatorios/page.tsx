// app/dashboard/relatorios/page.tsx
'use client';
import { Card, DatePicker, Select, Table, Tag } from 'antd';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 4500 },
  { name: 'Fev', value: 5200 },
  // ... outros meses
];

const mockDataSource = [
  {
    key: '1',
    date: '2025-04-01',
    service: 'Corte Masculino',
    amount: 50.0,
    status: 'pago',
  },
  {
    key: '2',
    date: '2025-04-02',
    service: 'Manicure',
    amount: 30.0,
    status: 'pendente',
  },
  {
    key: '3',
    date: '2025-04-03',
    service: 'Massagem Relaxante',
    amount: 120.0,
    status: 'pago',
  },
  {
    key: '4',
    date: '2025-04-04',
    service: 'Pedicure',
    amount: 40.0,
    status: 'pago',
  },
  {
    key: '5',
    date: '2025-04-05',
    service: 'Limpeza de Pele',
    amount: 100.0,
    status: 'pendente',
  },
];

export default function RelatoriosPage() {
  return (
    <div className="p-6 space-y-6">
      <Card
        title="Relatórios Financeiros"
        extra={
          <div className="flex gap-2">
            <DatePicker.RangePicker />
            <Select defaultValue="2023" style={{ width: 120 }}>
              <Select.Option value="2023">2023</Select.Option>
              <Select.Option value="2022">2022</Select.Option>
            </Select>
          </div>
        }
      >
        <div className="h-64 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <Table
          columns={[
            { title: 'Data', dataIndex: 'date' },
            { title: 'Serviço', dataIndex: 'service' },
            { 
              title: 'Valor', 
              dataIndex: 'amount',
              render: (value) => `R$ ${value.toFixed(2)}`
            },
            { 
              title: 'Status', 
              dataIndex: 'status',
              render: (status) => (
                <Tag color={status === 'pago' ? 'green' : 'orange'}>
                  {status.toUpperCase()}
                </Tag>
              )
            },
          ]}
          dataSource={mockDataSource}
        />
      </Card>
    </div>
  );
}