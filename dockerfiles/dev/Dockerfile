FROM node:22
WORKDIR /secrethome

RUN apt-get update && \
  apt-get install --no-install-recommends -y curl && \
  rm -rf /var/lib/apt/lists/*

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
COPY ./main/package.json ./main/

RUN corepack enable pnpm && pnpm i