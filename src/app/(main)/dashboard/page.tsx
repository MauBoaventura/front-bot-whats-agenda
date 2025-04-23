import { Card, Row, Col, Statistic } from 'antd';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bem-vindo ao Painel de Agendamentos</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Agendamentos Hoje" value={15} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Feedbacks Recentes" value={8} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Horários Disponíveis" value={12} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}