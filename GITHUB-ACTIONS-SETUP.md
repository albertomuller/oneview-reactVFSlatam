# GitHub Actions Deployment Setup

This guide explains how to set up GitHub Actions to automatically deploy the OneView React application to Azure Web App.

## Prerequisites

1. **Azure Web App**: You need an Azure Web App service created and configured
2. **GitHub Repository**: Your code needs to be in a GitHub repository
3. **Azure Publish Profile**: Download from your Azure Web App

## Setup Steps

### 1. Create GitHub Repository

If you haven't already, push your code to GitHub:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - OneView React App"

# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/albertomuller/oneview-react.git

# Push to GitHub
git push -u origin main
```

### 2. Get Azure Publish Profile

1. Go to the Azure Portal
2. Navigate to your Web App (OneView-VFSLATAM)
3. Click on "Get publish profile" in the overview page
4. Download the `.PublishSettings` file
5. Open the file and copy all contents

### 3. Configure GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Name: `AZUREAPPSERVICE_PUBLISHPROFILE_SECRETNAME`
6. Value: Paste the entire contents of the publish profile file
7. Click "Add secret"

### 4. Configure App Settings in Azure

In your Azure Web App, set these Application Settings:

```
NODE_ENV=production
WEBSITE_NODE_DEFAULT_VERSION=20-lts
SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

### 5. Update package.json Scripts

Ensure your `package.json` has these scripts:

```json
{
  "scripts": {
    "build": "npm run build:client && npm run build:api",
    "build:client": "vite build",
    "build:api": "echo 'API build complete'",
    "start": "node server-simple.js",
    "test": "echo 'No tests specified'"
  }
}
```

### 6. Workflow Triggers

The GitHub Action will trigger on:
- Push to `main` branch
- Manual trigger via GitHub Actions tab

### 7. Deployment Process

The workflow will:
1. **Build**: 
   - Set up Node.js 20.x
   - Run `npm install`
   - Run `npm run build`
   - Run tests (if any)
   
2. **Package**:
   - Create a zip file with all application files
   - Upload as artifact

3. **Deploy**:
   - Download the artifact
   - Deploy to Azure Web App using publish profile

### 8. Environment Configuration

For production deployment, ensure these files are configured:

- **web.config**: IIS configuration for Node.js
- **server-simple.js**: Production server
- **startup.txt**: Startup command for Azure

### 9. Monitoring Deployment

1. Check the "Actions" tab in your GitHub repository
2. View logs for each deployment step
3. Monitor Azure Web App logs in the Azure Portal

### 10. Custom Domain and SSL

If you have a custom domain:
1. Configure custom domain in Azure Web App
2. Enable SSL certificate
3. Update any hardcoded URLs in the application

## Troubleshooting

### Common Issues

1. **Build Fails**: Check Node.js version compatibility
2. **Deployment Fails**: Verify publish profile secret
3. **App Doesn't Start**: Check startup command and web.config
4. **API Errors**: Verify environment variables and connection strings

### Debugging Steps

1. Check GitHub Actions logs
2. View Azure Web App deployment center
3. Check Application Insights (if enabled)
4. Review web.config and server logs

## Production Checklist

- [ ] GitHub repository created and code pushed
- [ ] Azure Web App created and configured
- [ ] Publish profile downloaded and added as GitHub secret
- [ ] Package.json scripts updated
- [ ] GitHub Actions workflow file committed
- [ ] Environment variables configured in Azure
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate enabled
- [ ] Database connections tested
- [ ] API endpoints verified

## Files Structure

```
.github/
  workflows/
    azure-webapps-node.yml    # GitHub Actions workflow
web.config                   # IIS configuration
server-simple.js            # Production server
package.json                # Build and start scripts
.azure/                     # Azure configuration files
AZURE-DEPLOY-GUIDE.md      # Azure deployment guide
```

## Support

For issues with:
- **GitHub Actions**: Check repository Actions tab
- **Azure Deployment**: Check Azure Portal deployment center
- **Application Issues**: Check Azure Application Insights or logs
