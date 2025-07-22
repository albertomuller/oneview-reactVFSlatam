# 🔧 Azure App Service Configuration Required

## ❌ **CURRENT ISSUE: Application Error**

The deployment is now working (files are uploaded), but the application is crashing because Azure App Service doesn't have the required environment variables configured.

## 🔑 **REQUIRED AZURE APP SERVICE SETTINGS**

You need to configure these environment variables in your Azure App Service:

### **Go to Azure Portal → App Service → Configuration → Application Settings**

Add these environment variables:

```bash
# Data Source Mode (set to true for now to avoid database issues)
USE_MOCK_DATA=true

# Port Configuration (Azure sets this automatically, but good to have)
PORT=8080

# Node Environment
NODE_ENV=production

# Optional: If you want to use real data later, add these:
# SQL_SERVER=your-sql-server.database.windows.net
# SQL_DATABASE=your-database-name
# SQL_USERNAME=your-username
# SQL_PASSWORD=your-password
# AZURE_DEVOPS_ORG=your-org
# AZURE_DEVOPS_PROJECT=your-project
# AZURE_DEVOPS_TOKEN=your-token
```

## 🚀 **QUICK FIX STEPS**

### Option 1: Use Mock Data (Recommended for testing)
1. Go to **Azure Portal**
2. Navigate to your **App Service "OneView-VFSLATAM"**
3. Click **Configuration** in the left menu
4. Click **Application settings**
5. Click **+ New application setting**
6. Add: `USE_MOCK_DATA` = `true`
7. Click **Save**
8. App will restart automatically

### Option 2: Configure Real Database (Production)
If you want to use the real database, add all the environment variables from the `.env.example` file with real values.

## 📋 **AZURE APP SERVICE CONFIGURATION SCREENSHOTS NEEDED:**

If you need help, I can guide you through:
1. Setting up the environment variables
2. Configuring startup commands
3. Checking Azure logs for detailed error messages

## 🔍 **TO CHECK AZURE LOGS:**

1. Go to **Azure Portal** → **App Service** → **Log stream**
2. Or **Monitoring** → **Log stream**
3. This will show you the exact error causing the crash

---

**Current Status**: ✅ Deployment working, ❌ App crashing due to missing environment variables
**Next Step**: Configure `USE_MOCK_DATA=true` in Azure App Service settings
