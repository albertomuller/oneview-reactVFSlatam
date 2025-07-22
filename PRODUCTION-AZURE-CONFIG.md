# 🔧 Azure App Service - Production Configuration (Real Data)

## 🎯 **USING YOUR EXISTING CREDENTIALS**

Based on the information you provided earlier, here's the exact configuration needed for Azure App Service.

## ⚡ **IMMEDIATE ACTION: Configure Azure App Service**

### **Step 1: Fix Startup Command**
1. **Azure Portal** → **Oneview-VFSLATAM** → **Configuration** → **General settings**
2. **Startup Command**: Change to:
   ```bash
   node server.js
   ```

### **Step 2: Add Environment Variables**
Go to **Configuration** → **Application settings** and add these:

```bash
# Production Mode
USE_MOCK_DATA=false
NODE_ENV=production
PORT=8080
NODE_VERSION=20.x

# Azure SQL Database
SQL_SERVER=sqlsrv-datastaging-prd.database.windows.net
SQL_DATABASE=oneviewvfslatam
SQL_USERNAME=CloudSA1a10d43e
SQL_PASSWORD=sln4*931am<D3&2

# Azure DevOps
AZURE_DEVOPS_ORG=VolvoGroup-MASDCL
AZURE_DEVOPS_PROJECT=VFSDITSA-1018751-COE LATAM
AZURE_DEVOPS_TOKEN=[YOU NEED TO CREATE THIS]
```

## 🔑 **MISSING: Azure DevOps Personal Access Token**

You still need to create the Azure DevOps Personal Access Token:

### **Create Personal Access Token:**
1. Go to: https://dev.azure.com/VolvoGroup-MASDCL/_usersSettings/tokens
2. Click **+ New Token**
3. **Name**: `OneView-API-Token`
4. **Expiration**: 90 days (or custom)
5. **Scopes**: 
   - ✅ **Work Items** (Read & Write)
   - ✅ **Project and Team** (Read)
6. Click **Create**
7. **COPY THE TOKEN** (you won't see it again)

### **Add Token to Azure:**
1. Back in Azure App Service → **Configuration** → **Application settings**
2. Add:
   ```
   Name: AZURE_DEVOPS_TOKEN
   Value: [paste the token you just created]
   ```

## 🚀 **FINAL STEPS:**

1. **Save** all configuration changes
2. **Restart** the App Service
3. Test the URLs:
   - Health: `https://oneview-vfslatam-ckdngygka3bpaabq.eastus2-01.azurewebsites.net/api/health`
   - App: `https://oneview-vfslatam-ckdngygka3bpaabq.eastus2-01.azurewebsites.net`

## 🔍 **Expected Results:**

### **Successful Health Check Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-07-22T...",
  "mode": "production",
  "node_version": "v20.x.x",
  "port": 8080,
  "environment": "production",
  "dist_exists": true,
  "index_exists": true,
  "has_env_vars": {
    "USE_MOCK_DATA": true,
    "SQL_SERVER": true,
    "PORT": true
  }
}
```

## ⚠️ **IF DATABASE CONNECTION FAILS:**

The app will automatically fall back to mock data and log:
```
⚠️ Missing environment variables for production mode: []
🔄 Falling back to mock data mode...
```

---

**Next Step**: Create the Azure DevOps Personal Access Token and add it to Azure App Service configuration!
