# PromptRepo

Sistema de gerenciamento de prompts para Inteligência Artificial, permitindo organizar e compartilhar prompts para diferentes tipos de IAs.

## 🚀 Funcionalidades

- ✨ Gerenciamento de prompts por categorias (texto, imagem, código)
- 🔐 Autenticação segura com Auth0
- 👥 Sistema de administração
- 💰 Sistema de assinatura via PIX
- 🎨 Interface moderna e responsiva
- 🔄 Deploy automático via GitHub Actions

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Conta no [Auth0](https://auth0.com)

## 🔧 Configuração do Ambiente

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/promptrepo.git
cd promptrepo
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`
   - Preencha as variáveis com suas configurações:

```env
PORT=4040
SESSION_SECRET=seu_segredo_aqui
AUTH0_CLIENT_ID=seu_client_id_aqui
AUTH0_ISSUER_BASE_URL=https://seu-tenant.auth0.com
BASE_URL=http://localhost:4040
DEV_PORT=4041
PROD_PORT=4040
ADMIN_EMAIL=seu_email@admin.com
OPENPIX_API_KEY=sua_chave_api_aqui
PIX_KEY=seu_email@exemplo.com
```

### Configuração do Auth0

1. Crie uma conta no [Auth0](https://auth0.com)
2. Crie uma nova aplicação do tipo "Regular Web Application"
3. Configure as URLs permitidas:
   - Allowed Callback URLs: `http://localhost:4040/callback`
   - Allowed Logout URLs: `http://localhost:4040`
   - Allowed Web Origins: `http://localhost:4040`
4. Copie o "Domain" e "Client ID" para o arquivo `.env`

## 🚀 Executando o Projeto

1. Para desenvolvimento:

```bash
npm run dev
```

2. Para produção:

```bash
npm start
```

O servidor estará disponível em `http://localhost:4040`

## 🚀 Deploy

### Deploy Automático na Vercel

O projeto está configurado com GitHub Actions para fazer deploy automático na Vercel quando houver push na branch main.

Para configurar o deploy automático:

1. Faça fork deste repositório
2. Conecte sua conta Vercel ao GitHub
3. Instale o [Vercel CLI](https://vercel.com/cli) localmente:

   ```bash
   npm i -g vercel
   ```

4. Faça login na Vercel CLI:

   ```bash
   vercel login
   ```

5. Vincule seu projeto à Vercel:

   ```bash
   vercel link
   ```

6. Obtenha as variáveis necessárias para o GitHub Actions:

   a. **VERCEL_TOKEN**:
      - Acesse <https://vercel.com/account/tokens>
      - Clique em "Create Token"
      - Dê um nome como "GitHub Actions"
      - Copie o token gerado

   b. **VERCEL_ORG_ID**:
      - Método 1 (Dashboard):
        - Acesse <https://vercel.com/dashboard>
        - Clique no seu projeto
        - Vá em "Settings"
        - Role até "General"
        - Copie o "Organization ID"

      - Método 2 (CLI):

        ```bash
        vercel whoami
        # ou
        vercel link
        vercel env pull
        ```

   c. **VERCEL_PROJECT_ID**:
      - No dashboard do projeto
      - Settings > General
      - Copie o "Project ID"

7. Adicione estes secrets no seu repositório GitHub:
   - Vá para Settings > Secrets and variables > Actions
   - Adicione os seguintes secrets:
     - VERCEL_TOKEN
     - VERCEL_ORG_ID
     - VERCEL_PROJECT_ID

8. Configure as variáveis de ambiente na Vercel:
   - Copie todas as variáveis do arquivo `.env`
   - Ajuste o `BASE_URL` para sua URL de produção

Após a configuração, cada push na branch main irá:

1. Executar os testes (se houver)
2. Fazer o build do projeto
3. Se o build for bem-sucedido, fazer deploy na Vercel

### Deploy Manual na Vercel

1. Faça fork deste repositório
2. Conecte sua conta Vercel ao GitHub
3. Importe o projeto na Vercel
4. Configure as variáveis de ambiente na Vercel:
   - Copie todas as variáveis do arquivo `.env`
   - Ajuste o `BASE_URL` para sua URL de produção
5. Deploy!

## 🛠️ Tecnologias Utilizadas

- Express.js - Framework web
- Auth0 - Autenticação
- Pug - Template engine
- Bootstrap - Framework CSS
- Node.js - Runtime

## 📄 Licença

Este projeto está sob a licença ISC - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes

## ✨ Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push da Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 🤝 Suporte

Para suporte, envie um email para <luissimon96@gmail.com> ou abra uma issue no GitHub.
