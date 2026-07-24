# ---- Frontend build stage ----
FROM node:22-alpine AS frontend-build
WORKDIR /app
RUN corepack enable
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ ./
RUN pnpm build

# ---- Backend runtime stage ----
FROM python:3.12-slim AS backend
WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --locked --no-install-project

COPY backend/ ./
RUN uv sync --locked

COPY --from=frontend-build /app/dist ./static

ENV PATH="/app/.venv/bin:$PATH"
EXPOSE 8000

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
