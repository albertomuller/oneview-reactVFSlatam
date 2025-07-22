a# 🔧 Production Configuration for Real Data

## 📋 **INFORMATION NEEDED FROM AZURE:**

### **1. Azure SQL Database Details:**
I need these from your Azure Portal:

**Azure SQL Database:**
- **Server name**: (e.g., `sqlsrv-datastaging-prd.database.windows.net`)
- **Database name**: (e.g., `oneviewvfslatam`)  
- **Username**: (Admin username)
- **Password**: (Admin password)

**Where to find this:**
- Azure Portal → SQL databases → Your database → Connection strings

### **2. Azure DevOps Details:**
**Organization & Project:**
- **Azure DevOps Organization**: (e.g., `VolvoGroup-MASDCL`)
- **Project name**: (e.g., `VFSDITSA-1018751-COE LATAM`)

**Personal Access Token:**
- Go to: https://dev.azure.com/[your-org]/_usersSettings/tokens
- Create token with permissions: **Work Items (Read & Write)**, **Project and Team (Read)**

## 📋 **INFORMATION NEEDED FROM GITHUB:**

### **GitHub Secrets Configuration:**
Check if you have this secret configured:
- Repository: https://github.com/albertomuller/oneview-reactVFSlatam
- Settings → Secrets and variables → Actions
- Look for: `AZUREAPPSERVICE_PUBLISHPROFILE_SECRETNAME`

**If missing:** Download the publish profile from Azure Portal → App Service → Get publish profile

## 🔧 **AZURE APP SERVICE ENVIRONMENT VARIABLES I'LL CONFIGURE:**

Once you provide the information above, I'll help you set these in Azure:

```bash
# Database Configuration
SQL_SERVER=your-sql-server.database.windows.net
SQL_DATABASE=your-database-name
SQL_USERNAME=your-username
SQL_PASSWORD=your-password

# Azure DevOps Configuration  
AZURE_DEVOPS_ORG=your-org
AZURE_DEVOPS_PROJECT=your-project
AZURE_DEVOPS_TOKEN=your-personal-access-token

# Application Configuration
USE_MOCK_DATA=false
NODE_ENV=production
PORT=8080
NODE_VERSION=20.x
```

## 🚨 **SECURITY NOTE:**
- **Never share passwords in plain text**
- I'll guide you to configure them directly in Azure Portal
- Personal Access Tokens should be treated as passwords

## 📝 **WHAT YOU CAN SHARE:**
✅ **Safe to share:**
- SQL Server name (public endpoint)
- Database name
- Username (not password)
- Azure DevOps organization name
- Project name

❌ **Don't share:**
- Passwords
- Personal Access Tokens
- Connection strings with credentials

## 🎯 **NEXT STEPS:**

1. **Gather the information above**
2. **I'll provide exact Azure configuration steps**
3. **We'll test database connectivity**
4. **Configure GitHub secrets if needed**
5. **Deploy and test with real data**

---

**What specific information can you provide first?** (Start with whatever you're comfortable sharing)
