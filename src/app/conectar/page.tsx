// app/qrcode/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function QrCodePage() {
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const res = await fetch('http://localhost:4000/whatsapp/qrcode-base64');
        const data = await res.json();
        if (data.qrCode) setQrCode(data.qrCode);
      } catch (error) {
        console.error('Erro ao buscar QR Code:', error);
      }
    };

    fetchQrCode();
    const interval = setInterval(fetchQrCode, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-background shadow-lg rounded-xl p-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">Conecte-se ao WhatsApp</h1>
        {qrCode ? (
          <img
            src={qrCode}
            alt="QR Code do WhatsApp"
            className="w-64 h-64 mx-auto"
          />
        ) : (
          <p className="text-gray-500">Carregando QR Code...</p>
        )}
      </div>
    </main>
  );
}
