// app/dashboard/horarios/page.tsx
'use client';

import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Form, Modal, Select, Tag, TimePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useState } from 'react';

dayjs.locale('pt-br');

interface WorkingHours {
  day: string;
  label: string;
  intervals: {
    start: string;
    end: string;
    id: string;
  }[];
}

export default function HorariosAtendimentoPage() {
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([
    {
      day: 'monday',
      label: 'Segunda-feira',
      intervals: [{ start: '08:00', end: '12:00', id: '1' }, { start: '14:00', end: '18:00', id: '2' }]
    },
    {
      day: 'tuesday',
      label: 'Terça-feira',
      intervals: [{ start: '08:00', end: '12:00', id: '1' }, { start: '14:00', end: '18:00', id: '2' }]
    },
    {
      day: 'wednesday',
      label: 'Quarta-feira',
      intervals: [{ start: '08:00', end: '12:00', id: '1' }, { start: '14:00', end: '18:00', id: '2' }]
    },
    {
      day: 'thursday',
      label: 'Quinta-feira',
      intervals: [{ start: '08:00', end: '12:00', id: '1' }, { start: '14:00', end: '18:00', id: '2' }]
    },
    {
      day: 'friday',
      label: 'Sexta-feira',
      intervals: [{ start: '08:00', end: '12:00', id: '1' }, { start: '14:00', end: '18:00', id: '2' }]
    },
    {
      day: 'saturday',
      label: 'Sábado',
      intervals: [{ start: '09:00', end: '13:00', id: '1' }]
    },
    {
      day: 'sunday',
      label: 'Domingo',
      intervals: []
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDay, setCurrentDay] = useState('');
  const [form] = Form.useForm();

  const handleAddInterval = (day: string) => {
    setCurrentDay(day);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSaveInterval = () => {
    form.validateFields().then(values => {
      const newInterval = {
        start: values.start.format('HH:mm'),
        end: values.end.format('HH:mm'),
        id: Math.random().toString(36).substr(2, 9)
      };

      setWorkingHours(workingHours.map(wh => 
        wh.day === currentDay 
          ? { ...wh, intervals: [...wh.intervals, newInterval] } 
          : wh
      ));

      setIsModalVisible(false);
    });
  };

  const handleDeleteInterval = (day: string, id: string) => {
    setWorkingHours(workingHours.map(wh => 
      wh.day === day 
        ? { ...wh, intervals: wh.intervals.filter(i => i.id !== id) } 
        : wh
    ));
  };

  const handleSetSpecialDay = (day: string, isSpecial: boolean) => {
    setWorkingHours(workingHours.map(wh => 
      wh.day === day 
        ? { ...wh, intervals: isSpecial ? [] : [{ start: '09:00', end: '13:00', id: '1' }] } 
        : wh
    ));
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <Card 
          title="Horários de Atendimento" 
          className="shadow-sm"
          extra={
            <Button type="primary" icon={<SaveOutlined />}>
              Salvar Alterações
            </Button>
          }
        >
          <div className="space-y-6">
            {workingHours.map(day => (
              <div key={day.day} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{day.label}</h3>
                  
                  {day.day === 'sunday' || day.day === 'saturday' ? (
                    <Select
                      defaultValue={day.intervals.length > 0 ? 'open' : 'closed'}
                      style={{ width: 120 }}
                      onChange={(value) => handleSetSpecialDay(day.day, value === 'closed')}
                    >
                      <Select.Option value="open">Aberto</Select.Option>
                      <Select.Option value="closed">Fechado</Select.Option>
                    </Select>
                  ) : (
                    <Button 
                      size="small" 
                      icon={<PlusOutlined />}
                      onClick={() => handleAddInterval(day.day)}
                    >
                      Adicionar Horário
                    </Button>
                  )}
                </div>

                {day.intervals.length > 0 ? (
                  <div className="space-y-3">
                    {day.intervals.map(interval => (
                      <div key={interval.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div className="flex items-center space-x-4">
                          <Tag color="blue">{interval.start}</Tag>
                          <span>às</span>
                          <Tag color="blue">{interval.end}</Tag>
                        </div>
                        <Button 
                          danger 
                          size="small" 
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteInterval(day.day, interval.id)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    {day.day === 'sunday' ? 'Domingo - Fechado' : 'Nenhum horário cadastrado'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal
        title="Adicionar Horário"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancelar
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            icon={<SaveOutlined />}
            onClick={handleSaveInterval}
          >
            Salvar Horário
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Horário Inicial"
            name="start"
            rules={[{ required: true, message: 'Selecione o horário inicial' }]}
          >
            <TimePicker 
              format="HH:mm" 
              minuteStep={15} 
              style={{ width: '100%' }} 
            />
          </Form.Item>
          
          <Form.Item
            label="Horário Final"
            name="end"
            rules={[{ required: true, message: 'Selecione o horário final' }]}
          >
            <TimePicker 
              format="HH:mm" 
              minuteStep={15} 
              style={{ width: '100%' }} 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}