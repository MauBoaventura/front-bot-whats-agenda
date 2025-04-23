// app/dashboard/configuracoes/page.tsx
'use client';
import { Tabs, Form, Input, Button, Upload, Switch, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function ConfiguracoesPage() {
  const [form] = Form.useForm();

  const items = [
    {
      key: '1',
      label: 'Informações',
      children: (
        <Form form={form} layout="vertical">
          <Form.Item label="Nome do Estabelecimento" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Endereço" name="address">
            <Input.TextArea />
          </Form.Item>
          {/* Mais campos... */}
        </Form>
      ),
    },
    {
      key: '2',
      label: 'Pagamentos',
      children: (
        <div className="space-y-4">
          <Card title="Métodos Aceitos">
            <Form.Item name="cash" valuePropName="checked">
              <Switch checkedChildren="Dinheiro" unCheckedChildren="Dinheiro" />
            </Form.Item>
            {/* Outros métodos... */}
          </Card>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Personalização',
      children: (
        <div>
          <Form.Item label="Logo" name="logo">
            <Upload>
              <Button icon={<UploadOutlined />}>Upload Logo</Button>
            </Upload>
          </Form.Item>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="Configurações"
        extra={
          <Button type="primary" onClick={() => message.success('Configurações salvas!')}>
            Salvar
          </Button>
        }
      >
        <Tabs items={items} />
      </Card>
    </div>
  );
}