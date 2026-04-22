# API SOS - Sistema de Doações em Enchentes

Uma API RESTful moderna construída com Node.js, Express e PostgreSQL para conectar pessoas que desejam doar com pessoas que precisam de ajuda durante enchentes e desastres climáticos.

## Objetivo

Organizar e conectar informações relevantes em cenários de enchentes, facilitando a comunicação entre pessoas que precisam de ajuda e aquelas que podem ajudar, priorizando organização, clareza e utilidade das informações.

## Funcionalidades

- ✅ Autenticação com JWT e proteção de rotas
- ✅ Cadastro e login de usuários
- ✅ Sistema completo de doações (criar, listar, atualizar, deletar)
- ✅ Sistema de requisições de ajuda (criar, listar, atualizar, deletar)
- ✅ Filtros por categoria, cidade, urgência e status
- ✅ Identificação de requisições críticas
- ✅ Validação robusta de entrada
- ✅ Rate limiting para segurança
- ✅ Logging de requisições

## Arquitetura

```
src/
├── config/
│   └── database.js              # Conexão PostgreSQL
├── controllers/
│   ├── authController.js        # Lógica de autenticação
│   ├── donationController.js    # Lógica de doações
│   └── requestController.js     # Lógica de requisições
├── middlewares/
│   ├── auth.js                  # Autenticação JWT
│   ├── validation.js            # Validação de auth
│   └── donationValidation.js    # Validação de doações/requisições
├── models/
│   ├── User.js                  # Modelo de usuário
│   ├── Donation.js              # Modelo de doações
│   └── DonationRequest.js       # Modelo de requisições
├── routes/
│   ├── auth.js                  # Rotas de autenticação
│   ├── donations.js             # Rotas de doações
│   └── requests.js              # Rotas de requisições
├── utils/
│   └── auth.js                  # Utilitários de segurança
└── server.js                    # Servidor principal
```

## Pré-requisitos

- Node.js (v14 ou superior)
- PostgreSQL

## Instalação

1. Instale as dependências:
   ```bash
   npm install
   ```

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

#### POST /api/auth/register
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

#### POST /api/auth/login
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

#### GET /api/auth/profile
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

#### POST /api/donations
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

#### GET /api/donations
Lista todas as doações com filtros opcionais.

**Query Parameters:**
- `category` (string): Filtrar por categoria
- `city` (string): Filtrar por cidade
- `status` (string): Filtrar por status (available, unavailable, completed)

**Example:**
```
GET /api/donations?category=medicine&city=Porto Alegre
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

#### GET /api/donations/:id
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

#### GET /api/donations/my-donations
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

#### PUT /api/donations/:id
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

#### DELETE /api/donations/:id
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

#### POST /api/requests
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

#### GET /api/requests
Lista todas as requisições com filtros opcionais.

**Query Parameters:**
- `category` (string): Filtrar por categoria
- `city` (string): Filtrar por cidade
- `urgency` (string): Filtrar por urgência
- `status` (string): Filtrar por status (open, matched, completed, cancelled)

**Example:**
```
GET /api/requests?urgency=critical&city=Porto Alegre
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

#### GET /api/requests/:id
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

#### GET /api/requests/critical/:city
Lista requisições críticas em uma cidade específica.

**Example:**
```
GET /api/requests/critical/Porto Alegre
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

#### GET /api/requests/my-requests
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

#### PUT /api/requests/:id
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

#### DELETE /api/requests/:id
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
# SOS-Enchente-API
