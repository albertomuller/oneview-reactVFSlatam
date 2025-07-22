# 🚀 OneView React - Database Configuration & Deployment

## 📋 Database Credentials Configured

The following database credentials have been configured:

- **Server**: `sqlsrv-datastaging-prd.database.windows.net`
- **Database**: `oneviewvfslatam`
- **Username**: `CloudSA1a10d43e`
- **Password**: `sln4*931am<D3&2`

## 🔧 Environment Configuration

### Local Development (.env)
The API is configured to use SQL authentication with the provided credentials.

### Azure App Service Environment Variables
When deploying to Azure, configure these environment variables:

```
SQL_SERVER=sqlsrv-datastaging-prd.database.windows.net
SQL_DATABASE=oneviewvfslatam
SQL_USERNAME=CloudSA1a10d43e
SQL_PASSWORD=sln4*931am<D3&2
USE_MOCK_DATA=false
AZURE_DEVOPS_ORG=VolvoGroup-MASDCL
AZURE_DEVOPS_PROJECT=VFSDITSA-1018751-COE LATAM
```

## 🛡️ Connection Notes

### Firewall Configuration
If you experience connection timeouts:

1. **Azure SQL Firewall**: Ensure the Azure App Service IP ranges are allowed
2. **Add Azure Services**: In Azure SQL firewall settings, enable "Allow Azure services and resources to access this server"
3. **App Service VNet**: Consider using VNet integration for better security

### Fallback Behavior
The application is configured to:
- ✅ Attempt SQL connection first
- 🔄 Fall back to mock data if connection fails
- 📝 Log connection status for debugging

## 🚀 Ready for Deployment

The application now has:
- ✅ Database credentials configured
- ✅ Environment variables set up
- ✅ Graceful fallback to mock data
- ✅ Production-ready server configuration

Deploy the `oneview-deploy-fixed.zip` package and configure the environment variables in Azure App Service.
