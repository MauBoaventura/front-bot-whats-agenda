'use client';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useConfiguracao } from '@/providers/configuracao-provider/configuracao-provider';
import {
  BarChartOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  EditOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ScissorOutlined,
  SettingOutlined,
  StarOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Avatar, Button, Drawer, Layout, Menu, Space, Typography, type MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { collapsedSidebar, setCollapsedSidebar } = useConfiguracao();
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  // Verificar se é mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Itens do Menu (Sidebar)
  const menuItems: MenuProps['items'] = [
    { key: '1', icon: <HomeOutlined />, label: <Link href={`/dashboard`} onClick={() => setMobileMenuVisible(false)}>Início</Link> },
    { key: '2', icon: <CalendarOutlined />, label: <Link href={`/agenda`} onClick={() => setMobileMenuVisible(false)}>Agenda do Dia</Link> },
    { key: '3', icon: <StarOutlined />, label: <Link href={`/feedbacks`} onClick={() => setMobileMenuVisible(false)}>Feedbacks</Link> },
    { key: '4', icon: <EditOutlined />, label: <Link href={`/agendamento`} onClick={() => setMobileMenuVisible(false)}>Criar Agendamento</Link> },
    { key: '5', icon: <ClockCircleOutlined />, label: <Link href={`/horarios`} onClick={() => setMobileMenuVisible(false)}>Horários de Atendimento</Link> },
    { key: '6', icon: <SettingOutlined />, label: <Link href={`/configuracoes`} onClick={() => setMobileMenuVisible(false)}>Configurações</Link> },
    { key: '7', icon: <UserOutlined />, label: <Link href={`/clientes`} onClick={() => setMobileMenuVisible(false)}>Clientes</Link> },
    { key: '8', icon: <BarChartOutlined />, label: <Link href={`/relatorios`} onClick={() => setMobileMenuVisible(false)}>Relatórios</Link> },
    { key: '9', icon: <ScissorOutlined />, label: <Link href={`/servicos`} onClick={() => setMobileMenuVisible(false)}>Serviços</Link> },
    { key: '10', icon: <ScissorOutlined />, label: <Link href={`/conectar`} onClick={() => setMobileMenuVisible(false)}>Conectar ao WhatsApp</Link> },
  ];

  return (
    <Layout className="min-h-screen">
      {/* Header fixo */}
      <Header
        className={`fixed top-0 z-[100] flex h-16 w-full items-center justify-between shadow-md transition-all duration-300 !pl-4 ${
          theme === 'dark' ? 'bg-[#001529]' : 'bg-white'
        } ${!isMobile && !collapsedSidebar ? 'ml-[250px]' : !isMobile ? 'ml-[80px]' : 'ml-0'} px-4`}
      >
        <Space className='flex items-center'>
          {isMobile ? (
            <Button
              type="text"
              icon={mobileMenuVisible ? <CloseOutlined /> : <MenuUnfoldOutlined />}
              onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
            />
          ) : (
            <Button
              type="text"
              icon={collapsedSidebar ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsedSidebar(!collapsedSidebar)}
            />
          )}
          <Title level={5} className="!m-0 text-blue-100">
            Painel de Controle
          </Title>
        </Space>
        <div className="flex items-center">
          <Avatar icon={<UserOutlined />} />
          <ThemeToggle />
        </div>
      </Header>

      {/* Sidebar para desktop */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsedSidebar}
          onCollapse={(value) => setCollapsedSidebar(value)}
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
            {!collapsedSidebar ? (
              <Title level={4} className="m-0 text-blue-900 flex items-center gap-2">
                <Image src={theme === 'dark' ? '/assets/logo-dark-mauboa.png' : '/assets/logo-mauboa.png'} alt="Logo" width={64} height={64} />
              </Title>
            ) : (
              <Image src={theme === 'dark' ? '/assets/logo-dark-mauboa.png' : '/assets/logo-mauboa.png'} alt="Logo" width={64} height={64} />
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
      )}

      {/* Drawer para mobile */}
      {isMobile && (
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setMobileMenuVisible(false)}
          open={mobileMenuVisible}
          styles={{ body: { padding: 0, backgroundColor: 'var(--white)' }, }}
          width={250}
          className='bg-white dark:bg-[#001529] text-black dark:text-white'
        >
          <div className="p-4 flex items-center justify-center h-16 border-b">
            <Image
              src={theme === 'dark' ? '/assets/logo-dark-mauboa.png' : '/assets/logo-mauboa.png'}
              alt="Logo"
              width={64}
              height={64}
            />
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            items={menuItems}
            theme={theme === 'dark' ? 'dark' : 'light'}
            className="border-r-0"
          />
        </Drawer>
      )}

      {/* Content */}
      <Content
        style={{
          padding: '24px',
          marginTop: '64px', // Compensa o header fixo
          marginLeft: !isMobile && !collapsedSidebar ? '250px' : !isMobile ? '80px' : '0',
          minHeight: 'calc(100vh - 64px)',
          overflow: 'auto',
        }}
      >
        {children}
      </Content>
    </Layout>
  );
}