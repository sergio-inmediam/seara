# Seara 2026 API

API construída com FastAPI para atender aos requisitos administrativos do aplicativo Seara 2026.

## Configuração

1. Crie um ambiente virtual e instale as dependências:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Defina variáveis de ambiente (opcional) para criar o primeiro usuário administrador automaticamente:

```bash
export SEARA_ADMIN_EMAIL=admin@seara2026.com
export SEARA_ADMIN_PASSWORD=senha-super-segura
export JWT_SECRET_KEY=uma-chave-secreta
```

3. Execute a API:

```bash
uvicorn app.main:app --reload
```

A API será disponibilizada em `http://127.0.0.1:8000`. A documentação automática pode ser acessada em `/docs`.

## Endpoints principais

- `POST /auth/login`: autenticação de administradores.
- `POST /auth/users`: criação de novos usuários administradores (requer login).
- `GET /public/events`: lista de eventos públicos.
- `GET /public/confessions`: horários de confissão.
- `GET /public/alerts`: alertas agendados.
- `POST /admin/events`: cadastro de eventos.
- `POST /admin/alerts`: cadastro de alertas manuais.
- `POST /admin/confessions`: cadastro de horários de confissão.

Alertas automáticos são gerados 10 minutos antes do início de cada evento cadastrado.
