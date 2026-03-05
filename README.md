# Gerenciador de Anúncios

API + Frontend para gerenciamento de anúncios.

**Stack:** Node.js, Express, Drizzle ORM, MySQL

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/)

## Variáveis de ambiente

Cada ambiente possui seu próprio arquivo `.env`:

| Arquivo | Ambiente |
|---|---|
| `.env.dev` | Desenvolvimento |
| `.env.staging` | Homologação |
| `.env.prod` | Produção |

Copie o `.env.example` como base e ajuste conforme necessário.

## Docker — Ambientes

### Desenvolvimento

Live reload ativado, código montado via volume, MySQL acessível no host (porta 3306).

```bash
docker compose -f docker-compose.yaml -f docker-compose.dev.yaml --env-file .env.dev up -d --build
```

### Homologação

Imagem otimizada para produção, porta 3001, limites de 512MB RAM / 0.5 CPU.

```bash
docker compose -f docker-compose.yaml -f docker-compose.staging.yaml --env-file .env.staging up --build -d
```

### Produção

Imagem otimizada, porta 80, limites de 1GB RAM / 1 CPU.

```bash
docker compose -f docker-compose.yaml -f docker-compose.prod.yaml --env-file .env.prod up --build -d
```

## Aplicar schema no banco

Após subir os containers, aplique o schema do Drizzle:

```bash
# Dev
docker compose -f docker-compose.yaml -f docker-compose.dev.yaml --env-file .env.dev exec app npm run db:push

# Staging
docker compose -f docker-compose.yaml -f docker-compose.staging.yaml --env-file .env.staging exec app npm run db:push

# Produção
docker compose -f docker-compose.yaml -f docker-compose.prod.yaml --env-file .env.prod exec app npm run db:push
```

## Comparativo dos ambientes

| | Dev | Staging | Produção |
|---|---|---|---|
| Build target | `dev` | `production` | `production` |
| Porta | 3000 | 3001 | 80 |
| Volume de código | Sim | Não | Não |
| MySQL exposto no host | Sim (3306) | Não | Não |
| Restart policy | unless-stopped | always | always |
| Limites de recursos | — | 512MB / 0.5 CPU | 1GB / 1 CPU |

## Sem Docker (local)

```bash
npm install
npm run db:push
npm run dev
```

Acesse `http://localhost:3000`.

## API

Base: `/api/ads`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/ads` | Listar todos |
| GET | `/api/ads/:id` | Buscar por ID |
| POST | `/api/ads` | Criar anúncio |
| PUT | `/api/ads/:id` | Atualizar anúncio |
| DELETE | `/api/ads/:id` | Remover anúncio |
