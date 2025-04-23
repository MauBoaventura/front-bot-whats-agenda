// components/ThemeToggle.tsx
"use client"; // Componente Client-Side

import { MoonFilled, SunFilled } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evite hidratação inconsistente no SSR
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <FloatButton 
      icon={theme === 'dark' ? <SunFilled className='!text-yellow-500'/> :<MoonFilled className='!text-blue-500'/>} 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
    />
  );
}