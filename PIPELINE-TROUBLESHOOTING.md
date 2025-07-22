# 🔧 Azure Pipeline Troubleshooting Guide

## ❌ Common Error Fixed: "No commit found for SHA: v"

This error typically occurs due to YAML formatting issues or complex pipeline configurations.

### ✅ **SOLUTION APPLIED:**

1. **Simplified Pipeline Structure**
   - Removed complex multi-stage pipeline
   - Used simple trigger syntax: `trigger: - main`
   - Simplified pool configuration

2. **Fixed YAML Syntax**
   - Removed nested branch configurations
   - Simplified job structure
   - Added clean backup version: `azure-pipelines-fixed.yml`

### 🚀 **Files Updated:**
- ✅ `azure-pipelines.yml` - Main pipeline (simplified)
- ✅ `azure-pipelines-fixed.yml` - Clean backup version

### 🔄 **Next Steps:**

1. **In Azure DevOps Portal:**
   - Go to Pipelines → New Pipeline
   - Connect to GitHub repository: `albertomuller/oneview-reactVFSlatam`
   - Select "Existing Azure Pipelines YAML file"
   - Choose: `/azure-pipelines.yml` or `/azure-pipelines-fixed.yml`

2. **If Still Having Issues:**
   - Try using `azure-pipelines-fixed.yml` (cleanest version)
   - Ensure Azure DevOps has proper GitHub permissions
   - Check repository access in Azure DevOps settings

### 📋 **Pipeline Features:**
- ✅ Node.js 20.x setup
- ✅ NPM dependency installation
- ✅ React build process
- ✅ Artifact archiving and publishing
- ✅ Build verification steps

### 🛠️ **Manual Pipeline Creation:**
If automatic detection fails, create pipeline manually:

```yaml
# Use content from azure-pipelines-fixed.yml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

variables:
  nodeVersion: '20.x'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '$(nodeVersion)'
- script: npm ci
- script: npm run build
- task: PublishBuildArtifacts@1
```

The pipeline should now parse correctly and run without errors! 🎉
