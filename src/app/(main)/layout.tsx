'use client';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  BarChartOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ScissorOutlined,
  SettingOutlined,
  StarOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, Space, Typography, type MenuProps } from 'antd';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();

  // Itens do Menu (Sidebar)
  const menuItems: MenuProps['items'] = [
    { key: '1', icon: <HomeOutlined />, label: <Link href={`/dashboard`}>Início</Link> },
    { key: '2', icon: <CalendarOutlined />, label: <Link href={`/agenda`}>Agenda do Dia</Link> },
    { key: '3', icon: <StarOutlined />, label: <Link href={`/feedbacks`}>Feedbacks</Link> },
    { key: '4', icon: <EditOutlined />, label: <Link href={`/agendamento`}>Criar Agendamento</Link> },
    { key: '5', icon: <ClockCircleOutlined />, label: <Link href={`/horarios`}>Horários de Atendimento</Link> },
    { key: '6', icon: <SettingOutlined />, label: <Link href={`/configuracoes`}>Configurações</Link> },
    { key: '7', icon: <UserOutlined />, label: <Link href={`/clientes`}>Clientes</Link> },
    { key: '8', icon: <BarChartOutlined />, label: <Link href={`/relatorios`}>Relatórios</Link> },
    { key: '9', icon: <ScissorOutlined />, label: <Link href={`/servicos`}>Serviços</Link> },
    { key: '10', icon: <ScissorOutlined />, label: <Link href={`/conectar`}>Conectar ao WhatsApp</Link> },
  ];

 
  return (
    <Layout hasSider className="min-h-screen">
      {/* Sidebar (fixa e ocupando 100% da altura) */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        collapsedWidth={80}
        theme={theme === 'dark' ? 'dark' : 'light'}
        style={{
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="p-4 flex items-center justify-center h-16">
          {!collapsed ? (
            <Title level={4} className="m-0 text-blue-900">
              Agendamento
            </Title>
          ) : (
            <CalendarOutlined className="text-xl text-blue-600" />
          )}
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
          theme={theme === 'dark' ? 'dark' : 'light'}
          className="border-r-0"
        />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 250,
          minHeight: '100vh',
        }}
      >
        <Header
          style={{
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: theme === 'dark' ? '#001529' : '#fff',
          }}
        >
          <Space className='flex items-center'>
            <Button
              className=' text-blue-100'
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <Title level={5} className="!m-0 text-blue-100">
              Painel de Controle
            </Title>
          </Space><div className="flex items-center">
            <Avatar icon={<UserOutlined />} />
            <ThemeToggle />
          </div>
        </Header>

        {/* Content (ocupando toda a área disponível) */}
        <Content
          style={{
            padding: '24px',
            height: 'calc(100vh - 64px)', // 64px = altura do Header
            overflow: 'auto',

          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}