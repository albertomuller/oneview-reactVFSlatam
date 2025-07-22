# 🚀 OneView React - Guia de Deploy no Azure (CORRIGIDO)

## ✅ Erros Identificados e Corrigidos

### 🔧 Problemas Resolvidos:
1. **❌ Porta fixa no servidor** → ✅ Agora usa `process.env.PORT || 7071`
2. **❌ Dependências do frontend faltando** → ✅ Restauradas todas as dependências React/Vite  
3. **❌ Scripts de desenvolvimento ausentes** → ✅ Adicionados `npm run dev`, `npm run build`
4. **❌ Proxy do Vite com porta incorreta** → ✅ Corrigido para porta 3001 (desenvolvimento)

### 🧪 Testes Realizados:
- ✅ Backend rodando na porta 3001: http://localhost:3001/api/health
- ✅ Frontend rodando na porta 5175: http://localhost:5175
- ✅ Endpoints funcionando: /api/health, /api/initiatives
- ✅ Dependências instaladas sem erros

## 🏗️ Configurações para Deploy no Azure

### Web App Settings:
- **Name:** Oneview-VFSLATAM
- **Runtime stack:** Node 20 LTS ✅
- **Operating System:** Linux ✅
- **Region:** Brazil South (ou Canada Central)
- **Publish:** Code ✅
- **SKU:** B1 Basic (para testes) ou P1v3 (produção)

### 1. Application Settings no Azure:
```bash
NODE_VERSION=20.x
WEBSITE_NODE_DEFAULT_VERSION=~20
SCM_DO_BUILD_DURING_DEPLOYMENT=true
USE_MOCK_DATA=true
NODE_ENV=production
PORT=8080
```

### 2. Startup Command:
```bash
node server.js
```

### 3. Build Command para Azure:
O arquivo `package.json` foi atualizado com:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build-azure": "npm install && cd api && npm install && npm run build",
    "start": "cd api && node server-production.js"
  }
}
```

## 📦 Deploy Options

### Opção 1: Deploy via Azure CLI (Recomendado)
```bash
# 1. Build the project
cd /Users/betomuller/Downloads/oneview-react
npm run build

# 2. Deploy to Azure
az webapp up --name oneview-vfslatam --resource-group RG-DATA-STAGING --runtime "NODE:20-lts"
```

### Opção 2: Deploy via ZIP
```bash
# 1. Create deployment ZIP
npm run build
zip -r deploy.zip . -x "node_modules/*" ".git/*" "*.log"

# 2. Upload via Azure Portal
# Vá para: Development Tools → Advanced Tools → Kudu → ZIP Push Deploy
```

### Opção 3: GitHub Actions (Produção)
1. Push código para GitHub
2. No Azure Portal: **Deployment Center → GitHub**
3. Configure o workflow automático

## 🌐 URLs Após Deploy

- **Aplicação:** https://oneview-vfslatam.azurewebsites.net
- **API Health:** https://oneview-vfslatam.azurewebsites.net/api/health
- **API Initiatives:** https://oneview-vfslatam.azurewebsites.net/api/initiatives

## 🔍 Validação Pós-Deploy

### 1. Testar Endpoints:
```bash
# Health check
curl https://oneview-vfslatam.azurewebsites.net/api/health

# Initiatives
curl https://oneview-vfslatam.azurewebsites.net/api/initiatives
```

### 2. Verificar Logs:
- Azure Portal → **Log stream**
- Application Insights → **Live Metrics**

### 3. Checklist de Validação:
- [ ] ✅ Aplicação carrega sem erros 500
- [ ] ✅ /api/health retorna status "ok"
- [ ] ✅ /api/initiatives retorna dados
- [ ] ✅ Frontend renderiza corretamente
- [ ] ✅ Sem erros no console do navegador

## ⚠️ Troubleshooting

### Erro: "address already in use"
- ✅ **Resolvido:** Servidor agora usa `process.env.PORT`

### Erro: "Missing script: dev"
- ✅ **Resolvido:** Scripts adicionados no `package.json`

### Erro: Dependencies not found
- ✅ **Resolvido:** Todas as dependências React/Vite restauradas

### Se o deploy falhar:
1. Verificar se a região permite o SKU selecionado
2. Usar região "East US" ou "West Europe" como alternativa
3. Reduzir SKU para B1 Basic se houver restrições de política

## 🚀 Próximos Passos

1. **Deploy no Azure** com configurações corrigidas
2. **Configurar Managed Identity** para Azure SQL
3. **Testar integração real** com Azure DevOps (desativar mock)
4. **Configurar Application Insights** para monitoramento
5. **Ajustar settings** para produção

---

## 📝 Notas de Desenvolvimento

### Ambiente Local:
- Backend: `PORT=3001 npm start` (http://localhost:3001)
- Frontend: `npm run dev` (http://localhost:5175)
- Build: `npm run build` (produção)

### Estrutura de Arquivos Corrigida:
- ✅ `package.json` - Scripts completos para dev/build/start
- ✅ `api/server-production.js` - Porta dinâmica
- ✅ `vite.config.js` - Proxy correto para desenvolvimento
- ✅ Todas as dependências React/Vite restauradas
