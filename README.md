# Topic Api

Projeto NestJS que utiliza GraphQL API.
O sistema tem o propósito de ser uma plataforma para salvar anotações de diferentes tópicos.

## Requisitos Funcionais:

- CRUD DE USUÁRIOS:
  - CREATE:
    - permissão:
      - qualquer usuário
    - dados:
      - id
      - nome
      - email
      - senha
  - READ:
    - permissão:
      - admin
      - usuário pode ver apenas seus dados
  - UDPATE:
    - permissão:
      - usuário pode atualizar seus dados
    - dados:
      - nome
      - senha
  - DELETE:
    - permissão:
      - usuário pode excluir sua conta

- LOGIN:
  - permissão:
    - qualquer usuário
  
- LOGOUT:
  - permissão:
    - qualquer usuário

- CRUD DE TÓPICOS:
  - CREATE:
    - permissão:
      - qualquer usuário
    - dados:
      - id
      - nome
      - data de criação
      - data de atualização
      - id do usuário que criou
  - READ:
    - permissão:
      - qualquer usuário
    - regras:
      - listar apenas a anotação mais recente do usuário na listagem do tópico
  - UDPATE:
    - permissão:
      - admin
      - usuário que criou, somente se o tópico não tiver anotações
  - DELETE:
    - permissão:
      - admin
      - usuário que criou, somente se o tópico não tiver anotações

- CRUD DE ANOTAÇÕES DENTRO DO TÓPICO:
  - CREATE:
    - permissão:
      - qualquer usuário
    - dados:
      - id
      - título
      - conteúdo
      - data de criação
      - data de atualização
      - id do usuário que criou
      - id do tópico
  - READ:
    - permissão:
      - usuário pode ver somente suas anotações
    - regras:
      - poder listar a anotação mais recente de cada tópico
      - poder listar o histórico de anotações de um tópico, com ordenação decrescente por data de criação
  - UDPATE:
    - permissão:
      - usuário que criou
  - DELETE:
    - permissão:
      - usuário que criou

## Funcionalidades:

- Criação de API Graphql com o NestJS
- Autenticação via JWT
- Integração com o Prisma ORM para gerenciamento de banco de dados
- Documentação da API gerada automaticamente com Swagger
- Suporte para internacionalização (i18n) com serviço CLS
- Configuração de variáveis de ambiente via `@nestjs/config`

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

## Scripts

- `npm run build:swc`: Compila a aplicação usando o SWC
- `npm start`: Inicia a aplicação em produção
- `npm run start:local`: Inicia a aplicação em modo de desenvolvimento com hot-reload
- `npm run start:local-docker`: Inicia a aplicação em um ambiente Docker em modo de desenvolvimento
- `npm run test`: Executa testes
- `npm run test:watch`: Executa testes em modo de observação
- `npm run test:cov`: Executa testes e gera relatório de cobertura
- `npm run generate-metadata`: Gera metadados do Swagger
- `npm run swc-hot-reload`: Inicia o script para gerenciar hot-reload usando o SWC

## Estrutura do Projeto

- `src`: Contém o código-fonte da aplicação.
- `test`: Contém testes da aplicação.
- `i18n`: Contém arquivos de tradução para internacionalização.
