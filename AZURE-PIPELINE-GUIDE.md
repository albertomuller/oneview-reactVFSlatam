# Azure Pipeline Configuration Guide for OneView React

## 🚀 Quick Setup

### Option 1: Use the Simple Pipeline (Recommended for Getting Started)
1. Copy the contents of `azure-pipelines-simple.yml` 
2. In Azure DevOps, go to Pipelines > New Pipeline
3. Select your repository and choose "Existing Azure Pipelines YAML file"
4. Select `azure-pipelines-simple.yml`
5. Configure the required variables (see below)

### Option 2: Use the Full Pipeline (Advanced Features)
1. Copy the contents of `azure-pipelines.yml`
2. Follow the same steps but select the full pipeline file
3. Configure additional variables as needed

## 🔧 Required Configuration

### 1. Azure Static Web Apps Token
You need to get your deployment token:

1. Go to Azure Portal
2. Navigate to your Static Web App
3. Go to "Overview" > "Manage deployment token"
4. Copy the token
5. In Azure DevOps:
   - Go to Pipelines > Library
   - Create new Variable Group or go to your pipeline
   - Add variable: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Paste your token as the value
   - **Mark as secret**

### 2. Update Pipeline Variables
In your pipeline YAML, update these variables as needed:

```yaml
variables:
  # Change these to match your setup
  staticWebAppName: 'your-oneview-app-name'
  resourceGroupName: 'your-resource-group'
  azureSubscription: 'your-azure-subscription-name'
```

## 📋 Pipeline Features

### Simple Pipeline (`azure-pipelines-simple.yml`)
- ✅ Node.js 20.x setup
- ✅ NPM install and build
- ✅ Copy configuration files
- ✅ Deploy to Azure Static Web Apps
- ✅ ~2-5 minute build time

### Full Pipeline (`azure-pipelines.yml`)
- ✅ All simple pipeline features, plus:
- ✅ Comprehensive testing and validation
- ✅ Build artifacts archiving
- ✅ Health checks after deployment
- ✅ Multi-environment support
- ✅ Build info and notifications
- ✅ ~5-10 minute build time

## 🌐 Supported Deployment Targets

### Azure Static Web Apps (Recommended)
- Perfect for React SPAs
- Automatic HTTPS and custom domains
- Global CDN distribution
- Serverless API support
- Cost-effective for most use cases

### Azure App Service (Alternative)
If you prefer App Service, uncomment the App Service deployment task in the full pipeline.

## 🔒 Environment Setup

### Development Environment
- Triggers on: `develop` branch
- Variables: Use development values
- Optional: Deploy to staging slot

### Production Environment  
- Triggers on: `main` branch
- Variables: Use production values
- Requires approval (configure in Environments)

## 📝 Pipeline Variables Reference

### Required Variables
```yaml
# Set these in Azure DevOps
AZURE_STATIC_WEB_APPS_API_TOKEN: "your-deployment-token"
```

### Optional Variables
```yaml
# Customize these in the pipeline YAML
nodeVersion: '20.x'                    # Node.js version
buildConfiguration: 'production'       # Build config
staticWebAppName: 'oneview-react'     # Your app name
resourceGroupName: 'oneview-rg'       # Resource group
azureSubscription: 'your-subscription' # Subscription name
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails with "Module not found"**
   - Solution: Ensure `package-lock.json` is committed
   - Run `npm ci` instead of `npm install`

2. **Deployment Token Invalid**
   - Solution: Regenerate token in Azure Portal
   - Update the variable in Azure DevOps
   - Ensure token is marked as secret

3. **Build Succeeds but Site Shows 404**
   - Solution: Check `web.config` or `staticwebapp.config.json`
   - Verify SPA routing configuration

4. **API Functions Not Working**
   - Solution: Ensure API folder structure is correct
   - Check `api/host.json` configuration

### Build Environment Info
The pipeline will display:
- Node.js version
- NPM version  
- Build configuration
- Working directory
- Dependencies count
- Bundle size

### Health Checks
The full pipeline includes:
- ✅ Main page accessibility test
- ✅ Directors view test
- ✅ API health check (if configured)
- ✅ Build validation
- ✅ File structure verification

## 📈 Pipeline Stages Breakdown

### Simple Pipeline
1. **Build** (2-3 min)
   - Setup Node.js
   - Install dependencies
   - Build React app
   - Archive artifacts

2. **Deploy** (1-2 min)
   - Download artifacts
   - Deploy to Azure Static Web Apps

### Full Pipeline
1. **Build** (3-5 min)
   - Environment setup
   - Dependency installation
   - Code linting (optional)
   - Unit tests (optional)
   - Application build
   - Validation checks
   - Artifact creation

2. **Deploy** (2-3 min)
   - Artifact download
   - Azure deployment
   - Configuration file handling

3. **Post-Deployment** (1-2 min)
   - Health checks
   - Validation tests
   - Notification setup

4. **Summary** (30 sec)
   - Results summary
   - Feature confirmation
   - URL information

## 🎯 Next Steps After Setup

1. **Test the Pipeline**
   - Make a small change to README.md
   - Commit to main branch
   - Watch the pipeline run

2. **Configure Environments**
   - Set up approval gates for production
   - Configure environment-specific variables

3. **Add Notifications**
   - Configure Teams/Slack notifications
   - Set up email alerts for failures

4. **Monitor Performance**
   - Track build times
   - Monitor deployment success rates
   - Set up Application Insights (optional)

## 💡 Best Practices

- Use the simple pipeline first, upgrade to full pipeline later
- Always test in a feature branch before merging to main
- Keep deployment tokens secure and rotate regularly
- Monitor build logs for performance optimization opportunities
- Use branch policies to require successful builds before merging

---

**Your OneView React app with Volvo UX/UI is ready for Azure deployment! 🎉**
