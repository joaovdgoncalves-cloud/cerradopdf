# CerradoPDF — Guia de Implantação (UniCerrado)

Guia de instalação do **CerradoPDF** no servidor institucional da UniCerrado.

## 1. Requisitos do servidor

- Linux (Debian/Ubuntu/RHEL ou equivalente)
- Docker Engine 24+ e Docker Compose v2
- 4 GB RAM mínimo (8 GB recomendado para OCR e arquivos grandes)
- 20 GB de disco livre
- Domínio público (ex.: `cerradopdf.unicerrado.edu.br`) apontando para o servidor
- Certificado TLS (Let's Encrypt ou certificado institucional)

## 2. Configuração da autenticação (Google Workspace)

O acesso é feito com a conta institucional Google Workspace da UniCerrado.

1. No [Google Cloud Console](https://console.cloud.google.com), crie um projeto (ou use o projeto institucional existente).
2. Em **APIs e serviços → Tela de permissão OAuth**, configure como **Interno** (restringe ao Workspace).
3. Em **Credenciais → Criar credenciais → ID do cliente OAuth**, tipo **Aplicativo da Web**:
   - URI de redirecionamento autorizado: `https://<dominio>/login/oauth2/code/google`
4. Copie `Client ID` e `Client Secret` para o `.env`:

```env
SECURITY_OAUTH2_ENABLED=true
SECURITY_OAUTH2_PROVIDER=google
SECURITY_OAUTH2_CLIENT_GOOGLE_CLIENTID=xxxx.apps.googleusercontent.com
SECURITY_OAUTH2_CLIENT_GOOGLE_CLIENTSECRET=xxxx
SECURITY_OAUTH2_USEASUSERNAME=email
SECURITY_OAUTH2_CLIENT_GOOGLE_SCOPES=email, profile
```

## 3. Domínios de e-mail autorizados

`SECURITY_ALLOWEDEMAILDOMAINS` controla quais domínios podem entrar (lista separada por vírgula):

```env
SECURITY_ALLOWEDEMAILDOMAINS=alunos.unicerrado.edu.br,unicerrado.edu.br
```

- Todo login Google é validado: e-mail fora da lista → "Acesso não autorizado".
- Contas locais com formato de e-mail (criadas pelo admin) também são validadas.
- Usuários locais sem `@` (ex.: `admin`) continuam válidos.
- Lista vazia (`[]`) desativa a verificação (comportamento original do CerradoPDF).

## 4. Deploy com Docker Compose

```bash
git clone <repo> cerradopdf && cd cerradopdf
cp .env.example .env   # edite os valores
docker compose --env-file .env -f docker/compose/docker-compose.cerradopdf.yml up -d --build
```

A aplicação sobe em `127.0.0.1:8080` (loopback — só o proxy local acessa).

## 5. Proxy reverso + HTTPS (nginx)

```nginx
server {
    listen 443 ssl;
    server_name cerradopdf.unicerrado.edu.br;

    ssl_certificate     /etc/letsencrypt/live/cerradopdf.unicerrado.edu.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cerradopdf.unicerrado.edu.br/privkey.pem;

    client_max_body_size 100m;   # alinhar com SYSTEM_FILEUPLOADLIMIT

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_request_buffering off;   # streaming de uploads grandes
    }
}
```

Importante: `SERVER_FORWARD_HEADERS_STRATEGY=framework` (já no `.env.example`) faz o Spring
confiar nos headers `X-Forwarded-*`, gerando URLs/redirects OAuth corretos em HTTPS.

## 6. Variáveis de ambiente

Todas as variáveis estão documentadas em [.env.example](.env.example). As principais:

| Variável | Função |
|---|---|
| `SYSTEM_BACKENDURL` | URL pública (callbacks OAuth/SAML) |
| `SECURITY_ALLOWEDEMAILDOMAINS` | Allowlist de domínios institucionais |
| `SECURITY_OAUTH2_CLIENT_GOOGLE_*` | Credenciais Google Workspace |
| `SYSTEM_FILEUPLOADLIMIT` | Limite de upload (ex.: `100MB`) |
| `SYSTEM_DEFAULTLOCALE` | Idioma padrão (`pt-BR`) |
| `UI_APPNAME*` | Nome exibido (CerradoPDF) |
| `SYSTEM_CORSALLOWEDORIGINS` | CORS restritivo em produção |

## 7. Privacidade e arquivos temporários

- Arquivos enviados ficam em diretório temporário interno do container (não mapeado em volume
  persistente) e são removidos pelo gerenciador de arquivos temporários após o processamento
  (ver `system.tempFileManagement` em `settings.yml.template`).
- Logs não incluem conteúdo de PDFs. Auditoria (`audit.level=1`) registra apenas eventos
  (login, operação), sem dados do documento.
- Telemetria externa desativada (`SYSTEM_ENABLEANALYTICS=false`, `POSTHOG`/`SCARF` off,
  `SYSTEM_GOOGLEVISIBILITY=false`).

## 8. Atualização

```bash
git pull
docker compose --env-file .env -f docker/compose/docker-compose.cerradopdf.yml up -d --build
```

## 9. Backup

Persistem apenas: volume `cerradopdf-config` (settings gerado + base de usuários interna) e
`cerradopdf-logs`. Faça backup do volume `cerradopdf-config` e do `.env` (fora do git).
Documentos de usuários não são armazenados — não há repositório de PDFs para backupear.

## 10. Logs e diagnóstico

```bash
docker logs -f cerradopdf          # aplicação
docker exec cerradopdf ls /logs    # arquivos de log
```

Login recusado por domínio aparece como `email domain '...' is not in security.allowedEmailDomains`.
Para depurar claims do Google: `SECURITY_OAUTH2_DEBUGLOGGING=true` (temporariamente — escreve PII).
