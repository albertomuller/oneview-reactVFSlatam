# Azure App Service Deployment Instructions

## Option 1: GitHub Actions Deployment (RECOMMENDED)

Your GitHub Actions workflow is ready, you just need to configure the publish profile.

### Step 1: Get Publish Profile from Azure
1. Go to your Azure Portal
2. Navigate to your App Service "OneView-VFSLATAM"
3. Click "Get publish profile" in the top menu
4. Download the `.publishsettings` file
5. Open the file and copy all its contents

### Step 2: Configure GitHub Secret
1. Go to your GitHub repository: https://github.com/albertomuller/oneview-reactVFSlatam
2. Click "Settings" tab
3. Click "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Name: `AZUREAPPSERVICE_PUBLISHPROFILE_SECRETNAME`
6. Value: Paste the entire contents of the `.publishsettings` file
7. Click "Add secret"

### Step 3: Push Code and Deploy
```bash
cd /Users/betomuller/Downloads/oneview-react
git add .
git commit -m "Fix server static file serving and prepare for deployment"
git push origin main
```

The GitHub Actions workflow will automatically:
- Build your React app
- Create deployment package
- Deploy to Azure App Service

## Option 2: Manual FTP Deployment

If GitHub Actions doesn't work, you can use FTP:

### Step 1: Get FTP Credentials
1. In Azure Portal, go to your App Service
2. Click "Deployment Center"
3. Click "FTPS credentials"
4. Note the FTP endpoint, username, and password

### Step 2: Prepare Deployment Package
Your deployment package should contain:
- `/dist/` folder (React build)
- `/api/` folder (Node.js backend)
- `/package.json`
- `/web.config`

### Step 3: Upload via FTP
Use any FTP client or command line to upload to `/site/wwwroot/`

## Option 3: Azure CLI Deployment

If you install Azure CLI, you can deploy directly:

```bash
# Install Azure CLI
brew install azure-cli

# Login and deploy
az login
az webapp deployment source config-zip \
  --resource-group <your-resource-group> \
  --name OneView-VFSLATAM \
  --src oneview-deploy.zip
```

## Troubleshooting

### If you get "App Service is not serving content":
1. Check that `web.config` is in the root
2. Verify `api/server-production.js` serves static files
3. Check App Service logs in Azure Portal

### If API endpoints don't work:
1. Ensure `package.json` has the correct start script
2. Check that port is set correctly (process.env.PORT)
3. Verify environment variables in Azure App Service

## Current Status
✅ React app builds successfully  
✅ Server code fixed to serve static files  
✅ Frontend dependencies added to package.json  
✅ Build process creates dist/index.html  
✅ Deployment package ready  
✅ Azure configuration updated (web.config, package.json)  
🔄 Ready for deployment  

## Key Fixes Applied:
1. **Updated package.json**: Added React dependencies and proper build script
2. **Fixed web.config**: Updated to point to server.js instead of api/server-production.js  
3. **Enhanced server.js**: Better static file serving and error handling
4. **Updated deployment script**: Ensures dist folder is built during deployment
5. **Verified build process**: React app builds correctly and creates dist/index.html

## Build Verification:
```bash
# ✅ This now works successfully:
npm run build:frontend
# Creates: dist/index.html and dist/assets/

# ✅ Full build process:
npm run build
# Installs dependencies, builds frontend, installs API dependencies
```
