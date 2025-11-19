# Projeto Scam - Sistema Completo

Este projeto foi consolidado e agora possui apenas o front-end moderno (React/TypeScript) conectado à API Spring Boot.

## 📁 Estrutura do Projeto

```
OneDrive_1_06-11-2025/
├── Scam/                    # Front-end React/TypeScript (NOVO)
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── features/          # Features principais
│   │   ├── services/
│   │   │   ├── api.ts         # Serviço de API (conecta com backend)
│   │   │   └── database.ts    # (Legado - não usado mais)
│   │   └── ...
│   └── package.json
│
└── api_backend/           # Backend Spring Boot (API REST)
    └── Projeto3aAPI/
        ├── src/main/java/
        │   └── com/terceiraAPI/Projeto3aAPI/
        │       ├── Controller/     # Controllers REST
        │       │   ├── UserController.java
        │       │   ├── QuizAttemptController.java
        │       │   └── ProdutoController.java (legado)
        │       ├── Model/          # Entidades JPA
        │       │   ├── User.java
        │       │   ├── QuizAttempt.java
        │       │   └── Produto.java (legado)
        │       ├── Repository/     # Repositories JPA
        │       ├── Service/         # Services de negócio
        │       └── ...
        └── src/main/resources/
            └── application.properties
```

## 🚀 Como Executar

### 1. Backend (API Spring Boot)
```bash
cd api_backend/Projeto3aAPI
./mvnw spring-boot:run
# ou
mvn spring-boot:run
```
A API estará rodando em: **http://localhost:8081**

### 2. Frontend (React/TypeScript)
```bash
cd Scam
npm install
npm run dev
```
O front-end estará rodando em: **http://localhost:5173** (ou porta do Vite)

## 🔌 Endpoints da API

### Usuários (`/users`)
- `GET /users` - Listar todos os usuários
- `GET /users/{id}` - Buscar usuário por ID
- `GET /users/email/{email}` - Buscar usuário por email
- `POST /users` - Criar novo usuário
- `PUT /users/{id}` - Atualizar usuário
- `DELETE /users/{id}` - Deletar usuário
- `POST /users/login` - Validar credenciais

### Tentativas de Quiz (`/quiz-attempts`)
- `GET /quiz-attempts` - Listar todas as tentativas
- `GET /quiz-attempts/{id}` - Buscar tentativa por ID
- `GET /quiz-attempts/user/{userId}` - Buscar tentativas de um usuário
- `POST /quiz-attempts` - Criar nova tentativa
- `PUT /quiz-attempts/{id}` - Atualizar tentativa
- `DELETE /quiz-attempts/{id}` - Deletar tentativa

## 📊 Banco de Dados

A API usa **PostgreSQL** configurado em `application.properties`:
- URL: `jdbc:postgresql://localhost:5432/projeto3aapi`
- Username: `postgres`
- Password: `202004`

As tabelas são criadas automaticamente pelo Hibernate (`spring.jpa.hibernate.ddl-auto=update`).

## 🔄 Migração Completa

✅ **Front-end antigo removido** - O projeto `meuFrontend` foi removido para evitar confusão.

✅ **Tudo consolidado no Scam** - O novo front-end React/TypeScript está totalmente integrado com a API.

✅ **CRUD completo** - Todas as operações (Create, Read, Update, Delete) estão funcionando via API.

## 📝 Notas Importantes

1. **Porta da API**: 8081 (configurada em `application.properties`)
2. **CORS**: Configurado para aceitar requisições do front-end
3. **Autenticação**: Atualmente sem token (pode ser adicionado depois)
4. **Banco de Dados**: Certifique-se de que o PostgreSQL está rodando antes de iniciar a API

## 🛠️ Tecnologias

### Backend
- Spring Boot 3.5.6
- Spring Data JPA
- PostgreSQL
- Java 17

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Recharts

## 📦 Próximos Passos (Opcional)

- [ ] Adicionar autenticação JWT
- [ ] Implementar refresh token
- [ ] Adicionar validações mais robustas
- [ ] Implementar testes automatizados
- [ ] Adicionar documentação Swagger/OpenAPI

