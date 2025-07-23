// Azure DevOps API Service - Based on ONEVIEW project pattern
const AZURE_DEVOPS_CONFIG = {
  organization: 'VolvoGroup-MASDCL',
  project: 'VFSDITSA-1018751-COE LATAM',
  apiVersion: '7.1-preview.2',
  baseUrl: 'https://dev.azure.com',
  queryId: '0bf17f0f-970c-4577-a40d-2dbd3bddc452', // Main query (corrected)
  okrQueryId: 'ff0981c2-1a04-483b-8553-3b9b185a84b1' // OKR query
};

// Work item type styles mapping (from ONEVIEW)
const workItemTypeStyles = {
  'Initiative': { icon: 'fa-rocket', color: '#2D606F' },
  'Epic': { icon: 'fa-crown', color: '#E8B778' },        // Orange pastel
  'Feature': { icon: 'fa-trophy', color: '#B8A5E8' },    // Purple pastel
  'User Story': { icon: 'fa-book-open', color: '#678C96' },
  'Bug': { icon: 'fa-bug', color: '#EF4444' },
  'Task': { icon: 'fa-check-square', color: '#96B0B6' },
  'Risk': { icon: 'fa-exclamation-triangle', color: '#F59E0B' },
  'Objective': { icon: 'fa-target', color: '#10B981' },
  'Key Result': { icon: 'fa-key', color: '#3B82F6' },
  'Default': { icon: 'fa-question-circle', color: '#4A5E65' }
};

class AzureDevOpsService {
  constructor() {
    this.organization = AZURE_DEVOPS_CONFIG.organization;
    this.project = AZURE_DEVOPS_CONFIG.project;
    this.apiVersion = AZURE_DEVOPS_CONFIG.apiVersion;
    this.baseUrl = AZURE_DEVOPS_CONFIG.baseUrl;
    this.queryId = AZURE_DEVOPS_CONFIG.queryId;
    this.okrQueryId = AZURE_DEVOPS_CONFIG.okrQueryId;
  }

  // Get authorization header using PAT
  getAuthHeaders() {
    const pat = localStorage.getItem('azure_devops_pat') || '';
    if (!pat) {
      throw new Error('Azure DevOps PAT not configured');
    }
    
    return {
      'Authorization': `Basic ${btoa(':' + pat)}`,
      'Content-Type': 'application/json'
    };
  }

  // Fetch DevOps data using direct WIQL query (ONEVIEW pattern)
  async fetchDevOpsData(customQuery = null, expandRelations = false) {
    try {
      console.log(`Fetching DevOps data with ${customQuery ? 'custom' : 'default'} query`);
      
      const headers = this.getAuthHeaders();
      
      // Default WIQL query for portfolio initiatives
      const defaultQuery = {
        query: `SELECT [System.Id], [System.Title], [System.WorkItemType], [System.State], 
                       [System.AssignedTo], [System.AreaPath], [System.IterationPath],
                       [Microsoft.VSTS.Common.Priority], [Microsoft.VSTS.Scheduling.StartDate],
                       [Microsoft.VSTS.Scheduling.TargetDate], [System.Description]
                FROM workitems 
                WHERE [System.TeamProject] = @project 
                AND [System.WorkItemType] IN ('Initiative', 'Epic', 'Feature', 'User Story', 'Bug', 'Task')
                ORDER BY [System.WorkItemType], [System.Id]`
      };

      const queryPayload = customQuery || defaultQuery;
      const wiqlUrl = `${this.baseUrl}/${this.organization}/${encodeURIComponent(this.project)}/_apis/wit/wiql?api-version=${this.apiVersion}`;

      console.log("Making WIQL request to:", wiqlUrl);

      const response = await fetch(wiqlUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(queryPayload)
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        let errorMessage = `API Error [${response.status}]: `;
        try {
          const errorBody = await response.text();
          errorMessage += errorBody;
        } catch (e) {
          errorMessage += response.statusText;
        }

        switch (response.status) {
          case 401:
            errorMessage = "Authentication failed. Please check your PAT token.";
            break;
          case 403:
            errorMessage = "Access denied. Please check your permissions.";
            break;
          case 404:
            errorMessage = "Query not found. Please check the query ID.";
            break;
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      const ids = new Set();
      let relations = [];

      // Handle different query result types
      if (result.queryResultType === 'workItemLink') {
        relations = result.workItemRelations || [];
        relations.forEach(link => {
          if (link.source) ids.add(link.source.id);
          if (link.target) ids.add(link.target.id);
        });
      } else {
        result.workItems?.forEach(item => ids.add(item.id));
      }

      const allIds = Array.from(ids);
      if (allIds.length === 0) {
        return { items: [], relations: [] };
      }

      // Fetch work item details in batches
      const allDetails = [];
      const chunkSize = 200;
      const fields = [
        'System.Id', 'System.Title', 'System.State', 'System.WorkItemType',
        'System.AssignedTo', 'System.Description', 'System.CreatedBy',
        'Microsoft.VSTS.Scheduling.StartDate', 'Microsoft.VSTS.Scheduling.TargetDate',
        'Custom.BusinessHypothesis', 'System.AreaPath', 'System.IterationPath',
        'Microsoft.VSTS.Common.Priority', 'Microsoft.VSTS.Common.Severity'
      ];

      const expandParam = expandRelations ? '&$expand=relations' : '';
      const detailsUrl = `${this.baseUrl}/${this.organization}/${this.project}/_apis/wit/workitemsbatch?${expandParam}&api-version=7.1-preview.1`;

      for (let i = 0; i < allIds.length; i += chunkSize) {
        const chunk = allIds.slice(i, i + chunkSize);
        const body = { ids: chunk, fields: fields };
        
        const detailsResponse = await fetch(detailsUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body)
        });

        if (!detailsResponse.ok) {
          throw new Error(`Failed to fetch work item details: ${detailsResponse.status}`);
        }

        const detailsResult = await detailsResponse.json();
        allDetails.push(...detailsResult.value);
      }

      console.log(`Fetched ${allDetails.length} work items with ${relations.length} relations`);
      return { items: allDetails, relations: relations };

    } catch (error) {
      console.error('Error fetching DevOps data:', error);
      throw error;
    }
  }

  // Test connection (ONEVIEW pattern)
  async testConnection() {
    try {
      const headers = this.getAuthHeaders();
      const testUrl = `${this.baseUrl}/${this.organization}/${this.project}/_apis/wit/queries?api-version=${this.apiVersion}`;
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: headers
      });

      if (response.ok) {
        return {
          success: true,
          status: response.status,
          message: 'Connection successful',
          organization: this.organization,
          project: this.project
        };
      } else {
        return {
          success: false,
          status: response.status,
          message: `Connection failed: ${response.statusText}`,
          organization: this.organization,
          project: this.project
        };
      }
    } catch (error) {
      return {
        success: false,
        status: 0,
        message: `Connection error: ${error.message}`,
        organization: this.organization,
        project: this.project
      };
    }
  }

  // Get DevOps item URL
  getDevOpsItemUrl(itemId) {
    return `${this.baseUrl}/${this.organization}/${encodeURIComponent(this.project)}/_workitems/edit/${itemId}`;
  }

  // Build hierarchy maps (ONEVIEW pattern)
  buildHierarchyMaps(allItemsMap, relations) {
    const parentToChildrenMap = new Map();
    const childToParentMap = new Map();
    
    // Initialize empty arrays for all items
    allItemsMap.forEach(item => {
      parentToChildrenMap.set(item.id, []);
    });

    // Build parent-child relationships
    relations.forEach(link => {
      if (link.source && link.target && link.rel === 'System.LinkTypes.Hierarchy-Forward') {
        const parentId = link.source.id;
        const childId = link.target.id;
        
        if (!parentToChildrenMap.has(parentId)) {
          parentToChildrenMap.set(parentId, []);
        }
        parentToChildrenMap.get(parentId).push(childId);
        childToParentMap.set(childId, parentId);
      }
    });

    return { parentToChildrenMap, childToParentMap };
  }

  // Get sorted hierarchy (ONEVIEW pattern)
  getSortedHierarchy(initiative, allItemsMap, relations) {
    const { parentToChildrenMap } = this.buildHierarchyMaps(allItemsMap, relations);
    const allHierarchyItems = [];
    const allDescendantIds = new Set();
    const visited = new Set();

    // Define hierarchy order for work item types
    const typeOrder = {
      'Initiative': 0,
      'Epic': 1,
      'Feature': 2,
      'User Story': 3,
      'Task': 4,
      'Bug': 5,
      'Risk': 6
    };

    function dfs(itemId, level, parentSortOrder = 0) {
      if (visited.has(itemId)) return;
      visited.add(itemId);
      allDescendantIds.add(itemId);

      const item = allItemsMap.get(itemId);
      if (!item) return;

      const workItemType = item.fields['System.WorkItemType'] || 'Default';
      const sortOrder = typeOrder[workItemType] !== undefined ? typeOrder[workItemType] : 999;

      allHierarchyItems.push({
        ...item,
        level: level,
        sortOrder: parentSortOrder * 1000 + sortOrder,
        workItemType: workItemType
      });

      // Get children and sort them by type
      const childrenIds = parentToChildrenMap.get(itemId) || [];
      const childrenWithTypes = childrenIds
        .map(childId => {
          const childItem = allItemsMap.get(childId);
          return {
            id: childId,
            item: childItem,
            type: childItem?.fields['System.WorkItemType'] || 'Default',
            sortOrder: typeOrder[childItem?.fields['System.WorkItemType']] || 999
          };
        })
        .sort((a, b) => a.sortOrder - b.sortOrder);

      childrenWithTypes.forEach((child, index) => {
        dfs(child.id, level + 1, parentSortOrder * 1000 + sortOrder + index);
      });
    }

    dfs(initiative.id, 0);

    // Filter items with valid dates and maintain hierarchical order
    const orderedItems = allHierarchyItems
      .filter(item => {
        const startDate = item.fields['Microsoft.VSTS.Scheduling.StartDate'];
        const targetDate = item.fields['Microsoft.VSTS.Scheduling.TargetDate'];
        return startDate && targetDate && 
               !isNaN(new Date(startDate)) && 
               !isNaN(new Date(targetDate));
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return { orderedItems, allDescendantIds };
  }

  // Find associated risks (ONEVIEW pattern)
  findAssociatedRisks(hierarchyItemIds, allItemsMap, childToParentMap) {
    const risks = [];
    const addedRiskIds = new Set();

    for (const item of allItemsMap.values()) {
      if (item.fields['System.WorkItemType'] === 'Risk' && !addedRiskIds.has(item.id)) {
        // Check if this risk is related to any item in our hierarchy
        let currentItem = item;
        let parentId = childToParentMap.get(currentItem.id);
        
        while (parentId && !hierarchyItemIds.has(parentId)) {
          currentItem = allItemsMap.get(parentId);
          if (!currentItem) break;
          parentId = childToParentMap.get(currentItem.id);
        }

        if (parentId && hierarchyItemIds.has(parentId)) {
          const parentItem = allItemsMap.get(parentId);
          risks.push({
            risk: item,
            parent: parentItem
          });
          addedRiskIds.add(item.id);
        }
      }
    }

    return risks;
  }

  // Find associated OKRs (ONEVIEW pattern)
  findAssociatedOKRs(hierarchyItemIds, okrItemsMap, okrChildToParentMap) {
    const okrs = [];
    const addedOKRIds = new Set();

    console.log("Finding OKRs for hierarchy items:", Array.from(hierarchyItemIds));

    // Find OKRs that are connected to our hierarchy
    for (const okr of okrItemsMap.values()) {
      const workItemType = okr.fields['System.WorkItemType'];
      
      if ((workItemType === 'Objective' || workItemType === 'Key Result') && !addedOKRIds.has(okr.id)) {
        // Check connections through title matching or other relationships
        const okrTitle = okr.fields['System.Title'] || '';
        const okrDescription = okr.fields['System.Description'] || '';
        
        // Simple matching strategy - can be enhanced
        for (const hierarchyId of hierarchyItemIds) {
          const hierarchyItem = okrItemsMap.get(hierarchyId) || new Map(Array.from(okrItemsMap.values()).map(item => [item.id, item])).get(hierarchyId);
          if (hierarchyItem) {
            const hierarchyTitle = hierarchyItem.fields?.['System.Title'] || '';
            
            // If there's a title match or relationship, include this OKR
            if (okrTitle.toLowerCase().includes(hierarchyTitle.toLowerCase().substring(0, 10)) ||
                hierarchyTitle.toLowerCase().includes(okrTitle.toLowerCase().substring(0, 10))) {
              okrs.push({
                id: okr.id,
                title: okrTitle,
                type: workItemType,
                state: okr.fields['System.State'] || 'New',
                description: okrDescription,
                url: this.getDevOpsItemUrl(okr.id),
                connectedTo: hierarchyItem
              });
              addedOKRIds.add(okr.id);
              break;
            }
          }
        }
      }
    }

    console.log("Total OKRs found:", okrs.length);
    return okrs.sort((a, b) => {
      if (a.type === 'Objective' && b.type === 'Key Result') return -1;
      if (a.type === 'Key Result' && b.type === 'Objective') return 1;
      return a.title.localeCompare(b.title);
    });
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
        url: this.getDevOpsItemUrl(workItem.id)
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

  // Get work item type style
  getWorkItemTypeStyle(workItemType) {
    return workItemTypeStyles[workItemType] || workItemTypeStyles.Default;
  }
}

// Export singleton instance
export const azureDevOpsService = new AzureDevOpsService();

// Configuration validation
export function validateDevOpsConfiguration() {
  const issues = [];
  const pat = localStorage.getItem('azure_devops_pat') || '';

  if (!pat || pat.length < 50) {
    issues.push("PAT is too short or not defined");
  }

  if (!AZURE_DEVOPS_CONFIG.queryId || AZURE_DEVOPS_CONFIG.queryId.length !== 36) {
    issues.push("Query ID must be 36 characters");
  }

  if (!AZURE_DEVOPS_CONFIG.okrQueryId || AZURE_DEVOPS_CONFIG.okrQueryId.length !== 36) {
    issues.push("OKR Query ID must be 36 characters");
  }

  return issues;
}

// Legacy function for backward compatibility
export async function fetchInitiatives() {
  try {
    const data = await azureDevOpsService.fetchDevOpsData();
    const initiatives = data.items.filter(item => 
      item.fields['System.WorkItemType'] === 'Initiative'
    );
    return initiatives;
  } catch (error) {
    console.warn('Failed to fetch from Azure DevOps, falling back to API:', error);
    
    // Fallback to API endpoint
    const response = await fetch('/api/initiatives');
    if (!response.ok) {
      throw new Error('Failed to fetch initiatives');
    }
    
    return await response.json();
  }
}

export default azureDevOpsService;
