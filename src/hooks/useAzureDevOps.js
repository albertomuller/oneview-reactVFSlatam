import { useState } from 'react';

export function useDevOpsData() {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchDevOpsData(queryId, pat) {
    setLoading(true);
    setError('');
    try {
      const organization = "VolvoGroup-MASDCL";
      const project = "VFSDITSA-1018751-COE LATAM";
      const headers = { 'Authorization': 'Basic ' + btoa(":" + pat), 'Content-Type': 'application/json' };
      const queryUrl = `https://dev.azure.com/${organization}/${project}/_apis/wit/wiql/${queryId}?api-version=7.1-preview.2`;

      const response = await fetch(queryUrl, { method: 'GET', headers });
      if (!response.ok) throw new Error('Erro ao buscar dados do DevOps');
      const result = await response.json();

      // Busca detalhes dos work items
      const ids = result.workItems.map(item => item.id);
      if (ids.length === 0) {
        setInitiatives([]);
        setLoading(false);
        return;
      }

      const detailsUrl = `https://dev.azure.com/${organization}/${project}/_apis/wit/workitemsbatch?api-version=7.1-preview.1`;
      const body = { ids, fields: [
        'System.Id', 'System.Title', 'System.State', 'System.WorkItemType',
        'System.AssignedTo', 'System.Description'
      ]};
      const detailsResponse = await fetch(detailsUrl, { method: 'POST', headers, body: JSON.stringify(body) });
      if (!detailsResponse.ok) throw new Error('Erro ao buscar detalhes dos itens');
      const detailsResult = await detailsResponse.json();

      // Filtra apenas iniciativas
      const initiatives = detailsResult.value.filter(item => item.fields['System.WorkItemType'] === 'Initiative');
      setInitiatives(initiatives);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { initiatives, loading, error, fetchDevOpsData };
}