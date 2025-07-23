import { useState, useEffect, useCallback } from 'react';
import { azureDevOpsService, validateDevOpsConfiguration } from '../services/azureDevOps';

export const useAzureDevOps = () => {
  const [devopsData, setDevopsData] = useState({ items: [], relations: [] });
  const [okrData, setOkrData] = useState({ items: [], relations: [] });
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [error, setError] = useState(null);

  // Load DevOps data (ONEVIEW pattern)
  const loadDevOpsData = useCallback(async (queryId = null, expandRelations = false) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading DevOps data...');
      const data = await azureDevOpsService.fetchDevOpsData(queryId, expandRelations);
      setDevopsData(data);
      setConnectionStatus('success');
      console.log(`Loaded ${data.items.length} items with ${data.relations.length} relations`);
      return data;
    } catch (error) {
      console.error('Error loading DevOps data:', error);
      setError(error.message);
      setConnectionStatus('error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load OKR data
  const loadOKRData = useCallback(async () => {
    try {
      console.log('Loading OKR data...');
      const data = await azureDevOpsService.fetchDevOpsData(azureDevOpsService.okrQueryId);
      setOkrData(data);
      console.log(`Loaded ${data.items.length} OKR items`);
      return data;
    } catch (error) {
      console.error('Error loading OKR data:', error);
      // Don't set error state for OKR failure - it's optional
      return { items: [], relations: [] };
    }
  }, []);

  // Test connection
  const testConnection = useCallback(async () => {
    setLoading(true);
    setConnectionStatus('testing');
    
    try {
      const result = await azureDevOpsService.testConnection();
      setConnectionStatus(result.success ? 'success' : 'error');
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (error) {
      setConnectionStatus('error');
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get initiatives from loaded data
  const getInitiatives = useCallback(() => {
    return devopsData.items.filter(item => 
      item.fields['System.WorkItemType'] === 'Initiative'
    );
  }, [devopsData.items]);

  // Get hierarchy for an initiative (ONEVIEW pattern)
  const getInitiativeHierarchy = useCallback((initiative) => {
    const allItemsMap = new Map(devopsData.items.map(item => [item.id, item]));
    return azureDevOpsService.getSortedHierarchy(initiative, allItemsMap, devopsData.relations);
  }, [devopsData.items, devopsData.relations]);

  // Get associated risks for hierarchy items
  const getAssociatedRisks = useCallback((hierarchyItemIds) => {
    const allItemsMap = new Map(devopsData.items.map(item => [item.id, item]));
    const { childToParentMap } = azureDevOpsService.buildHierarchyMaps(allItemsMap, devopsData.relations);
    return azureDevOpsService.findAssociatedRisks(hierarchyItemIds, allItemsMap, childToParentMap);
  }, [devopsData.items, devopsData.relations]);

  // Get associated OKRs for hierarchy items
  const getAssociatedOKRs = useCallback((hierarchyItemIds) => {
    const okrItemsMap = new Map(okrData.items.map(item => [item.id, item]));
    const { childToParentMap } = azureDevOpsService.buildHierarchyMaps(okrItemsMap, okrData.relations);
    return azureDevOpsService.findAssociatedOKRs(hierarchyItemIds, okrItemsMap, childToParentMap);
  }, [okrData.items, okrData.relations]);

  // Validate configuration
  const validateConfiguration = useCallback(() => {
    return validateDevOpsConfiguration();
  }, []);

  // Load all data (main + OKR)
  const loadAllData = useCallback(async () => {
    try {
      const [mainData, okrDataResult] = await Promise.all([
        loadDevOpsData(null, true),
        loadOKRData()
      ]);
      
      return {
        devops: mainData,
        okr: okrDataResult
      };
    } catch (error) {
      console.error('Error loading all data:', error);
      throw error;
    }
  }, [loadDevOpsData, loadOKRData]);

  // Build hierarchy maps
  const buildHierarchyMaps = useCallback((itemsMap, relations) => {
    return azureDevOpsService.buildHierarchyMaps(itemsMap, relations);
  }, []);

  // Get DevOps item URL
  const getItemUrl = useCallback((itemId) => {
    return azureDevOpsService.getDevOpsItemUrl(itemId);
  }, []);

  return {
    // Data
    devopsData,
    okrData,
    
    // State
    loading,
    connectionStatus,
    error,
    
    // Actions
    loadDevOpsData,
    loadOKRData,
    loadAllData,
    testConnection,
    
    // Helpers
    getInitiatives,
    getInitiativeHierarchy,
    getAssociatedRisks,
    getAssociatedOKRs,
    validateConfiguration,
    buildHierarchyMaps,
    getItemUrl,
    
    // Service instance
    azureDevOpsService
  };
};

// Legacy hook for backward compatibility  
export function useDevOpsData() {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchDevOpsData(queryId, pat) {
    setLoading(true);
    setError('');
    try {
      // Store PAT for the service to use
      localStorage.setItem('azure_devops_pat', pat);
      
      const data = await azureDevOpsService.fetchDevOpsData(queryId);
      const initiativeItems = data.items.filter(item => 
        item.fields['System.WorkItemType'] === 'Initiative'
      );
      setInitiatives(initiativeItems);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { initiatives, loading, error, fetchDevOpsData };
}

export default useAzureDevOps;
