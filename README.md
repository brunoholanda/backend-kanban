# Kanban GMUD Backend

Backend NestJS para o sistema de gerenciamento de GMUDs (Gestão de Mudanças).

## 🚀 Tecnologias Utilizadas

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para TypeScript
- **PostgreSQL** - Banco de dados
- **Class Validator** - Validação de dados
- **Class Transformer** - Transformação de dados

## 📋 Funcionalidades

### Entidades
- **Approvers** - Gerenciamento de aprovadores
- **Cards** - Gerenciamento de GMUDs/Cards

### Endpoints

#### Aprovadores (`/approvers`)
- `GET /approvers` - Listar todos os aprovadores
- `POST /approvers` - Criar novo aprovador
- `GET /approvers/:id` - Buscar aprovador por ID
- `PATCH /approvers/:id` - Atualizar aprovador
- `DELETE /approvers/:id` - Remover aprovador

#### Cards (`/cards`)
- `GET /cards` - Listar todos os cards
- `GET /cards?status=aberta` - Filtrar por status
- `POST /cards` - Criar novo card
- `GET /cards/:id` - Buscar card por ID
- `PATCH /cards/:id` - Atualizar card
- `PATCH /cards/:id/status` - Atualizar status do card
- `DELETE /cards/:id` - Remover card

## 🛠️ Como Executar

### Pré-requisitos
- Node.js 20+
- PostgreSQL
- npm ou yarn

### Instalação

1. **Configure o Node.js:**
   ```bash
   nvm use 20
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o banco de dados:**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações do PostgreSQL
   ```

4. **Execute o servidor:**
   ```bash
   npm run start:dev
   ```

5. **Acesse a aplicação:**
   Backend rodando em [http://localhost:3001](http://localhost:3001)

## 📁 Estrutura do Projeto

```
src/
├── entities/
│   ├── approver.entity.ts
│   └── card.entity.ts
├── modules/
│   ├── approvers/
│   │   ├── dto/
│   │   ├── approvers.controller.ts
│   │   ├── approvers.service.ts
│   │   └── approvers.module.ts
│   ├── cards/
│   │   ├── dto/
│   │   ├── cards.controller.ts
│   │   ├── cards.service.ts
│   │   └── cards.module.ts
│   └── database/
│       └── database.config.ts
├── app.module.ts
└── main.ts
```

## 🔧 Comandos Disponíveis

- `npm run start` - Servidor de produção
- `npm run start:dev` - Servidor de desenvolvimento
- `npm run start:debug` - Servidor com debug
- `npm run build` - Build para produção
- `npm run test` - Executar testes
- `npm run test:e2e` - Executar testes e2e

## 📊 Banco de Dados

### Tabelas
- `approvers` - Aprovadores
- `cards` - Cards/GMUDs
- `card_approvers` - Relacionamento muitos-para-muitos

### Status dos Cards
- `aberta` - GMUD aberta
- `pendente-aprovacao-1` - Pendente primeira aprovação
- `pendente-aprovacao-2` - Pendente segunda aprovação
- `pendente-execucao` - Pendente execução
- `concluido` - Concluído

## 🔒 Variáveis de Ambiente

Consulte o arquivo `.env.example` para todas as variáveis necessárias.