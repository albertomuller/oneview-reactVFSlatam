# Azure App Service - Configuração de Deploy

## ⚙️ CONFIGURAÇÕES OBRIGATÓRIAS NO AZURE:

### 1. **Configuration → General Settings:**
- **Runtime stack**: `Node`
- **Major version**: `20`
- **Minor version**: `20 LTS`
- **Startup Command**: (veja opções abaixo)

### 2. **Configuration → Application Settings (Environment Variables):**
```
NODE_ENV = production
USE_MOCK_DATA = true
WEBSITE_NODE_DEFAULT_VERSION = 20.19.1
SCM_DO_BUILD_DURING_DEPLOYMENT = false
```

### 3. **Configuration → Platform Settings:**
- **FTP state**: `FTPS only` ou `Disabled`
- **HTTP version**: `2.0`
- **Web sockets**: `On` (se necessário)
- **Always On**: `On` (recomendado)

## 🚀 Comandos de Startup (teste um por vez):

### Opção 1 - Comando mais direto (RECOMENDADO):
```bash
npm install --omit=dev --no-audit --no-fund && npm start
```

### Opção 2 - Com build incluído:
```bash
npm install --omit=dev --no-audit --no-fund && npm run build:frontend && cd api && npm install --omit=dev --no-audit --no-fund && cd .. && node server.js
```

### Opção 3 - Usando nosso script otimizado:
```bash
chmod +x startup.sh && ./startup.sh
```

### Opção 4 - Ultra simples (para teste):
```bash
node server.js
```

## ⚠️ CONFIGURAÇÕES CRÍTICAS NO PORTAL AZURE:

### A. **Deployment Center:**
- **Source**: GitHub
- **Organization**: (sua conta)
- **Repository**: oneview-reactVFSlatam
- **Branch**: main
- **Build Provider**: App Service Build Service

### B. **Configuration → Path mappings:**
- Verificar se está configurado corretamente
- **Virtual Path**: `/`
- **Physical Path**: `site\wwwroot`

### C. **Monitoring → Log stream:**
- Habilitar para debug em tempo real
- Verificar se não há erros de permissão

## 🔧 Variáveis de Ambiente Necessárias:
## 🔧 Variáveis de Ambiente Necessárias:
```
NODE_ENV = production
USE_MOCK_DATA = true
WEBSITE_NODE_DEFAULT_VERSION = 20.19.1
SCM_DO_BUILD_DURING_DEPLOYMENT = false
WEBSITE_NPM_DEFAULT_VERSION = 10.9.2
```

## 🏗️ Estrutura Esperada Após Deploy:
```
/home/site/wwwroot/
├── dist/                    # Frontend built
│   ├── index.html
│   ├── assets/
├── api/
│   ├── node_modules/       # API dependencies
├── node_modules/           # Main dependencies
├── server.js              # Main server
├── package.json
└── startup.sh             # Startup script
```

## 🚨 Troubleshooting:

### 1. **Container não responde na porta 8080:**
- ✅ Verificar se server.js está fazendo bind em `0.0.0.0:8080`
- ✅ Confirmar que a variável `PORT=8080` está definida automaticamente
- ✅ Testar endpoint `/health` e `/api/health`
- ✅ Verificar logs em **Monitoring → Log stream**

### 2. **Build muito lento ou timeout:**
- ✅ Usar dist/ pré-compilado (já incluído no git)
- ✅ Definir `SCM_DO_BUILD_DURING_DEPLOYMENT = false`
- ✅ Usar startup commands mais diretos

### 3. **Dependências faltando:**
- ✅ Verificar se `package-lock.json` está incluído no repositório
- ✅ Usar `npm install` em vez de `npm ci` se necessário
- ✅ Confirmar que `api/package-lock.json` também está presente

### 4. **Erro "Cannot GET /":**
- ✅ Verificar se pasta `dist/` foi incluída no deployment
- ✅ Confirmar que `index.html` existe em `dist/index.html`
- ✅ Testar se o servidor está respondendo em `/api/health`

### 5. **Logs de Debug Úteis:**
- **Health Check**: `https://seu-app.azurewebsites.net/api/health`
- **Server Info**: `https://seu-app.azurewebsites.net/api/server-info`
- **Azure Logs**: Portal Azure → App Service → Monitoring → Log stream

## 🔄 Processo de Deploy Recomendado:

1. **Fazer alterações localmente**
2. **Testar local**: `npm start`
3. **Commit e push para GitHub**
4. **Azure detecta automaticamente e faz deploy**
5. **Monitorar logs**: Portal Azure → Log stream
6. **Testar endpoints**:
   - `/health` - Health check
   - `/api/health` - API health check
   - `/` - Frontend (React app)
