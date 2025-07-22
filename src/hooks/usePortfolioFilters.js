import { useState, useMemo } from 'react';

// Campos filtráveis e seus labels
const FILTER_FIELDS = [
  { key: 'market', label: 'Market' },
  { key: 'dpo', label: 'DPO' },
  { key: 'dpm', label: 'DPM' },
  { key: 'businessOwner', label: 'Business Owner' },
  { key: 'po', label: 'Product Owner' },
  { key: 'technicalLead', label: 'Technical Lead' },
  { key: 'architect', label: 'Architect' },
  { key: 'cybersecurity', label: 'Cybersecurity' },
];

// Extrai valores únicos para cada filtro a partir das iniciativas
function getFilterOptions(initiatives) {
  const options = {};
  FILTER_FIELDS.forEach(({ key }) => {
    options[key] = new Set();
  });
  initiatives.forEach((item) => {
    options.market.add(item.market || '');
    options.dpo.add(item.fields['System.AssignedTo']?.displayName || '');
    options.dpm.add(item.dpm || '');
    options.businessOwner.add(item.businessOwner || '');
    options.po.add(item.po || '');
    options.technicalLead.add(item.tdpo || ''); // usando tdpo como technical lead
    options.architect.add(item.architect || '');
    options.cybersecurity.add(item.cybersecurity || '');
  });
  // Remove vazios e converte para array
  Object.keys(options).forEach((k) => {
    options[k] = Array.from(options[k]).filter(Boolean);
  });
  return options;
}

export function usePortfolioFilters(initiatives) {
  const [filters, setFilters] = useState({
    market: '',
    dpo: '',
    dpm: '',
    businessOwner: '',
    po: '',
    technicalLead: '',
    architect: '',
    cybersecurity: '',
  });

  // Opções dinâmicas para cada filtro
  const filterOptions = useMemo(() => getFilterOptions(initiatives), [initiatives]);

  // Aplica os filtros às iniciativas
  const filteredInitiatives = useMemo(() => {
    return initiatives.filter((item) => {
      if (filters.market && item.market !== filters.market) return false;
      if (filters.dpo && (item.fields['System.AssignedTo']?.displayName || '') !== filters.dpo) return false;
      if (filters.dpm && (item.dpm || '') !== filters.dpm) return false;
      if (filters.businessOwner && (item.businessOwner || '') !== filters.businessOwner) return false;
      if (filters.po && (item.po || '') !== filters.po) return false;
      if (filters.technicalLead && (item.tdpo || '') !== filters.technicalLead) return false;
      if (filters.architect && (item.architect || '') !== filters.architect) return false;
      if (filters.cybersecurity && (item.cybersecurity || '') !== filters.cybersecurity) return false;
      return true;
    });
  }, [initiatives, filters]);

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({
      market: '',
      dpo: '',
      dpm: '',
      businessOwner: '',
      po: '',
      technicalLead: '',
      architect: '',
      cybersecurity: '',
    });
  }

  return {
    filters,
    setFilter,
    clearFilters,
    filterOptions,
    filteredInitiatives,
    FILTER_FIELDS,
  };
}
