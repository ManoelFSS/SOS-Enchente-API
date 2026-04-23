# 🚀 Guia Completo de Deployment no Render

**URL da API:** https://sos-enchente-api.onrender.com/

---

## 1️⃣ CRIAR/VERIFICAR BANCO DE DADOS NO RENDER

### Opção A: PostgreSQL Nativo do Render (Recomendado)

1. Acesse https://dashboard.render.com
2. Clique em **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `sos-db`
   - **Database**: `sos_db`
   - **User**: `sos_user` (ou deixe gerar automaticamente)
   - **Region**: `São Paulo (South America)`
   - **PostgreSQL Version**: `15`
   - **Pricing Tier**: `Free` ou conforme sua necessidade

4. **Após criar, copie a URL da conexão (Internal Database URL)**
   - Será algo como: `postgresql://user:password@host:5432/database`

### Opção B: Banco PostgreSQL Externo

Se usar outro provedor (Supabase, Railway, etc):

1. Crie o banco e obtenha a URL de conexão
2. Copie a URL completa com credenciais

---

## 2️⃣ PREPARAR O CÓDIGO (Já está feito!)

### Verificar as dependências:

```bash
npm install
```

### Dependências principais já instaladas:

- ✅ **pg** (^8.20.0) - Driver PostgreSQL
- ✅ **express** (^5.2.1) - Framework web
- ✅ **jsonwebtoken** (^9.0.3) - JWT para autenticação
- ✅ **bcryptjs** (^3.0.3) - Hash de senhas
- ✅ **cors**, **helmet**, **morgan** - Segurança e logging
- ✅ **joi** (^18.1.2) - Validação

---

## 3️⃣ CRIAR A WEB SERVICE NO RENDER

1. Acesse https://dashboard.render.com
2. Clique em **New +** → **Web Service**
3. Escolha **Build and deploy from a Git repository**

### Configurar a conexão com GitHub:

4. Clique em **Connect account** e autorize o Render a acessar seu GitHub
5. Selecione o repositório: `api-sos`

### Configurar o serviço:

6. **Name**: `sos-enchente-api`
7. **Environment**: `Node`
8. **Build Command**: (deixe em branco - não precisa)
9. **Start Command**: `npm start`
10. **Plan**: `Free` (ou upgradable depois)
11. **Region**: `São Paulo (South America)` (mesma do banco)

---

## 4️⃣ CONFIGURAR VARIÁVEIS DE AMBIENTE

No dashboard do Render, na sua Web Service:

### Vá para: **Environment** e adicione as variáveis:

```
DATABASE_URL=postgresql://seu_usuario:sua_senha@seu_host:5432/seu_banco
JWT_SECRET=api-sos-secret-key-super-segura
NODE_ENV=production
PORT=3000
```

**Obter DATABASE_URL:**

- Se criou banco no Render: Vá até o banco PostgreSQL → copie **Internal Database URL**
- Se é externo: Use a URL fornecida pelo provedor

---

## 5️⃣ EXECUTAR O SCHEMA SQL (CRIAR TABELAS)

### Opção A: Via psql (terminal)

```bash
psql postgresql://seu_usuario:sua_senha@seu_host:5432/seu_banco < database/create_tables.sql
```

### Opção B: Via Render Console

1. Na Web Service, clique em **Shell**
2. Execute:

```bash
psql $DATABASE_URL < database/create_tables.sql
```

### Opção C: Via pgAdmin ou DBeaver

1. Conecte ao banco com a DATABASE_URL
2. Abra o arquivo `database/create_tables.sql`
3. Execute o SQL

---

## 6️⃣ FAZER DEPLOY

1. No dashboard do Render, clique em **Deploy** ou aguarde auto-deploy
2. Acompanhe os logs em **Logs**
3. Aguarde até ver: ✅ `Service is running on port 3000`

---

## 7️⃣ TESTAR A API

### Health Check:

```bash
curl https://sos-enchente-api.onrender.com/health
```

Esperado:

```json
{
  "status": "OK",
  "message": "API is running"
}
```

### Registrar Usuário:

```bash
curl -X POST https://sos-enchente-api.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

Esperado (201):

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "created_at": "2026-04-23T12:00:00.000Z"
  }
}
```

### Fazer Login:

```bash
curl -X POST https://sos-enchente-api.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

Esperado (200):

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 8️⃣ CONFIGURAR REDEPLOY AUTOMÁTICO

1. No Render, vá até **Settings** da Web Service
2. Ative **Auto-Deploy** quando fazer push para `main`
3. Agora, toda vez que você fazer `git push`, o Render irá:
   - Baixar o código
   - Instalar dependências (`npm install`)
   - Rodar `npm start`
   - Reiniciar a aplicação

---

## 📋 ENDPOINTS DISPONÍVEIS

### Autenticação

- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login (retorna JWT)
- `GET /auth/profile` - Obter perfil (requer Bearer token)

### Doações

- `GET /donations` - Listar todas (com filtros opcionais)
- `POST /donations` - Criar doação (requer autenticação)
- `GET /donations/:id` - Obter doação por ID
- `PUT /donations/:id` - Atualizar doação (apenas owner)
- `DELETE /donations/:id` - Deletar doação (apenas owner)
- `GET /donations/my-donations` - Listar suas doações

### Requisições de Doação

- `GET /requests` - Listar todas (com filtros)
- `POST /requests` - Criar requisição (requer autenticação)
- `GET /requests/:id` - Obter requisição por ID
- `PUT /requests/:id` - Atualizar requisição
- `DELETE /requests/:id` - Deletar requisição
- `GET /requests/my-requests` - Listar suas requisições
- `GET /requests/critical/:city` - Listar críticas por cidade

### Health

- `GET /health` - Status da API
- `GET /health/db` - Status da API + banco de dados

---

## 🛠️ TROUBLESHOOTING

### Erro 503 - Database unavailable

**Causa:** Banco de dados não está respondendo ou TABLE não existem

**Solução:**

1. Verifique se o banco está ativo em Render
2. Execute o schema SQL (`database/create_tables.sql`)
3. Confirme que `DATABASE_URL` está correto em Environment

### Erro 500 - Server error

**Verificar logs:**

```bash
# No dashboard Render → Logs
# Procure por "error" ou "Error"
```

### Aplicação não inicia

**Verificar:**

1. `npm start` está correto em Start Command?
2. Todas as variáveis de environment estão configuradas?
3. Não há erros de sintaxe? (`npm run dev` localmente primeiro)

---

## 📦 FAZER PUSH PARA GIT

Quando estiver tudo testado localmente:

```bash
# Adicionar todos os arquivos
git add .

# Commit com mensagem clara
git commit -m "feat: preparar API para Render production"

# Push para main
git push origin main
```

O Render irá fazer deploy automático! 🚀

---

## ✅ CHECKLIST FINAL

- [ ] Banco PostgreSQL criado no Render
- [ ] Web Service criado no Render
- [ ] Variáveis de ambiente configuradas (DATABASE_URL, JWT_SECRET, NODE_ENV, PORT)
- [ ] Script SQL executado (tabelas criadas)
- [ ] API respondendo em https://sos-enchente-api.onrender.com/health
- [ ] Testes de registro e login funcionando
- [ ] Auto-deploy configurado
- [ ] Código feito push para Git

Pronto para produção! 🎉
