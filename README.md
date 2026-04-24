# 🚀 API SOS Enchente

API RESTful para conectar pessoas que desejam doar com pessoas que precisam de ajuda durante enchentes e desastres naturais.

**Produção:** https://sos-enchente-api.onrender.com/

---

## 📋 Índice

1. [Quick Start](#quick-start)
2. [Tabela de Rotas](#tabela-de-rotas)
3. [Exemplos](#exemplos)
4. [Deploy](#deploy)
5. [Estrutura](#estrutura)

---

## 1. Quick Start

### Instalar

```bash
npm install
```

### Executar

```bash
npm run dev
# API em: http://localhost:3000
```

### Variáveis de Ambiente (.env)

```
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=sua-chave-secreta
PORT=3000
NODE_ENV=development
```

---

## 2. Tabela de Rotas

### 🔐 Autenticação

| Método | Endpoint         | Descrição   | Auth |
| ------ | ---------------- | ----------- | ---- |
| POST   | `/auth/register` | Criar conta | ❌   |
| POST   | `/auth/login`    | Login       | ❌   |
| GET    | `/auth/profile`  | Perfil      | ✅   |

### 📦 Doações

| Método | Endpoint                  | Descrição    | Auth |
| ------ | ------------------------- | ------------ | ---- |
| GET    | `/donations`              | Listar todas | ❌   |
| POST   | `/donations`              | Criar        | ✅   |
| GET    | `/donations/my-donations` | Minhas       | ✅   |
| GET    | `/donations/:id`          | Detalhar     | ❌   |
| PUT    | `/donations/:id`          | Atualizar    | ✅   |
| DELETE | `/donations/:id`          | Deletar      | ✅   |

### 📋 Pedidos

| Método | Endpoint                  | Descrição    | Auth |
| ------ | ------------------------- | ------------ | ---- |
| GET    | `/pedidos`                | Listar todos | ❌   |
| POST   | `/pedidos`                | Criar        | ✅   |
| GET    | `/pedidos/my-pedidos`     | Meus         | ✅   |
| GET    | `/pedidos/critical/:city` | Críticos     | ❌   |
| GET    | `/pedidos/:id`            | Detalhar     | ❌   |
| PUT    | `/pedidos/:id`            | Atualizar    | ✅   |
| DELETE | `/pedidos/:id`            | Deletar      | ✅   |

### 🔧 Sistema

| Método | Endpoint  |
| ------ | --------- |
| GET    | `/`       |
| GET    | `/health` |

---

## 3. Exemplos

### Registrar

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@email.com","password":"senha123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"senha123"}'
```

### Criar Doação (com token)

```bash
curl -X POST http://localhost:3000/donations \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"category":"medicine","description":"Remédios","quantity":"50","city":"Porto Alegre"}'
```

### Listar Doações

```bash
curl http://localhost:3000/donations
```

### Criar Pedido

```bash
curl -X POST http://localhost:3000/pedidos \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"category":"food","description":"Alimentos","quantity":"50kg","urgency":"critical","city":"Porto Alegre"}'
```

---

## 4. Deploy

### No Render:

1. Criar PostgreSQL
2. Criar Web Service (Node)
3. Configurar Environment:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Executar `database/create_tables.sql`
5. Push para Git (auto-deploy)

---

## 5. Estrutura

```
src/
├── config/database.js     # PostgreSQL
├── controllers/          # Lógica
├── middlewares/          # Auth + Validação
├── models/               # Dados
├── routes/               # Endpoints
├── utils/                # Helpers
└── server.js             # Servidor
```

---

**Pronto para usar!** 🚀
├── middlewares/
│ ├── auth.js # Autenticação JWT
│ ├── validation.js # Validação de auth
│ └── donationValidation.js # Validação de doações/requisições
├── models/
│ ├── User.js # Modelo de usuário
│ ├── Donation.js # Modelo de doações
│ └── DonationRequest.js # Modelo de requisições
├── routes/
│ ├── auth.js # Rotas de autenticação
│ ├── donations.js # Rotas de doações
│ └── requests.js # Rotas de requisições
├── utils/
│ └── auth.js # Utilitários de segurança
└── server.js # Servidor principal

````

## Pré-requisitos

- Node.js (v14 ou superior)
- PostgreSQL

## Instalação

1. Instale as dependências:
   ```bash
   npm install
````

2. Configure as variáveis de ambiente no arquivo `.env`:

   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=3000
   NODE_ENV=development
   ```

3. Execute o script SQL para criar as tabelas:
   ```bash
   psql -U username -d database_name -f database/init.sql
   ```

## Executando

Para desenvolvimento (com hot-reload):

```bash
npm run dev
```

Para produção:

```bash
npm start
```

## Documentação de Endpoints

### 1. AUTENTICAÇÃO

#### POST /auth/register

Cadastra um novo usuário.

**Body:**

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (201):**

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

#### POST /auth/login

Faz login e retorna token JWT.

**Body:**

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET /auth/profile

Retorna o perfil do usuário autenticado.

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**

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

### 2. DOAÇÕES

#### POST /donations

Cria uma nova doação. **(Requer autenticação)**

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "category": "medicine",
  "description": "Remédios para febre e dor",
  "quantity": "50 caixas",
  "photo_url": "https://example.com/photo.jpg",
  "city": "Porto Alegre"
}
```

**Categories:** `medicine`, `clothes`, `food`, `water`, `supplies`, `other`

**Response (201):**

```json
{
  "message": "Donation created successfully",
  "donation": {
    "id": 1,
    "user_id": 1,
    "category": "medicine",
    "description": "Remédios para febre e dor",
    "quantity": "50 caixas",
    "photo_url": "https://example.com/photo.jpg",
    "city": "Porto Alegre",
    "status": "available",
    "created_at": "2026-04-22T10:00:00Z"
  }
}
```

#### GET /donations

Lista todas as doações com filtros opcionais.

**Query Parameters:**

- `category` (string): Filtrar por categoria
- `city` (string): Filtrar por cidade
- `status` (string): Filtrar por status (available, unavailable, completed)

**Example:**

```
GET /donations?category=medicine&city=Porto Alegre
```

**Response (200):**

```json
{
  "count": 5,
  "donations": [
    {
      "id": 1,
      "user_id": 1,
      "donor_name": "João Silva",
      "category": "medicine",
      "description": "Remédios para febre e dor",
      "quantity": "50 caixas",
      "photo_url": "https://example.com/photo.jpg",
      "city": "Porto Alegre",
      "status": "available",
      "created_at": "2026-04-22T10:00:00Z"
    }
  ]
}
```

#### GET /donations/:id

Obtém uma doação específica.

**Response (200):**

```json
{
  "donation": {
    "id": 1,
    "user_id": 1,
    "donor_name": "João Silva",
    "donor_email": "joao@example.com",
    "category": "medicine",
    "description": "Remédios para febre e dor",
    "quantity": "50 caixas",
    "photo_url": "https://example.com/photo.jpg",
    "city": "Porto Alegre",
    "status": "available",
    "created_at": "2026-04-22T10:00:00Z"
  }
}
```

#### GET /donations/my-donations

Lista doações do usuário autenticado. **(Requer autenticação)**

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "count": 2,
  "donations": [...]
}
```

#### PUT /donations/:id

Atualiza uma doação. **(Requer autenticação - apenas do doador)**

**Headers:**

```
Authorization: Bearer <token>
```

**Body:** (todos os campos opcionais)

```json
{
  "status": "unavailable",
  "quantity": "40 caixas"
}
```

**Response (200):**

```json
{
  "message": "Donation updated successfully",
  "donation": {...}
}
```

#### DELETE /donations/:id

Deleta uma doação. **(Requer autenticação - apenas do doador)**

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "message": "Donation deleted successfully"
}
```

---

### 3. REQUISIÇÕES DE DOAÇÃO

#### POST /requests

Cria uma nova requisição de doação. **(Requer autenticação)**

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "category": "food",
  "description": "Alimentos não perecíveis urgentes",
  "quantity": "100 kg",
  "urgency": "critical",
  "city": "Porto Alegre"
}
```

**Categories:** `medicine`, `clothes`, `food`, `water`, `supplies`, `other`
**Urgency:** `low`, `medium`, `high`, `critical`

**Response (201):**

```json
{
  "message": "Request created successfully",
  "request": {
    "id": 1,
    "user_id": 1,
    "category": "food",
    "description": "Alimentos não perecíveis urgentes",
    "quantity": "100 kg",
    "urgency": "critical",
    "city": "Porto Alegre",
    "status": "open",
    "created_at": "2026-04-22T10:00:00Z"
  }
}
```

#### GET /requests

Lista todas as requisições com filtros opcionais.

**Query Parameters:**

- `category` (string): Filtrar por categoria
- `city` (string): Filtrar por cidade
- `urgency` (string): Filtrar por urgência
- `status` (string): Filtrar por status (open, matched, completed, cancelled)

**Example:**

```
GET /requests?urgency=critical&city=Porto Alegre
```

**Response (200):**

```json
{
  "count": 3,
  "requests": [
    {
      "id": 1,
      "user_id": 1,
      "requester_name": "Maria Santos",
      "category": "food",
      "description": "Alimentos não perecíveis urgentes",
      "quantity": "100 kg",
      "urgency": "critical",
      "city": "Porto Alegre",
      "status": "open",
      "created_at": "2026-04-22T10:00:00Z"
    }
  ]
}
```

#### GET /requests/:id

Obtém uma requisição específica.

**Response (200):**

```json
{
  "request": {
    "id": 1,
    "user_id": 1,
    "requester_name": "Maria Santos",
    "requester_email": "maria@example.com",
    "category": "food",
    "description": "Alimentos não perecíveis urgentes",
    "quantity": "100 kg",
    "urgency": "critical",
    "city": "Porto Alegre",
    "status": "open",
    "created_at": "2026-04-22T10:00:00Z"
  }
}
```

#### GET /requests/critical/:city

Lista requisições críticas em uma cidade específica.

**Example:**

```
GET /requests/critical/Porto Alegre
```

**Response (200):**

```json
{
  "count": 2,
  "city": "Porto Alegre",
  "urgency": "critical",
  "requests": [...]
}
```

#### GET /requests/my-requests

Lista requisições do usuário autenticado. **(Requer autenticação)**

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "count": 1,
  "requests": [...]
}
```

#### PUT /requests/:id

Atualiza uma requisição. **(Requer autenticação - apenas do solicitante)**

**Headers:**

```
Authorization: Bearer <token>
```

**Body:** (todos os campos opcionais)

```json
{
  "status": "matched",
  "quantity": "50 kg"
}
```

**Response (200):**

```json
{
  "message": "Request updated successfully",
  "request": {...}
}
```

#### DELETE /requests/:id

Deleta uma requisição. **(Requer autenticação - apenas do solicitante)**

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "message": "Request deleted successfully"
}
```

---

### 4. SAÚDE DA API

#### GET /health

Verifica se a API está operacional.

**Response (200):**

```json
{
  "status": "OK",
  "message": "API is running"
}
```

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro na validação
- `401` - Não autenticado
- `403` - Não autorizado
- `404` - Não encontrado
- `500` - Erro do servidor

## Segurança

- ✅ Senhas hasheadas com bcrypt (10 salt rounds)
- ✅ Tokens JWT com expiração de 1 hora
- ✅ Rate limiting (100 requisições por 15 minutos)
- ✅ Headers de segurança com Helmet
- ✅ Validação robusta com Joi
- ✅ Proteção de rotas com middleware de autenticação
- ✅ Autorização por proprietário (apenas doadores/solicitantes podem modificar seus dados)

## Status das Doações

- `available` - Doação disponível
- `unavailable` - Doação não disponível temporariamente
- `completed` - Doação foi doada

## Status das Requisições

- `open` - Requisição aberta e aguardando doações
- `matched` - Requisição foi combinada com doação(ões)
- `completed` - Requisição foi atendida
- `cancelled` - Requisição foi cancelada

## Desenvolvimento

Este projeto segue as melhores práticas para APIs Node.js:

- Separação clara de responsabilidades
- Middlewares para autenticação e validação
- Tratamento robusto de erros
- Logging estruturado
- Estrutura modular e escalável
- Documentação completa de funções
