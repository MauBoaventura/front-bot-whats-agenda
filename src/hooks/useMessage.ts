// hooks/useMessage.ts
'use client';
import { App } from 'antd';

export function useMessage() {
  return App.useApp().message;
}
