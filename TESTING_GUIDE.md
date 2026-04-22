## Guia de Testes da API SOS

Este guia ajuda você a testar todos os endpoints da API usando ferramentas como Postman ou cURL.

### Configuração Inicial

1. Certifique-se de que a API está rodando:

   ```bash
   npm run dev
   ```

2. A API estará disponível em: `http://localhost:3000`

3. Para testar os endpoints, você precisa ter criado as tabelas no banco:
   ```bash
   psql -U seu_usuario -d seu_banco -f database/init.sql
   ```

---

## 1. TESTES DE AUTENTICAÇÃO

### 1.1 Registrar um novo usuário

**Método:** POST
**URL:** `http://localhost:3000/api/auth/register`
**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta Esperada (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "created_at": "2026-04-22T10:00:00Z"
  }
}
```

### 1.2 Fazer login

**Método:** POST
**URL:** `http://localhost:3000/api/auth/login`
**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta Esperada (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

⚠️ **Importante:** Copie o token retornado para usar nos próximos testes. Ele expira em 1 hora.

### 1.3 Obter Perfil

**Método:** GET
**URL:** `http://localhost:3000/api/auth/profile`
**Headers:**

```
Authorization: Bearer <seu_token_aqui>
```

**Resposta Esperada (200):**

```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "created_at": "2026-04-22T10:00:00Z"
  }
}
```

---

## 2. TESTES DE DOAÇÕES

### 2.1 Criar uma Doação

**Método:** POST
**URL:** `http://localhost:3000/api/donations`
**Headers:**

```
Authorization: Bearer <seu_token_aqui>
Content-Type: application/json
```

**Body:**

```json
{
  "category": "medicine",
  "description": "Remédios para febre e analgésicos",
  "quantity": "50 caixas",
  "photo_url": "https://via.placeholder.com/300?text=Medicine",
  "city": "Porto Alegre"
}
```

**Resposta Esperada (201):**

```json
{
  "message": "Donation created successfully",
  "donation": {
    "id": 1,
    "user_id": 1,
    "category": "medicine",
    "description": "Remédios para febre e analgésicos",
    "quantity": "50 caixas",
    "photo_url": "https://via.placeholder.com/300?text=Medicine",
    "city": "Porto Alegre",
    "status": "available",
    "created_at": "2026-04-22T10:00:00Z"
  }
}
```

**Categorias válidas:**

- `medicine` - Medicamentos
- `clothes` - Roupas
- `food` - Alimentos
- `water` - Água
- `supplies` - Suprimentos gerais
- `other` - Outros

### 2.2 Listar todas as Doações

**Método:** GET
**URL:** `http://localhost:3000/api/donations`

**Query Parameters opcionais:**

- `category=medicine`
- `city=Porto Alegre`
- `status=available`

**Exemplo completo:**

```
http://localhost:3000/api/donations?category=medicine&city=Porto Alegre
```

**Resposta Esperada (200):**

```json
{
  "count": 5,
  "donations": [
    {
      "id": 1,
      "user_id": 1,
      "donor_name": "João Silva",
      "category": "medicine",
      "description": "Remédios para febre e analgésicos",
      "quantity": "50 caixas",
      "photo_url": "https://via.placeholder.com/300?text=Medicine",
      "city": "Porto Alegre",
      "status": "available",
      "created_at": "2026-04-22T10:00:00Z"
    }
  ]
}
```

### 2.3 Listar minhas Doações

**Método:** GET
**URL:** `http://localhost:3000/api/donations/my-donations`
**Headers:**

```
Authorization: Bearer <seu_token_aqui>
```

**Resposta Esperada (200):**

```json
{
  "count": 2,
  "donations": [...]
}
```

### 2.4 Obter uma Doação Específica

**Método:** GET
**URL:** `http://localhost:3000/api/donations/1`

**Resposta Esperada (200):**

```json
{
  "donation": {
    "id": 1,
    "user_id": 1,
    "donor_name": "João Silva",
    "donor_email": "joao@example.com",
    "category": "medicine",
    "description": "Remédios para febre e analgésicos",
    "quantity": "50 caixas",
    "photo_url": "https://via.placeholder.com/300?text=Medicine",
    "city": "Porto Alegre",
    "status": "available",
    "created_at": "2026-04-22T10:00:00Z"
  }
}
```

### 2.5 Atualizar uma Doação

**Método:** PUT
**URL:** `http://localhost:3000/api/donations/1`
**Headers:**

```
Authorization: Bearer <seu_token_aqui>
Content-Type: application/json
```

**Body:** (todos os campos são opcionais)

```json
{
  "status": "unavailable",
  "quantity": "40 caixas"
}
```

**Resposta Esperada (200):**

```json
{
  "message": "Donation updated successfully",
  "donation": {...}
}
```

### 2.6 Deletar uma Doação

**Método:** DELETE
**URL:** `http://localhost:3000/api/donations/1`
**Headers:**

```
Authorization: Bearer <seu_token_aqui>
```

**Resposta Esperada (200):**

```json
{
  "message": "Donation deleted successfully"
}
```

---

## 3. TESTES DE REQUISIÇÕES DE DOAÇÃO

### 3.1 Criar uma Requisição

**Método:** POST
**URL:** `http://localhost:3000/api/requests`
**Headers:**

```
Authorization: Bearer <seu_token_aqui>
Content-Type: application/json
```

**Body:**

```json
{
  "category": "food",
  "description": "Alimentos não perecíveis urgentes para família",
  "quantity": "50 kg",
  "urgency": "critical",
  "city": "Porto Alegre"
}
```

**Urgências válidas:**

- `low` - Baixa urgência
- `medium` - Média urgência
- `high` - Alta urgência
- `critical` - Urgência crítica

**Resposta Esperada (201):**

```json
{
  "message": "Request created successfully",
  "request": {
    "id": 1,
    "user_id": 1,
    "category": "food",
    "description": "Alimentos não perecíveis urgentes para família",
    "quantity": "50 kg",
    "urgency": "critical",
    "city": "Porto Alegre",
    "status": "open",
    "created_at": "2026-04-22T10:00:00Z"
  }
}
```

### 3.2 Listar todas as Requisições

**Método:** GET
**URL:** `http://localhost:3000/api/requests`

**Query Parameters opcionais:**

- `category=food`
- `city=Porto Alegre`
- `urgency=critical`
- `status=open`

**Exemplo completo:**

```
http://localhost:3000/api/requests?urgency=critical&city=Porto Alegre
```

**Resposta Esperada (200):**

```json
{
  "count": 3,
  "requests": [...]
}
```

### 3.3 Listar Requisições Críticas de uma Cidade

**Método:** GET
**URL:** `http://localhost:3000/api/requests/critical/Porto Alegre`

**Resposta Esperada (200):**

```json
{
  "count": 2,
  "city": "Porto Alegre",
  "urgency": "critical",
  "requests": [...]
}
```

### 3.4 Obter uma Requisição Específica

**Método:** GET
**URL:** `http://localhost:3000/api/requests/1`

**Resposta Esperada (200):**

```json
{
  "request": {
    "id": 1,
    "user_id": 1,
    "requester_name": "Maria Santos",
    "requester_email": "maria@example.com",
    "category": "food",
    "description": "Alimentos não perecíveis urgentes para família",
    "quantity": "50 kg",
    "urgency": "critical",
    "city": "Porto Alegre",
    "status": "open",
    "created_at": "2026-04-22T10:00:00Z"
  }
}
```

### 3.5 Listar minhas Requisições

**Método:** GET
**URL:** `http://localhost:3000/api/requests/my-requests`
**Headers:**

```
Authorization: Bearer <seu_token_aqui>
```

**Resposta Esperada (200):**

```json
{
  "count": 1,
  "requests": [...]
}
```

### 3.6 Atualizar uma Requisição

**Método:** PUT
**URL:** `http://localhost:3000/api/requests/1`
**Headers:**

```
Authorization: Bearer <seu_token_aqui>
Content-Type: application/json
```

**Body:** (todos os campos são opcionais)

```json
{
  "status": "matched",
  "quantity": "30 kg"
}
```

**Status válidos para requisições:**

- `open` - Aberta
- `matched` - Combinada com doação
- `completed` - Concluída
- `cancelled` - Cancelada

**Resposta Esperada (200):**

```json
{
  "message": "Request updated successfully",
  "request": {...}
}
```

### 3.7 Deletar uma Requisição

**Método:** DELETE
**URL:** `http://localhost:3000/api/requests/1`
**Headers:**

```
Authorization: Bearer <seu_token_aqui>
```

**Resposta Esperada (200):**

```json
{
  "message": "Request deleted successfully"
}
```

---

## 4. TESTE DE SAÚDE

### 4.1 Verificar se a API está rodando

**Método:** GET
**URL:** `http://localhost:3000/health`

**Resposta Esperada (200):**

```json
{
  "status": "OK",
  "message": "API is running"
}
```

---

## Usando cURL

Se preferir testar via cURL, aqui estão alguns exemplos:

### Registrar

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Criar Doação

```bash
curl -X POST http://localhost:3000/api/donations \
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

### Listar Doações

```bash
curl http://localhost:3000/api/donations
```

---

## Tratamento de Erros

A API retorna erros padronizados:

### 400 - Validação Inválida

```json
{
  "message": "\"email\" must be a valid email"
}
```

### 401 - Não Autenticado

```json
{
  "message": "Access token required"
}
```

### 403 - Não Autorizado

```json
{
  "message": "Unauthorized: You can only update your own donations"
}
```

### 404 - Não Encontrado

```json
{
  "message": "Donation not found"
}
```

### 500 - Erro do Servidor

```json
{
  "message": "Server error",
  "error": "Erro detalhado aqui"
}
```

---

## Próximos Passos

1. Teste todos os endpoints em ordem
2. Verifique as respostas esperadas
3. Teste o filtro de requisições críticas
4. Tente operações não autorizadas para verificar a segurança
5. Teste com dados inválidos para verificar validação

Bom teste! 🚀
