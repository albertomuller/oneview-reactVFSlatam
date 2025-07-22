# 🔧 Guia de Configuração de Conexões

## Configuração do Azure SQL Database

### ✅ Já Configurado
A conexão com Azure SQL já está configurada no arquivo `api/utils/database.js`:
- **Server**: `sqlsrv-datastaging-prd.database.windows.net`  
- **Database**: `oneviewvfslatam`
- **Autenticação**: Azure Active Directory Default

### 🔑 Requisitos para Produção
Para usar o banco real, você precisa:
1. **Credenciais Azure**: Estar logado com `az login` ou ter variáveis de ambiente configuradas
2. **Acesso ao Banco**: Permissões de leitura/escrita na database `oneviewvfslatam`

---

## Configuração do Azure DevOps

### 🎯 Personal Access Token (PAT)
1. Acesse: https://dev.azure.com/VolvoGroup-MASDCL/_usersSettings/tokens
2. Clique em "New Token"
3. Configure as permissões:
   - **Work Items**: Read & Write
   - **Project and Team**: Read
4. Copie o token gerado

### 🔧 Configuração
Edite o arquivo `api/.env`:
```bash
# Modo de produção
USE_MOCK_DATA=false

# Token do Azure DevOps
AZURE_DEVOPS_TOKEN=your_personal_access_token_here
```

---

## Como Testar as Conexões

### 1️⃣ Modo Mock (Atual)
```bash
cd api
USE_MOCK_DATA=true npm run start:production
```

### 2️⃣ Modo Produção
```bash
cd api
# Configure o .env com USE_MOCK_DATA=false e AZURE_DEVOPS_TOKEN
npm run start:production
```

### 3️⃣ Interface Web
1. Acesse http://localhost:5174
2. Clique na aba "Connections"  
3. Use os botões para testar:
   - **Test Azure SQL**: Testa conexão com banco
   - **Test DevOps**: Testa API do Azure DevOps
   - **Sync DevOps**: Sincroniza dados do DevOps para o banco

---

## Endpoints de Teste

### Health Check
```bash
curl http://localhost:7071/api/health
```

### Teste Azure SQL
```bash
curl http://localhost:7071/api/test/database
```

### Teste Azure DevOps  
```bash
curl http://localhost:7071/api/test/devops
```

---

## Estrutura do Banco de Dados

### Tabelas Esperadas
- `WorkItems`: Itens de trabalho do DevOps
- `CustomFields`: Campos customizados das iniciativas

### Schema Sugerido
```sql
-- WorkItems table
CREATE TABLE WorkItems (
    Id int PRIMARY KEY,
    Title nvarchar(255),
    WorkItemType nvarchar(50),
    State nvarchar(50),
    AreaPath nvarchar(255),
    AssignedTo nvarchar(255),
    CreatedBy nvarchar(255),
    CreatedDate datetime2,
    ChangedDate datetime2
);

-- CustomFields table  
CREATE TABLE CustomFields (
    WorkItemId int FOREIGN KEY REFERENCES WorkItems(Id),
    DPM nvarchar(255),
    BusinessOwner nvarchar(255),
    ProductOwner nvarchar(255),
    TechnicalLead nvarchar(255),
    Architect nvarchar(255),
    CyberSecurity nvarchar(255),
    StrategicIntent nvarchar(max),
    KeyResults nvarchar(max),
    DeadlineStatus nvarchar(50),
    ExternalCost nvarchar(50),
    InternalResources nvarchar(50),
    LastModified datetime2 DEFAULT GETDATE()
);
```

---

## ⚠️ Segurança

- **Nunca commitar** o arquivo `.env` com credenciais reais
- Use **Managed Identity** em produção no Azure
- **Rotacione tokens** regularmente (max 90 dias)
- **Princípio do menor privilégio** para permissões
