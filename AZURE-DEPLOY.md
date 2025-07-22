# Azure App Service - Configuração de Deploy

## Comandos de Startup Recomendados (teste um por vez):

### Opção 1 - Usando nosso script otimizado:
```bash
chmod +x startup.sh && ./startup.sh
```

### Opção 2 - Comando direto simples:
```bash
npm install --omit=dev --no-audit --no-fund --prefer-offline && npm run build:frontend && cd api && npm install --omit=dev --no-audit --no-fund && cd .. && node server.js
```

### Opção 3 - Minimalista (se dist/ já existir):
```bash
npm install --omit=dev --no-audit --no-fund && node server.js
```

### Opção 4 - Ultra simples (para teste):
```bash
npm start
```

## Variáveis de Ambiente Necessárias:
- `PORT=8080` (já definido automaticamente pelo Azure)
- `NODE_ENV=production`
- `USE_MOCK_DATA=true` (para testar sem banco)

## Estrutura Esperada Após Deploy:
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

## Troubleshooting:

1. **Container não responde na porta 8080:**
   - Verificar se server.js está fazendo bind em 0.0.0.0
   - Verificar se PORT=8080 está definido
   - Testar endpoint /health

2. **Build muito lento:**
   - Usar dist/ pré-compilado (incluído no git)
   - Usar startup commands mais simples

3. **Dependências faltando:**
   - Verificar se package-lock.json está incluído
   - Usar npm install em vez de npm ci se necessário
