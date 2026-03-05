# ---- Estágio Base ----
# Usa Node.js 20 com Alpine Linux (imagem leve) e dá o nome "base"
FROM node:20-alpine AS base
# Define /app como diretório de trabalho dentro do container
WORKDIR /app
# Copia os arquivos de dependências para o container
COPY package.json package-lock.json ./

# ---- Estágio de Desenvolvimento ----
# Parte do estágio "base" e cria o estágio "dev"
FROM base AS dev
# Instala TODAS as dependências (incluindo devDependencies)
RUN npm ci
# Copia todo o código fonte para dentro do container
COPY . .
# Comando padrão: roda o servidor com hot-reload (node --watch)
CMD ["npm", "run", "dev"]

# ---- Estágio de Dependências de Produção ----
# Parte do estágio "base" e cria o estágio "prod-deps"
FROM base AS prod-deps
# Instala SOMENTE as dependências de produção (sem devDependencies)
RUN npm ci --omit=dev

# ---- Estágio de Produção ----
# Começa do zero com uma imagem limpa do Node.js 20 Alpine
FROM node:20-alpine AS production
# Define /app como diretório de trabalho
WORKDIR /app
# Define a variável de ambiente NODE_ENV como production
ENV NODE_ENV=production
# Copia o node_modules do estágio "prod-deps" (só deps de produção)
COPY --from=prod-deps /app/node_modules ./node_modules
# Copia o package.json para o container
COPY package.json ./
# Copia o código fonte da API
COPY src ./src
# Copia os arquivos do frontend estático
COPY public ./public
# Roda o processo como usuário "node" (não root, mais seguro)
USER node
# Comando padrão: inicia o servidor direto com Node.js
CMD ["node", "src/index.js"]
