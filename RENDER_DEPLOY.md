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

## 5. CRUD Completo de Doações

### Listar todas as doações

```bash
GET https://sos-enchente-api.onrender.com/donations
```

- Parâmetros opcionais: `?category=medicine&city=Porto Alegre&status=available`
- Público (sem autenticação)

### Criar doação

```bash
POST https://sos-enchente-api.onrender.com/donations
Headers: Authorization: Bearer <TOKEN>
Content-Type: application/json
Body: {
  "category": "medicine",
  "description": "Remédios para febre",
  "quantity": "50 caixas",
  "photo_url": "https://exemplo.com/foto.jpg",
  "city": "Porto Alegre"
}
```

- Requer autenticação

### Listar minhas doações

```bash
GET https://sos-enchente-api.onrender.com/donations/my-donations
Headers: Authorization: Bearer <TOKEN>
```

- Requer autenticação

### Obter doação específica

```bash
GET https://sos-enchente-api.onrender.com/donations/:id
```

- Público

### Atualizar doação

```bash
PUT https://sos-enchente-api.onrender.com/donations/:id
Headers: Authorization: Bearer <TOKEN>
Content-Type: application/json
Body: {
  "status": "unavailable",
  "quantity": "40 caixas"
}
```

- Requer autenticação (apenas dono)

### Deletar doação

```bash
DELETE https://sos-enchente-api.onrender.com/donations/:id
Headers: Authorization: Bearer <TOKEN>
```

- Requer autenticação (apenas dono)

---

## 6. CRUD Completo de Pedidos

### Listar todos os pedidos

```bash
GET https://sos-enchente-api.onrender.com/pedidos
```

- Parâmetros opcionais: `?category=food&city=Porto Alegre&urgency=critical&status=open`
- Público (sem autenticação)

### Criar pedido

```bash
POST https://sos-enchente-api.onrender.com/pedidos
Headers: Authorization: Bearer <TOKEN>
Content-Type: application/json
Body: {
  "category": "food",
  "description": "Alimentos não perecíveis urgentes",
  "quantity": "50 kg",
  "urgency": "critical",
  "city": "Porto Alegre"
}
```

- Requer autenticação

### Listar meus pedidos

```bash
GET https://sos-enchente-api.onrender.com/pedidos/my-pedidos
Headers: Authorization: Bearer <TOKEN>
```

- Requer autenticação

### Listar pedidos críticos por cidade

```bash
GET https://sos-enchente-api.onrender.com/pedidos/critical/:city
Exemplo: GET https://sos-enchente-api.onrender.com/pedidos/critical/Porto Alegre
```

- Público

### Obter pedido específico

```bash
GET https://sos-enchente-api.onrender.com/pedidos/:id
```

- Público

### Atualizar pedido

```bash
PUT https://sos-enchente-api.onrender.com/pedidos/:id
Headers: Authorization: Bearer <TOKEN>
Content-Type: application/json
Body: {
  "status": "matched",
  "quantity": "30 kg"
}
```

- Requer autenticação (apenas dono)

### Deletar pedido

```bash
DELETE https://sos-enchente-api.onrender.com/pedidos/:id
Headers: Authorization: Bearer <TOKEN>
```

- Requer autenticação (apenas dono)

---

## 7. Autenticação (Auth)

### Registrar usuário

```bash
POST https://sos-enchente-api.onrender.com/auth/register
Content-Type: application/json
Body: {
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

- Público

### Login

```bash
POST https://sos-enchente-api.onrender.com/auth/login
Content-Type: application/json
Body: {
  "email": "joao@example.com",
  "password": "senha123"
}
```

- Retorna token JWT
- Público

### Obter perfil

```bash
GET https://sos-enchente-api.onrender.com/auth/profile
Headers: Authorization: Bearer <TOKEN>
```

- Requer autenticação

---

## 8. URLs de Produção

Substitua `https://sos-enchente-api.onrender.com` nos seus testes:

- **Cadastro**: `POST https://sos-enchente-api.onrender.com/auth/register`
- **Login**: `POST https://sos-enchente-api.onrender.com/auth/login`
- **Perfil**: `GET https://sos-enchente-api.onrender.com/auth/profile`
- **Doações CRUD**: `GET/POST/PUT/DELETE https://sos-enchente-api.onrender.com/donations`
- **Pedidos**: `POST https://sos-enchente-api.onrender.com/pedidos`, `GET https://sos-enchente-api.onrender.com/pedidos`
- **Health**: `GET https://sos-enchente-api.onrender.com/health`
- **Root**: `GET https://sos-enchente-api.onrender.com/`

> Se você receber `Route not found` em `/auth/register`, pode ser porque o Render ainda está usando uma versão antiga do código. Faça push para a branch configurada no Render e execute um novo deploy.

---

## 9. Troubleshooting

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

## 10. Atualizações Futuras

Para atualizar o código:

1. Faça push para a branch `main`
2. O Render redeploy automaticamente
3. Monitore os logs em **Render Dashboard**
