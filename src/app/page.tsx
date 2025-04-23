'use client'; // Necessário para hooks e interatividade

import { useRouter } from 'next/navigation'; // Importa o hook useRouter
import { useEffect } from 'react';

export default function AgendamentoPage() {
  const router = useRouter(); // Inicializa o roteador

  useEffect(() => {
    // Redireciona para /dashboard
    router.push('/dashboard');
  }, [router]);

  return null; // Retorna null já que a página será redirecionada
}
