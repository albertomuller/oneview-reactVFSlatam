// Hook para buscar iniciativas reais do backend SQL
import { useState } from 'react';

export function useInitiativesData() {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInitiatives = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Buscando iniciativas...');
      const res = await fetch('/api/initiatives');
      if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
      const data = await res.json();
      // O backend agora retorna um array de iniciativas
      console.log('✅ Dados recebidos:', data);
      console.log('📊 Total de iniciativas:', data.length);
      setInitiatives(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Erro ao buscar iniciativas:', err);
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
      console.log('✋ Carregamento finalizado');
    }
  };

  return { initiatives, loading, error, fetchInitiatives };
}
