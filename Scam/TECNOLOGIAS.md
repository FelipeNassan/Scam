# Documentação de Tecnologias - Projeto Scam

Este documento apresenta uma visão geral das tecnologias utilizadas no projeto Scam, um simulador de quiz anti-golpes.

## 📋 Índice

- [Frontend](#frontend)
- [Backend](#backend)
- [Banco de Dados](#banco-de-dados)
- [Ferramentas de Desenvolvimento](#ferramentas-de-desenvolvimento)
- [Bibliotecas e Frameworks](#bibliotecas-e-frameworks)

---

## 🎨 Frontend

### Core Technologies

#### **React 18.3.1**
- Framework JavaScript para construção de interfaces de usuário
- Utilizado para criar componentes reutilizáveis e gerenciar o estado da aplicação
- Versão 18 com suporte a hooks modernos e concorrência

#### **TypeScript 5.5.3**
- Superset do JavaScript com tipagem estática
- Melhora a qualidade do código, detecta erros em tempo de desenvolvimento
- Configurado com suporte completo para React

#### **Vite 5.4.2**
- Build tool e dev server extremamente rápido
- Substitui o Create React App tradicional
- Hot Module Replacement (HMR) para desenvolvimento ágil
- Build otimizado para produção

### Estilização

#### **Tailwind CSS 3.4.1**
- Framework CSS utility-first
- Permite estilização rápida através de classes utilitárias
- Responsive design integrado
- Configurado com PostCSS e Autoprefixer

#### **PostCSS 8.4.35**
- Ferramenta para transformar CSS com plugins JavaScript
- Utilizado em conjunto com Tailwind CSS

#### **Autoprefixer 10.4.18**
- Plugin PostCSS que adiciona automaticamente prefixos de vendor ao CSS
- Garante compatibilidade com navegadores antigos

### Animações e UI

#### **Framer Motion 11.0.8**
- Biblioteca de animações para React
- Utilizada para transições suaves entre componentes
- Animações de entrada/saída e interações do usuário

#### **Lucide React 0.344.0**
- Biblioteca de ícones SVG para React
- Ícones modernos e leves
- Utilizado em botões, cards e elementos de interface

### Visualização de Dados

#### **Recharts 3.3.0**
- Biblioteca de gráficos para React
- Utilizada para exibir:
  - Gráficos de linha (evolução de pontuações)
  - Gráficos de barras (estatísticas)
  - Gráficos de pizza (distribuição de acertos)
- Totalmente responsiva e customizável

### Efeitos Visuais

#### **React Confetti 6.4.0**
- Biblioteca para criar efeitos de confete
- Utilizada em celebrações de conclusão de quiz

### Ferramentas de Qualidade de Código

#### **ESLint 9.9.1**
- Linter JavaScript/TypeScript
- Identifica e corrige problemas no código
- Configurado com plugins específicos para React

#### **TypeScript ESLint 8.3.0**
- Plugin ESLint para TypeScript
- Regras específicas para tipagem e boas práticas TypeScript

#### **ESLint Plugin React Hooks 5.1.0**
- Plugin para regras de hooks do React
- Garante uso correto de hooks (Rules of Hooks)

#### **ESLint Plugin React Refresh 0.4.11**
- Plugin para suporte ao Fast Refresh do React
- Melhora a experiência de desenvolvimento

---

## ⚙️ Backend

### Core Framework

#### **Spring Boot 3.5.6**
- Framework Java para desenvolvimento de aplicações enterprise
- Simplifica a configuração e desenvolvimento de aplicações Spring
- Inclui servidor embutido (Tomcat)
- Auto-configuração e convenção sobre configuração

#### **Java 17**
- Linguagem de programação orientada a objetos
- Versão LTS (Long Term Support)
- Recursos modernos como records, pattern matching, etc.

### Persistência de Dados

#### **Spring Data JPA**
- Abstração sobre JPA (Java Persistence API)
- Simplifica operações de banco de dados
- Repositories automáticos para operações CRUD
- Query methods automáticos

#### **Hibernate**
- Framework ORM (Object-Relational Mapping)
- Mapeamento objeto-relacional automático
- Gerenciamento de transações
- Configurado com `ddl-auto=update` para criação automática de tabelas

### API REST

#### **Spring Web**
- Módulo Spring para desenvolvimento de aplicações web
- Suporte a REST controllers
- Serialização JSON automática
- Tratamento de requisições HTTP

#### **Spring Boot Actuator**
- Ferramentas de monitoramento e gestão da aplicação
- Endpoints de health, info e metrics
- Útil para monitoramento em produção

### Build e Gerenciamento

#### **Maven**
- Ferramenta de build e gerenciamento de dependências
- Gerencia dependências do projeto
- Compilação e empacotamento da aplicação

---

## 🗄️ Banco de Dados

#### **PostgreSQL**
- Sistema de gerenciamento de banco de dados relacional (SGBDR)
- Open source e robusto
- Configurado na porta padrão 5432
- Banco de dados: `projeto3aapi`

### Configurações
- **URL**: `jdbc:postgresql://localhost:5432/projeto3aapi`
- **Dialeto**: `PostgreSQLDialect`
- **DDL Auto**: `update` (cria/atualiza tabelas automaticamente)

---

## 🛠️ Ferramentas de Desenvolvimento

### Build Tools

#### **Vite**
- Build tool para frontend
- Dev server com HMR
- Build otimizado para produção

#### **Maven**
- Build tool para backend Java
- Gerenciamento de dependências
- Compilação e empacotamento

### Linters e Formatters

#### **ESLint**
- Análise estática de código JavaScript/TypeScript
- Identifica problemas e sugere correções
- Configurado com regras específicas para React

### Type Checking

#### **TypeScript Compiler**
- Verificação de tipos em tempo de compilação
- Geração de JavaScript a partir de TypeScript
- Configurado com opções estritas

---

## 📦 Bibliotecas e Frameworks Adicionais

### Frontend

- **React DOM 18.3.1**: Renderização React no navegador
- **Globals 15.9.0**: Definições globais para ESLint
- **@vitejs/plugin-react 4.3.1**: Plugin Vite para React
- **@types/react 18.3.5**: Definições de tipos TypeScript para React
- **@types/react-dom 18.3.0**: Definições de tipos TypeScript para React DOM

### Backend

- **Spring Boot Starter Web**: Dependências para aplicações web
- **Spring Boot Starter Data JPA**: Dependências para JPA
- **PostgreSQL Driver**: Driver JDBC para PostgreSQL
- **Spring Boot Starter Test**: Ferramentas de teste

---

## 🌐 Arquitetura

### Frontend (React + TypeScript)
```
Scam/
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   ├── features/        # Features principais da aplicação
│   ├── hooks/          # Custom hooks (useSpeech, etc.)
│   ├── services/       # Serviços de API e lógica de negócio
│   ├── data/           # Dados estáticos (questões, interesses)
│   └── styles/         # Estilos globais
```

### Backend (Spring Boot)
```
api_backend/Projeto3aAPI/
├── src/main/java/
│   └── com/terceiraAPI/Projeto3aAPI/
│       ├── Controller/    # Controllers REST
│       ├── Model/         # Entidades JPA
│       ├── Repository/    # Repositories JPA
│       └── Service/       # Lógica de negócio
└── src/main/resources/
    └── application.properties  # Configurações
```

---

## 🔌 Comunicação Frontend-Backend

- **Protocolo**: HTTP/HTTPS
- **Formato**: JSON
- **CORS**: Configurado no backend para aceitar requisições do frontend
- **Porta Backend**: 8081
- **Porta Frontend**: 5173 (Vite dev server)

---

## 📝 Notas Importantes

1. **Desenvolvimento**: O projeto utiliza Vite para desenvolvimento rápido com HMR
2. **Produção**: Build otimizado com Vite para frontend, Maven para backend
3. **Banco de Dados**: PostgreSQL deve estar rodando antes de iniciar o backend
4. **TypeScript**: Tipagem estrita habilitada para melhor qualidade de código
5. **CORS**: Configurado para permitir comunicação entre frontend e backend

---

## 🚀 Comandos Principais

### Frontend
```bash
npm install          # Instalar dependências
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build para produção
npm run lint         # Executar linter
```

### Backend
```bash
./mvnw spring-boot:run    # Executar aplicação Spring Boot
mvn clean install         # Build do projeto
```

---

**Última atualização**: Dezembro 2024

