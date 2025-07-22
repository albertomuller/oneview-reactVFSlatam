// Azure DevOps API Service
const AZURE_DEVOPS_CONFIG = {
  organization: 'VolvoGroup-MASDCL',
  project: 'VFSDITSA-1018751-COE LATAM',
  apiVersion: '7.0',
  baseUrl: 'https://dev.azure.com',
  queryId: 'c0bf17f0-970c-4577-a40d-2dbd3bddc452', // Main query
  okrQueryId: 'ff0981c2-1a04-483b-8553-3b9b185a84b1' // OKR query
};

class AzureDevOpsService {
  constructor() {
    this.baseUrl = `${AZURE_DEVOPS_CONFIG.baseUrl}/${AZURE_DEVOPS_CONFIG.organization}`;
    this.project = AZURE_DEVOPS_CONFIG.project;
    this.apiVersion = AZURE_DEVOPS_CONFIG.apiVersion;
  }

  // Get authorization header (would typically use stored PAT)
  getAuthHeaders() {
    const pat = process.env.AZURE_DEVOPS_PAT || localStorage.getItem('azure_devops_pat') || '';
    if (pat) {
      const token = btoa(`:${pat}`);
      return {
        'Authorization': `Basic ${token}`,
        'Content-Type': 'application/json'
      };
    }
    return {
      'Content-Type': 'application/json'
    };
  }

  // Fetch work items using stored query
  async fetchWorkItemsByQuery(queryId = AZURE_DEVOPS_CONFIG.queryId) {
    try {
      const url = `${this.baseUrl}/${this.project}/_apis/wit/wiql/${queryId}?api-version=${this.apiVersion}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Azure DevOps API error: ${response.status} ${response.statusText}`);
      }

      const queryResult = await response.json();
      
      if (queryResult.workItems && queryResult.workItems.length > 0) {
        // Extract work item IDs
        const workItemIds = queryResult.workItems.map(wi => wi.id);
        
        // Fetch detailed work item information
        return await this.fetchWorkItemDetails(workItemIds);
      }

      return [];
    } catch (error) {
      console.error('Error fetching work items by query:', error);
      throw error;
    }
  }

  // Fetch detailed work item information
  async fetchWorkItemDetails(workItemIds) {
    try {
      const idsString = workItemIds.join(',');
      const fields = [
        'System.Id',
        'System.Title',
        'System.WorkItemType',
        'System.State',
        'System.AreaPath',
        'System.IterationPath',
        'System.AssignedTo',
        'System.CreatedBy',
        'System.CreatedDate',
        'System.ChangedDate',
        'Microsoft.VSTS.Scheduling.StartDate',
        'Microsoft.VSTS.Scheduling.TargetDate',
        'Microsoft.VSTS.Scheduling.OriginalEstimate',
        'Microsoft.VSTS.Scheduling.RemainingWork',
        'Microsoft.VSTS.Scheduling.CompletedWork',
        'Microsoft.VSTS.Common.Priority',
        'Microsoft.VSTS.Common.Severity',
        'System.Description',
        'Microsoft.VSTS.Common.AcceptanceCriteria'
      ].join(',');

      const url = `${this.baseUrl}/${this.project}/_apis/wit/workitems?ids=${idsString}&fields=${fields}&api-version=${this.apiVersion}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Azure DevOps API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result.value || [];
    } catch (error) {
      console.error('Error fetching work item details:', error);
      throw error;
    }
  }

  // Fetch work item hierarchy (parent-child relationships)
  async fetchWorkItemHierarchy(parentId) {
    try {
      const url = `${this.baseUrl}/${this.project}/_apis/wit/workitems/${parentId}?$expand=relations&api-version=${this.apiVersion}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Azure DevOps API error: ${response.status} ${response.statusText}`);
      }

      const workItem = await response.json();
      
      // Extract child work item IDs from relations
      const childIds = [];
      if (workItem.relations) {
        workItem.relations.forEach(relation => {
          if (relation.rel === 'System.LinkTypes.Hierarchy-Forward') {
            const childId = relation.url.split('/').pop();
            childIds.push(parseInt(childId));
          }
        });
      }

      if (childIds.length > 0) {
        const children = await this.fetchWorkItemDetails(childIds);
        return { parent: workItem, children };
      }

      return { parent: workItem, children: [] };
    } catch (error) {
      console.error('Error fetching work item hierarchy:', error);
      throw error;
    }
  }

  // Test connection to Azure DevOps
  async testConnection() {
    try {
      const url = `${this.baseUrl}/${this.project}/_apis/wit/queries?api-version=${this.apiVersion}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        organization: AZURE_DEVOPS_CONFIG.organization,
        project: AZURE_DEVOPS_CONFIG.project,
        apiVersion: AZURE_DEVOPS_CONFIG.apiVersion
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        organization: AZURE_DEVOPS_CONFIG.organization,
        project: AZURE_DEVOPS_CONFIG.project,
        apiVersion: AZURE_DEVOPS_CONFIG.apiVersion
      };
    }
  }

  // Transform DevOps work items to OneView format
  transformWorkItemsToInitiatives(workItems) {
    return workItems.map(workItem => {
      const fields = workItem.fields || {};
      
      return {
        id: workItem.id,
        title: fields['System.Title'] || 'Untitled',
        workItemType: fields['System.WorkItemType'] || 'Work Item',
        state: fields['System.State'] || 'New',
        market: this.extractMarketFromAreaPath(fields['System.AreaPath']),
        assignedTo: fields['System.AssignedTo']?.displayName || 'Unassigned',
        createdBy: fields['System.CreatedBy']?.displayName || 'Unknown',
        createdDate: fields['System.CreatedDate'] || null,
        changedDate: fields['System.ChangedDate'] || null,
        startDate: fields['Microsoft.VSTS.Scheduling.StartDate'] || null,
        targetDate: fields['Microsoft.VSTS.Scheduling.TargetDate'] || null,
        priority: fields['Microsoft.VSTS.Common.Priority'] || 2,
        description: fields['System.Description'] || '',
        acceptanceCriteria: fields['Microsoft.VSTS.Common.AcceptanceCriteria'] || '',
        originalEstimate: fields['Microsoft.VSTS.Scheduling.OriginalEstimate'] || 0,
        remainingWork: fields['Microsoft.VSTS.Scheduling.RemainingWork'] || 0,
        completedWork: fields['Microsoft.VSTS.Scheduling.CompletedWork'] || 0,
        // Additional OneView specific fields
        dpm: this.extractDPMFromAssignment(fields['System.AssignedTo']),
        deadlineStatus: this.calculateDeadlineStatus(fields['Microsoft.VSTS.Scheduling.TargetDate'], fields['System.State']),
        businessOwner: fields['System.CreatedBy']?.displayName || 'Unknown',
        strategicIntent: this.extractStrategicIntent(fields['System.Description']),
        keyResults: this.extractKeyResults(fields['Microsoft.VSTS.Common.AcceptanceCriteria']),
        // DevOps specific
        fields: fields,
        url: `${AZURE_DEVOPS_CONFIG.baseUrl}/${AZURE_DEVOPS_CONFIG.organization}/${AZURE_DEVOPS_CONFIG.project}/_workitems/edit/${workItem.id}`
      };
    });
  }

  // Helper methods for data transformation
  extractMarketFromAreaPath(areaPath) {
    if (!areaPath) return 'Unknown';
    const parts = areaPath.split('\\');
    // Assuming format like: "Project\\Market\\Team"
    return parts.length > 1 ? parts[1] : 'Unknown';
  }

  extractDPMFromAssignment(assignedTo) {
    // This would typically be enhanced with a lookup table
    return assignedTo?.displayName || 'Unassigned';
  }

  calculateDeadlineStatus(targetDate, state) {
    if (!targetDate) return 'green';
    
    const target = new Date(targetDate);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    
    if (state === 'Done' || state === 'Closed') return 'green';
    if (daysUntilDeadline < 0) return 'red';
    if (daysUntilDeadline < 30) return 'yellow';
    return 'green';
  }

  extractStrategicIntent(description) {
    // Extract strategic intent from description or return first 200 chars
    if (!description) return '';
    const cleanDescription = description.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return cleanDescription.substring(0, 200) + (cleanDescription.length > 200 ? '...' : '');
  }

  extractKeyResults(acceptanceCriteria) {
    // Extract key results from acceptance criteria
    if (!acceptanceCriteria) return '';
    const cleanCriteria = acceptanceCriteria.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return cleanCriteria.substring(0, 200) + (cleanCriteria.length > 200 ? '...' : '');
  }
}

// Export singleton instance
export const azureDevOpsService = new AzureDevOpsService();

// Legacy function for backward compatibility
export async function fetchInitiatives() {
  try {
    // Try to fetch real DevOps data first
    const workItems = await azureDevOpsService.fetchWorkItemsByQuery();
    const initiatives = azureDevOpsService.transformWorkItemsToInitiatives(workItems);
    
    if (initiatives.length > 0) {
      return initiatives;
    }
  } catch (error) {
    console.warn('Failed to fetch from Azure DevOps, falling back to API:', error);
  }
  
  // Fallback to API endpoint
  const response = await fetch('/api/initiatives');
  if (!response.ok) {
    throw new Error('Failed to fetch initiatives');
  }
  
  const data = await response.json();
  return data;
}

export default azureDevOpsService;