# 🔧 Azure App Service - Production Configuration (Using Existing OneView Token)

## 🎯 **COMPLETE PRODUCTION SETUP**

Since you want to use the token from the former OneView project, here's the complete Azure App Service configuration:

## ⚡ **AZURE APP SERVICE CONFIGURATION STEPS:**

### **Step 1: Fix Startup Command**
1. **Azure Portal** → **Oneview-VFSLATAM** → **Configuration** → **General settings**
2. **Startup Command**: Change to:
   ```bash
   node server.js
   ```

### **Step 2: Add All Environment Variables**
Go to **Configuration** → **Application settings** and add these one by one:

```bash
# Application Configuration
USE_MOCK_DATA=false
NODE_ENV=production
PORT=8080
NODE_VERSION=20.x
WEBSITE_NODE_DEFAULT_VERSION=~20

# Azure SQL Database (from your existing config)
SQL_SERVER=sqlsrv-datastaging-prd.database.windows.net
SQL_DATABASE=oneviewvfslatam
SQL_USERNAME=CloudSA1a10d43e
SQL_PASSWORD=sln4*931am<D3&2

# Azure DevOps (from your existing OneView project)
AZURE_DEVOPS_ORG=VolvoGroup-MASDCL
AZURE_DEVOPS_PROJECT=VFSDITSA-1018751-COE LATAM
```

### **Step 3: Azure DevOps Token (From Former OneView)**
Since you want to reuse the token from the former OneView project:

**Option A: If you have access to the former project's Azure App Service:**
1. Go to the old OneView App Service → Configuration → Application settings
2. Find `AZURE_DEVOPS_TOKEN` and copy its value
3. Add it to the new App Service

**Option B: If you know the token value:**
Add this setting:
```
Name: AZURE_DEVOPS_TOKEN
Value: [paste the token from former OneView project]
```

**Option C: If you need to find it in the former project:**
The token would be in one of these places:
- Former Azure App Service configuration
- Former project's Azure Key Vault
- Former project's environment variables

## 🔍 **TOKEN REQUIREMENTS:**
The token needs these permissions for Azure DevOps:
- ✅ **Work Items** (Read & Write)
- ✅ **Project and Team** (Read)
- ✅ Access to organization: `VolvoGroup-MASDCL`
- ✅ Access to project: `VFSDITSA-1018751-COE LATAM`

## 🚀 **FINAL STEPS:**

1. **Save** all configuration changes in Azure Portal
2. **Restart** the App Service
3. **Test** the application:
   - Health: `https://oneview-vfslatam-ckdngygka3bpaabq.eastus2-01.azurewebsites.net/api/health`
   - App: `https://oneview-vfslatam-ckdngygka3bpaabq.eastus2-01.azurewebsites.net`

## 📊 **EXPECTED HEALTH CHECK RESPONSE (Production Mode):**

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

## ❓ **NEED HELP FINDING THE TOKEN?**

Let me know:
1. **Do you have access to the former OneView Azure App Service?**
2. **Do you remember the token value?**
3. **Should I guide you to create a new token instead?**

---

**Next Step**: Get the Azure DevOps token from the former OneView project and add it to the configuration!
