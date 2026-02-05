# =============================================================================
# Multi-stage Dockerfile for Agent Drive
# Produces switchboard image for deployment
#
# Build command:
#   docker build -t cr.vetra.io/rupert/agent-drive:<tag> .
# =============================================================================

# -----------------------------------------------------------------------------
# Base stage: Common setup for building
# -----------------------------------------------------------------------------
FROM node:24-alpine AS base

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ git bash \
    && ln -sf /usr/bin/python3 /usr/bin/python

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# Configure JSR registry
RUN pnpm config set @jsr:registry https://npm.jsr.io

# Install prisma globally
RUN pnpm add -g prisma@5.17.0

WORKDIR /app/project

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./
COPY .npmrc* ./

# Copy project configuration files
COPY powerhouse.manifest.json powerhouse.config.json* ./
COPY tsconfig*.json vite.config.ts* vitest.config.ts* eslint.config.js* ./

# Copy source directories
COPY document-models/ ./document-models/
COPY editors/ ./editors/
COPY processors/ ./processors/
COPY subgraphs/ ./subgraphs/
COPY scripts/ ./scripts/
COPY index.ts style.css ./

# Install dependencies (--ignore-scripts to skip broken postinstall in @powerhousedao/agent-manager)
RUN pnpm install --ignore-scripts

# Build the project
RUN pnpm build

# Regenerate Prisma client for Alpine Linux
RUN prisma generate --schema node_modules/document-drive/dist/prisma/schema.prisma || true

# -----------------------------------------------------------------------------
# Switchboard final stage - node runtime
# -----------------------------------------------------------------------------
FROM node:24-alpine AS switchboard

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache curl openssl

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# Configure JSR registry
RUN pnpm config set @jsr:registry https://npm.jsr.io

# Install prisma globally (needed for migrations)
RUN pnpm add -g prisma@5.17.0

# Copy built project from build stage
COPY --from=base /app/project /app/project

WORKDIR /app/project

# Copy entrypoint script
COPY docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=""
ENV SKIP_DB_MIGRATIONS="false"

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
