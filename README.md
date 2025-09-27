# Seara 2026

Projeto completo (API + aplicativo móvel) para gerenciamento e divulgação do encontro Seara 2026.

## Estrutura do repositório

- `backend/`: API FastAPI com autenticação de administradores, gerenciamento de programação, alertas e horários de confissão.
- `mobile/`: Aplicativo React Native (Expo) consumindo a API e oferecendo experiência pública e administrativa.

## Como executar localmente

### API
Consulte o arquivo [`backend/README.md`](backend/README.md) para detalhes de configuração. A API expõe documentação em `/docs` e gera alertas automáticos 10 minutos antes de cada evento.

### Aplicativo mobile

1. Instale as dependências:

```bash
cd mobile
npm install
```

2. Defina a URL da API (opcional). Por padrão o app usa `http://localhost:8000`. Para personalizar, crie um arquivo `.env` na pasta `mobile` com:

```
EXPO_PUBLIC_API_URL=http://192.168.0.10:8000
```

3. Inicie o projeto Expo:

```bash
npm run start
```

Utilize o aplicativo Expo Go para testar em dispositivos físicos ou um emulador Android/iOS.

## Publicação

- Android: configure o `android.package` em `mobile/app.json` e gere builds via `eas build --platform android`. Siga o guia da Expo para assinatura e publicação na Play Store.
- iOS: ajuste `ios.bundleIdentifier` e gere builds com `eas build --platform ios`, utilizando uma conta Apple Developer.

Certifique-se de configurar chaves push (FCM/APNS) no backend para envio real de notificações push. Atualmente o backend registra alertas enviados via logs/console, servindo como ponto de extensão para integrações futuras.
