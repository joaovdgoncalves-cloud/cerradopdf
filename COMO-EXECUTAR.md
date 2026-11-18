# Como executar o CerradoPDF

Guia de configuração e execução do sistema, do uso local até o servidor institucional.

## 1. O que precisa estar instalado

| Item | Obrigatório? | Detalhe |
|---|---|---|
| Windows 10/11 | Sim (scripts `.bat`) | Para Linux/Mac, ver `INSTALACAO.md` |
| Git | Opcional | Só para clonar; dá para baixar o ZIP do repositório |
| Java 21 | **Não** | O `INICIAR-CERRADOPDF.bat` baixa um JDK portátil sozinho (~190 MB, uma vez) em `%USERPROFILE%\.cerradopdf\` |
| Node.js | **Não** | Idem — o script baixa Node portátil se não houver um instalado |
| Docker | Só para produção | Não é necessário para rodar local |

> Em máquina nova, a primeira execução demora alguns minutos (downloads + `npm ci` + compilação Gradle). Nas execuções seguintes sobe em ~1 minuto.

## 2. Execução local (um clique)

```bash
git clone https://github.com/joaovdgoncalves-cloud/cerradopdf.git
cd cerradopdf
# duplo clique em INICIAR-CERRADOPDF.bat  (ou execute pelo terminal)
```

O script faz tudo:

1. Verifica/baixa JDK 21 portátil
2. Verifica/baixa Node.js portátil
3. Instala dependências do frontend (`npm ci`, só na 1ª vez)
4. Sobe o backend em `http://localhost:8080`
5. Sobe o frontend em `http://127.0.0.1:5173` e abre o navegador

**Sem configuração adicional o sistema sobe em modo livre (sem login).** As duas janelas
(backend e frontend) precisam ficar abertas; fechar uma delas derruba a parte correspondente.

### Componentes individuais

| Script | Função |
|---|---|
| `INICIAR-CERRADOPDF.bat` | Sobe backend + frontend de uma vez |
| `start-backend-local.bat` | Só o backend (Gradle `bootRun`, porta 8080) |
| `start-frontend-local.bat` | Só o frontend (Vite dev server, porta 5173) |
| `start-tunnel.bat` | Túnel Cloudflare opcional — gera URL pública `*.trycloudflare.com` temporária |

## 3. Ativando o login Google (local)

O login com Google **não vem ligado por padrão** no clone — as credenciais OAuth ficam
fora do Git por segurança. Para ativar:

1. Copie `oauth-local.env.example` para `oauth-local.env` (mesma pasta)
2. Preencha `SECURITY_OAUTH2_CLIENT_GOOGLE_CLIENTID` e `SECURITY_OAUTH2_CLIENT_GOOGLE_CLIENTSECRET`
   com um client OAuth do Google Cloud Console (seção 4)
3. Rode `INICIAR-CERRADOPDF.bat` — ao detectar o arquivo, o backend liga o login
   automaticamente

O `oauth-local.env` é coberto pelo `.gitignore` (`*-local.env`) e nunca vai para o repositório.

### Domínios permitidos

`SECURITY_ALLOWEDEMAILDOMAINS` controla quais domínios de e-mail podem entrar:

```
SECURITY_ALLOWEDEMAILDOMAINS=alunos.unicerrado.edu.br,unicerrado.edu.br
```

Qualquer conta fora desses domínios é bloqueada no login.

## 4. Configurando o OAuth no Google Cloud Console

1. Acesse <https://console.cloud.google.com/apis/credentials>
2. Crie um projeto (ex.: `cerradopdf`) → **Criar credenciais → ID do cliente OAuth**
3. Tipo: **Aplicativo da Web**
4. Em **URIs de redirecionamento autorizados**, adicione:

   ```
   http://localhost:8080/login/oauth2/code/google
   http://127.0.0.1:5173/login/oauth2/code/google
   https://SEU-DOMINIO/login/oauth2/code/google     (produção)
   ```

5. Copie o **Client ID** e o **Client Secret** gerados

> Nunca versione o Client Secret. Local: `oauth-local.env`. Produção: variável de
> ambiente do servidor. Se um secret vazar, gere um novo no console.

## 5. Produção (servidor institucional)

Veja `INSTALACAO.md` para o guia completo. Resumo:

```bash
cp .env.example .env    # preencha domínio, segredos e URLs públicas
docker compose --env-file .env -f docker/compose/docker-compose.cerradopdf.yml up -d --build
```

Variáveis essenciais no `.env`:

| Variável | Para quê |
|---|---|
| `SYSTEM_BACKENDURL` / `SYSTEM_FRONTENDURL` | URL pública HTTPS do sistema |
| `SYSTEM_CORSALLOWEDORIGINS` | Origem permitida (mesmo domínio) |
| `SECURITY_OAUTH2_CLIENT_GOOGLE_CLIENTID` / `...CLIENTSECRET` | Credenciais OAuth |
| `SECURITY_ALLOWEDEMAILDOMAINS` | Domínios UniCerrado autorizados |
| `SECURITY_INITIALLOGIN_PASSWORD` | Senha inicial do admin local (trocar no 1º acesso) |
| `SYSTEM_FILEUPLOADLIMIT` | Limite de upload (padrão 100 MB) |
| `SERVER_SERVLET_SESSION_COOKIE_SECURE` | `true` sob HTTPS |
| `SERVER_FORWARD_HEADERS_STRATEGY` | `framework` atrás de proxy reverso |

Volumes persistentes do compose: `cerradopdf-config` (configs/banco), `cerradopdf-logs`,
`cerradopdf-tessdata` (idiomas do OCR).

## 6. O que já vem pronto no código

- Identidade CerradoPDF (logo, cores, favicon, textos em pt-BR)
- Página **Sobre** (`/sobre`, ícone ⓘ no rail) com créditos da equipe e do Stirling-PDF
- **Tutorial** em PDF no rail lateral (ícone 📄, abre `/Tutorial-CerradoPDF.pdf`)
- Aviso de privacidade com aceite no primeiro acesso (guardado no navegador)
- Ferramentas indisponíveis no servidor ficam ocultas automaticamente
- Allowlist de domínios no login Google e em contas locais com e-mail

## 7. Estrutura do repositório

```
app/                 backend Java (Spring Boot, Gradle)
frontend/editor/     frontend React + Vite + TypeScript
docker/              Dockerfiles e composes
render.yaml          deploy declarativo (Render)
INICIAR-CERRADOPDF.bat / start-*.bat    execução local Windows
INSTALACAO.md        guia de implantação em servidor
```

O CerradoPDF é um fork do [Stirling-PDF](https://github.com/Stirling-Tools/Stirling-PDF)
(licença MIT) — créditos e avisos preservados em `LICENSE` e `3rdPartyLicenses.json`.
