# 🚨 URGENT: Azure App Service Configuration Fix

## ✅ **GOOD NEWS:** 
Deployment is working! The App Service exists and files are uploaded correctly.

## ❌ **ISSUE:** 
App configuration is wrong, causing runtime errors.

## 🔧 **IMMEDIATE FIXES NEEDED:**

### **Step 1: Fix Startup Command**
1. Go to **Azure Portal** → **Oneview-VFSLATAM** → **Configuration**
2. Click **General settings**
3. **Startup Command**: Change to:
   ```bash
   node server.js
   ```
   (Remove the `cd api &&` part)

### **Step 2: Add Environment Variables**
1. Still in **Configuration** → **Application settings**
2. Click **+ New application setting** and add:
   ```
   Name: USE_MOCK_DATA
   Value: true
   ```
3. Click **Save**

### **Step 3: Restart the App**
1. Click **Restart** in the Azure Portal
2. Wait for restart to complete

## 🧪 **TEST AFTER CHANGES:**

After making these changes, test these URLs:

1. **Health Check**: 
   ```
   https://oneview-vfslatam-ckdngygka3bpaabq.eastus2-01.azurewebsites.net/api/health
   ```

2. **Main App**: 
   ```
   https://oneview-vfslatam-ckdngygka3bpaabq.eastus2-01.azurewebsites.net
   ```

## 🔍 **IF STILL NOT WORKING:**

### Check Azure Logs:
1. **Azure Portal** → **Oneview-VFSLATAM** → **Log stream**
2. Look for error messages
3. Share the error logs with me

### Expected Log Output (Success):
```
🔧 OneView Server Starting...
Node Version: v20.x.x
Environment: production  
Port: 8080
Mode: MOCK DATA
✅ Found dist folder and index.html
🚀 OneView running at http://localhost:8080
```

## ⚡ **QUICK SUMMARY:**

**Current Issue**: Wrong startup command and missing environment variables
**Fix**: 
1. Change startup command to `node server.js`
2. Add `USE_MOCK_DATA=true`
3. Restart app

**Expected Result**: App should load correctly and show the React frontend.

---

**Priority**: 🔥 **HIGH** - Simple configuration change should fix the issue immediately
