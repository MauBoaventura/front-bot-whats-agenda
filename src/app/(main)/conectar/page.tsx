'use client';

import { CheckCircleOutlined, LogoutOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Card, Modal, Typography } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

export default function WhatsAppConnectionPage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Mock data - substituir por chamadas reais à API
  const mockPhoneNumber = '+55 (11) 98765-4321';

  const checkConnectionStatus = async () => {
    try {
      // Simulação de verificação de conexão
      const res = await fetch('http://localhost:4000/whatsapp/status');
      const mockResponse = { 
        connected: !!res.json, 
        phoneNumber: mockPhoneNumber
      };
      
      if(res.status === 500) {
        setIsConnected(false);
      }
      
      setIsConnected(mockResponse.connected);
      if (mockResponse.connected) {
        setPhoneNumber(mockResponse.phoneNumber);
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQrCode = async () => {
    try {
      // Simulação de geração de QR Code
      const res = await fetch('http://localhost:4000/whatsapp/qrcode-base64');
      const data = await res.json();
      if (data.qrCode) setQrCode(data.qrCode);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula atraso na geração do QR Code
    } catch (error) {
      console.error('Erro ao buscar QR Code:', error);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      // Simulação de logout
      await fetch('http://localhost:4000/whatsapp/logout', { method: 'GET' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(false);
      setPhoneNumber(null);
      setModalVisible(false);
      fetchQrCode(); // Gera novo QR Code
    } catch (error) {
      console.error('Erro ao desconectar:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnectionStatus();
    
    if (!isConnected) {
      fetchQrCode();
      const interval = setInterval(fetchQrCode, 10000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center" loading>
          <Title level={4}>Carregando...</Title>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        {isConnected ? (
          <div className="text-center">
            <Badge 
              count={<CheckCircleOutlined style={{ color: '#52c41a' }} />} 
              offset={[-20, 80]}
            >
              <Avatar 
                size={100} 
                icon={<WhatsAppOutlined />} 
                className="bg-green-500 mb-4"
              />
            </Badge>
            
            <Title level={3} className="mb-2">Conectado ao WhatsApp</Title>
            <Text className="block text-lg mb-6">{phoneNumber}</Text>
            
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={() => setModalVisible(true)}
              loading={loading}
            >
              Desconectar
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Avatar 
              size={100} 
              icon={<WhatsAppOutlined />} 
              className="bg-gray-300 mb-4"
            />
            
            <Title level={3} className="mb-4">Conectar WhatsApp</Title>
            <Text className="block mb-6">
              Escaneie o QR Code abaixo usando o aplicativo do WhatsApp no seu celular
            </Text>
            
            {qrCode ? (
              <div className="relative w-64 h-64 mx-auto mb-6 border rounded p-2">
                <Image
                  src={qrCode}
                  alt="QR Code do WhatsApp"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <Text type="secondary">Gerando QR Code...</Text>
              </div>
            )}
            
            <Text type="secondary" className="block text-sm">
              Atualizando automaticamente a cada 10 segundos
            </Text>
          </div>
        )}
      </Card>

      <Modal
        title="Confirmar Desconexão"
        open={modalVisible}
        onOk={handleLogout}
        onCancel={() => setModalVisible(false)}
        okText="Desconectar"
        cancelText="Cancelar"
        confirmLoading={loading}
      >
        <p>Tem certeza que deseja desconectar o número {phoneNumber}?</p>
        <p className="text-red-500">Você precisará escanear um novo QR Code para se reconectar.</p>
      </Modal>
    </div>
  );
}