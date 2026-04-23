# 🚀 Guia de Deploy no Render

## 1. Preparar o Banco de Dados no Render

### Opção A: Usar PostgreSQL do Render (Recomendado)

1. Acesse [render.com](https://render.com)
2. Clique em **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `sos-db`
   - **Database**: `sos_enchente`
   - **User**: Será gerado automaticamente
   - **Region**: Escolha a mais próxima (ex: São Paulo)
4. Copie a **Internal Database URL** (será usada para a API)

### Opção B: Usar PostgreSQL Externo (Supabase, neon.tech, etc)

1. Crie um banco PostgreSQL
2. Execute o script `database/create_tables.sql` para criar as tabelas
3. Copie a **DATABASE_URL** gerada

---

## 2. Deploy da API no Render

1. **Conecte seu repositório GitHub** ao Render
2. Clique em **New +** → **Web Service**
3. Configure:
   - **Name**: `sos-enchente-api`
   - **Region**: São Paulo (ou mesma região do banco)
   - **Branch**: main
   - **Build Command**: (deixe vazio)
   - **Start Command**: `npm start`

4. **Adicione variáveis de ambiente**:
   - `DATABASE_URL`: Cole a URL do banco PostgreSQL
   - `JWT_SECRET`: Cole um secret seguro (ex: gere com `openssl rand -hex 32`)
   - `NODE_ENV`: `production`
   - `PORT`: `3000`

5. Clique em **Create Web Service**

---

## 3. Verificar o Deploy

Após alguns minutos, acesse sua API em:

```
https://sos-enchente-api.onrender.com/health
```

Se vir:

```json
{
  "status": "OK",
  "message": "API is running"
}
```

✅ **Deploy bem-sucedido!**

---

## 4. Testar os Endpoints

### Cadastrar Usuário

```bash
curl -X POST https://sos-enchente-api.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Fazer Login

```bash
curl -X POST https://sos-enchente-api.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Criar Doação (com token JWT)

```bash
curl -X POST https://sos-enchente-api.onrender.com/donations \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "medicine",
    "description": "Remédios para febre",
    "quantity": "50 caixas",
    "photo_url": "https://via.placeholder.com/300?text=Medicine",
    "city": "Porto Alegre"
  }'
```

---

## 5. URLs de Produção

Substitua `https://sos-enchente-api.onrender.com` nos seus testes:

- **Cadastro**: `POST /auth/register`
- **Login**: `POST /auth/login`
- **Perfil**: `GET /auth/profile`
- **Doações**: `POST /donations`, `GET /donations`
- **Requisições**: `POST /requests`, `GET /requests`
- **Health**: `GET /health`

---

## 6. Troubleshooting

### Erro: "Database connection failed"

- Verifique se a `DATABASE_URL` está correta
- Confirme que o banco PostgreSQL está ativo
- Verifique se as tabelas foram criadas (execute `create_tables.sql`)

### Erro: "Invalid or expired token"

- O token JWT expira em 1 hora
- Faça login novamente para obter um novo token

### Erro: "422 Unprocessable Entity"

- Verifique se está usando `https://` (não `http://`)
- Confirme se a API está respondendo em `/health`

---

## 7. Atualizações Futuras

Para atualizar o código:

1. Faça push para a branch `main`
2. O Render redeploy automaticamente
3. Monitore os logs em **Render Dashboard**
