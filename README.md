# Simula-o-SAEP
Sistema de Gerenciamento de Tarefas

# 📌 Sistema Kanban - Gerenciador de Tarefas

## 📖 Sobre o Projeto

Este projeto consiste em um sistema Kanban desenvolvido para gerenciar tarefas de forma organizada e visual.

O sistema permite o cadastro de usuários e tarefas, associando cada tarefa a um responsável, setor e nível de prioridade. As tarefas são organizadas em colunas de acordo com seu status, simulando um quadro Kanban.

---

## 🎯 Funcionalidades

* ✅ Cadastro de usuários
* ✅ Listagem de usuários
* ✅ Criação de tarefas
* ✅ Edição de tarefas
* ✅ Exclusão de tarefas com confirmação
* ✅ Alteração de status (A Fazer, Fazendo, Pronto)
* ✅ Visualização em formato Kanban
* ✅ Validação de email no cadastro

---

## 🛠️ Tecnologias Utilizadas

### Backend

* Node.js
* Express
* PostgreSQL

### Frontend

* HTML
* CSS
* JavaScript

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: usuario

* id (PK)
* nome
* email

### Tabela: tarefa

* id (PK)
* descricao
* setor
* prioridade
* status
* id_usuario (FK)

---

## 🔗 Relacionamento

Um usuário pode possuir várias tarefas, mas cada tarefa pertence a apenas um usuário.

---

## 🚀 Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/kanban.git
cd kanban
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar banco de dados

Crie um banco PostgreSQL e execute:

```sql
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL
);

CREATE TABLE tarefa (
    id SERIAL PRIMARY KEY,
    descricao TEXT NOT NULL,
    setor TEXT NOT NULL,
    prioridade TEXT NOT NULL,
    status TEXT DEFAULT 'A Fazer',
    id_usuario INTEGER REFERENCES usuario(id)
);
```

---

### 4. Rodar o servidor

```bash
node server.js
```

Se estiver correto, aparecerá:

```
Servidor rodando na porta 3000
```

---

## 🌐 Rotas da API

### Usuários

* POST /usuarios → Criar usuário
* GET /usuarios → Listar usuários

### Tarefas

* POST /tarefas → Criar tarefa
* GET /tarefas → Listar tarefas
* PUT /tarefas/:id → Editar tarefa
* PUT /tarefas/:id/status → Alterar status
* DELETE /tarefas/:id → Excluir tarefa

---

## 🎨 Interface

O sistema utiliza um quadro Kanban dividido em três colunas:

* A Fazer
* Fazendo
* Pronto

Cada tarefa pode ser movida entre os estados através de botões.

---

## ⚠️ Validações

* Campos obrigatórios no cadastro
* Validação de email
* Confirmação antes de excluir tarefa

---

## 📌 Melhorias Futuras

* Autenticação de usuários
* Drag and drop no Kanban
* Filtro por prioridade
* Responsividade para mobile

---

## 👩‍💻 Autoria

Projeto desenvolvido por Wildachca Jean

---

## 📄 Licença

Este projeto é apenas para fins educacionais.
