# Aplicativo móvel Seara 2026

Aplicativo desenvolvido com Expo/React Native para consulta pública da programação do Seara 2026 e painel administrativo protegido por login.

## Pré-requisitos

- Node.js 18+
- Expo CLI (opcional) `npm install -g expo-cli`

## Configuração

1. Instale dependências:

```bash
npm install
```

2. Configure a URL da API FastAPI:
   - Por padrão o app usa `http://localhost:8000`.
   - Para customizar, crie um arquivo `.env` com `EXPO_PUBLIC_API_URL=http://seu-servidor:8000`.

3. Inicie o projeto:

```bash
npm run start
```

Use o Expo Go ou emuladores Android/iOS para testar. O painel administrativo fica na aba "Admin" e requer login válido (credenciais gerenciadas pela API).

## Build para lojas

Siga a documentação do [Expo Application Services](https://docs.expo.dev/eas/) para gerar binários assinados com os identificadores definidos em `app.json`.
