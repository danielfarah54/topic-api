# Este arquivo foi desenvolvido com base nas práticas sugeridas aqui: https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md

################ LOCAL ################

# Definindo a primeira etapa chamada 'local-development' usada para o desenvolvimento local
FROM node:18-alpine AS local-development

# Definindo uma variável de argumento para o ambiente (padrão: local)
ARG ENVIRONMENT=loc
ENV NODE_ENV=${ENVIRONMENT}

# Definindo o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Mudando o proprietário do diretório de trabalho para o usuário 'node'
RUN chown -R node:node /usr/src/app

# Copiando o arquivo package.json e package-lock.json e instalando as dependências
COPY --chown=node:node package*.json ./
RUN npm install

# Copiando o restante do projeto
COPY --chown=node:node . .

# Gerando os arquivos Prisma
RUN npx prisma generate

# Instalando o pacote Tini (para reforçar o gerenciamento de processos)
# Referência: https://github.com/krallin/tini
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

# Definindo o usuário para o usuário 'node'
USER node

################ BUILD ################

# Definindo a segunda etapa chamada 'build' usada para construir o projeto
FROM node:18-alpine AS build

# Definindo o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiando o arquivo package.json e package-lock.json e instalando as dependências
COPY --chown=node:node package*.json ./
RUN npm install && npm cache clean --force

# Copiando os diretórios e arquivos necessários para a construção do projeto
COPY --chown=node:node src ./src
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node env ./env
COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node nest-cli.json ./
COPY --chown=node:node .swcrc ./

# Gerando os arquivos Prisma
RUN npx prisma generate

# Executando a compilação do projeto usando o SWC
RUN npm run build

# Definindo o usuário para o usuário 'node'
USER node

################# DEV  ################

# Definindo a terceira etapa chamada 'distribution' usada para distribuir o projeto em diversos ambientes
FROM node:18-alpine AS distribution

# Definindo uma variável de argumento para o ambiente (padrão: dev)
ARG ENVIRONMENT=dev
ENV NODE_ENV=${ENVIRONMENT}

# Definindo o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiando os arquivos compilados e os recursos necessários
COPY --chown=node:node --from=build /usr/src/app/dist ./
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/package-lock.json ./
COPY --chown=node:node ./i18n ./i18n
COPY --chown=node:node ./env/.env.${NODE_ENV} ./.env

# Instalando apenas as dependências de produção (omitindo as de desenvolvimento)
RUN npm ci --omit=dev --ignore-scripts --no-audit && npm cache clean --force
RUN npm install pm2 -g

# Gerando os arquivos Prisma
RUN npx prisma generate

# Instalando o pacote Tini (para reforçar o gerenciamento de processos)
RUN apk add --no-cache tini

# Definindo o usuário para o usuário 'node'
USER node

# Definindo o ponto de entrada para o processo
# Referência: https://github.com/krallin/tini
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["pm2-runtime", "start", "main.js", "--name", "api"]
