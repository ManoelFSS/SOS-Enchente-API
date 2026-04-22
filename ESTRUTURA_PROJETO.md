# Estrutura do Projeto API SOS

## 📁 Organização de Pastas

```
api-sos/
├── .github/
│   └── copilot-instructions.md     # Instruções customizadas para o Copilot
├── database/
│   └── init.sql                    # Script SQL para criar tabelas
├── src/
│   ├── config/
│   │   └── database.js             # Configuração da conexão PostgreSQL
│   │
│   ├── controllers/                # Lógica de negócio
│   │   ├── authController.js       # Controlador de autenticação
│   │   ├── donationController.js   # Controlador de doações
│   │   └── requestController.js    # Controlador de requisições
│   │
│   ├── middlewares/                # Interceptadores de requisição
│   │   ├── auth.js                 # Middleware de autenticação JWT
│   │   ├── validation.js           # Middleware de validação de auth
│   │   └── donationValidation.js   # Middleware de validação de doações/requisições
│   │
│   ├── models/                     # Modelos de dados (camada de dados)
│   │   ├── User.js                 # Operações CRUD de usuários
│   │   ├── Donation.js             # Operações CRUD de doações
│   │   └── DonationRequest.js      # Operações CRUD de requisições
│   │
│   ├── routes/                     # Definição de rotas HTTP
│   │   ├── auth.js                 # Rotas de autenticação
│   │   ├── donations.js            # Rotas de doações
│   │   └── requests.js             # Rotas de requisições
│   │
│   ├── utils/
│   │   └── auth.js                 # Funções auxiliares (hash, JWT)
│   │
│   └── server.js                   # Arquivo principal - inicia o servidor
│
├── .env                            # Variáveis de ambiente
├── package.json                    # Dependências do projeto
├── README.md                       # Documentação completa da API
└── TESTING_GUIDE.md               # Guia de testes com exemplos
```

## 🔄 Fluxo de uma Requisição

```
[Cliente]
    ↓ HTTP Request
[Express Middleware] (helmet, cors, morgan, rate limit, body parser)
    ↓
[Routes] (define qual controller chamar)
    ↓
[Validation Middleware] (valida dados com Joi)
    ↓
[Auth Middleware] (verifica JWT token se necessário)
    ↓
[Controller] (lógica de negócio)
    ↓
[Model] (acessa o banco de dados)
    ↓
[Database Response]
    ↓
[Controller] (processa resultado)
    ↓
[HTTP Response]
    ↓
[Cliente]
```

## 📊 Modelos de Dados

### Users (Usuários)

```sql
id          - Identificador único (PRIMARY KEY)
name        - Nome do usuário
email       - Email único do usuário
password    - Senha hasheada (bcrypt)
created_at  - Data de criação
```

### Donations (Doações)

```sql
id          - Identificador único (PRIMARY KEY)
user_id     - Referência ao usuário que está doando (FK)
category    - Categoria (medicine, clothes, food, water, supplies, other)
description - Descrição do item
quantity    - Quantidade
photo_url   - URL da foto
city        - Cidade
status      - Status (available, unavailable, completed)
created_at  - Data de criação
```

### Donation_Requests (Requisições)

```sql
id          - Identificador único (PRIMARY KEY)
user_id     - Referência ao usuário que está pedindo (FK)
category    - Categoria (medicine, clothes, food, water, supplies, other)
description - Descrição do que precisa
quantity    - Quantidade necessária
urgency     - Nível de urgência (low, medium, high, critical)
city        - Cidade
status      - Status (open, matched, completed, cancelled)
created_at  - Data de criação
```

## 🛡️ Camadas de Segurança

1. **Helmet** - Headers HTTP seguros
2. **CORS** - Controle de origem
3. **Rate Limiting** - 100 req/15 min por IP
4. **Joi Validation** - Validação de entrada
5. **bcrypt** - Hash de senhas (10 salt rounds)
6. **JWT** - Autenticação de tokens (1 hora expiration)
7. **Autorização** - Verificação de propriedade (user_id)

## 🚀 Endpoints por Categoria

### Autenticação (3 endpoints)

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

### Doações (6 endpoints)

- POST /api/donations
- GET /api/donations
- GET /api/donations/my-donations
- GET /api/donations/:id
- PUT /api/donations/:id
- DELETE /api/donations/:id

### Requisições (7 endpoints)

- POST /api/requests
- GET /api/requests
- GET /api/requests/my-requests
- GET /api/requests/critical/:city
- GET /api/requests/:id
- PUT /api/requests/:id
- DELETE /api/requests/:id

### Saúde (1 endpoint)

- GET /health

**Total: 17 endpoints**

## 📦 Dependências

### Produção

- **express** - Framework web
- **pg** - Cliente PostgreSQL
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Geração de tokens JWT
- **dotenv** - Variáveis de ambiente
- **cors** - Cross-Origin Resource Sharing
- **helmet** - Headers de segurança
- **express-rate-limit** - Rate limiting
- **joi** - Validação de dados
- **morgan** - Logging de requisições
- **winston** - Logging estruturado

### Desenvolvimento

- **nodemon** - Hot reload automático

## 🔐 Padrões de Autorização

1. **Rotas Públicas** - Sem autenticação
   - GET /api/donations
   - GET /api/donations/:id
   - GET /api/requests
   - GET /api/requests/:id
   - GET /api/requests/critical/:city
   - GET /health

2. **Rotas Protegidas** - Requerem token JWT
   - GET /api/auth/profile
   - GET /api/donations/my-donations
   - GET /api/requests/my-requests
   - POST /api/donations
   - POST /api/requests

3. **Rotas com Verificação de Propriedade**
   - PUT /api/donations/:id (apenas doador)
   - DELETE /api/donations/:id (apenas doador)
   - PUT /api/requests/:id (apenas solicitante)
   - DELETE /api/requests/:id (apenas solicitante)

## 📝 Convenções de Código

- **Controllers**: Funções export nomeadas (createDonation, updateDonation)
- **Models**: Classes estáticas com métodos (User.create, Donation.findAll)
- **Routes**: Router Express com middlewares em ordem
- **Middlewares**: Funções que recebem (req, res, next)
- **Utils**: Funções puras e auxiliares
- **Comments**: JSDoc para documentação completa

## ⚙️ Configuração de Ambiente

### .env obrigatório

```
DATABASE_URL=postgresql://user:pass@localhost:5432/db_name
JWT_SECRET=secret_key_very_long_and_secure
PORT=3000
NODE_ENV=development
```

## 🎯 Próximas Funcionalidades Sugeridas

1. **Integração de Doações e Requisições**
   - Endpoint para "combinar" doação com requisição
   - Histórico de transações

2. **Notificações**
   - Email quando nova doação corresponde a requisição
   - Push notifications

3. **Avaliações**
   - Classificação de doadores e solicitantes
   - Histórico de confiabilidade

4. **Localização Avançada**
   - Busca por coordenadas geográficas
   - Cálculo de distância

5. **Dashboard**
   - Estatísticas de doações por cidade
   - Gráficos de urgência

6. **Moderação**
   - Denúncia de usuários suspeitos
   - Sistema de flags

## 🔧 Scripts Úteis

```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Criar tabelas
psql -U user -d db -f database/init.sql

# Instalar dependências
npm install

# Auditoria de segurança
npm audit
```

## 📚 Recursos para Aprender

- [Express.js Documentation](https://expressjs.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT Introduction](https://jwt.io)
- [Joi Validation](https://joi.dev)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)

---

**Última atualização:** 22 de Abril de 2026
**Versão:** 1.0.0
