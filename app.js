require('dotenv').config();
const express = require('express');
const { auth } = require('express-openid-connect');
const session = require('express-session');
const path = require('path');
const promptManager = require('./utils/promptManager');
const subscriptionController = require('./controllers/subscriptionController');

const app = express();

// Configuração do Auth0
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SESSION_SECRET,
  baseURL: process.env.BASE_URL || 'http://localhost:4040',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de sessão
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 dia
  }
}));

// Configuração do Auth0
app.use(auth(config));

// Configuração do Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
  if (req.oidc.user && req.oidc.user.email === process.env.ADMIN_EMAIL) {
    next();
  } else {
    res.status(403).render('error', {
      message: 'Acesso negado. Apenas administradores podem acessar esta página.',
      error: {}
    });
  }
};

// Rotas
app.get('/', (req, res) => {
  res.render('index', {
    user: req.oidc.user,
    isAuthenticated: req.oidc.isAuthenticated(),
    isAdmin: req.oidc.user?.email === process.env.ADMIN_EMAIL
  });
});

app.get('/profile', (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.render('profile', {
    user: req.oidc.user,
    isAuthenticated: req.oidc.isAuthenticated(),
    isAdmin: req.oidc.user?.email === process.env.ADMIN_EMAIL
  });
});

// Rotas de prompts
app.get('/prompts/:category', async (req, res) => {
  try {
    const prompts = await promptManager.getPromptsByCategory(req.params.category);
    res.render('prompts/list', {
      prompts,
      category: req.params.category,
      isAuthenticated: req.oidc.isAuthenticated(),
      isAdmin: req.oidc.user?.email === process.env.ADMIN_EMAIL
    });
  } catch (error) {
    console.error('Erro ao listar prompts:', error);
    res.status(500).render('error', {
      message: 'Erro ao carregar prompts',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

app.get('/prompts/:category/new', isAdmin, (req, res) => {
  res.render('prompts/form', {
    category: req.params.category,
    prompt: {},
    isAuthenticated: req.oidc.isAuthenticated(),
    isAdmin: true
  });
});

app.post('/prompts/:category', isAdmin, async (req, res) => {
  try {
    const promptData = {
      ...req.body,
      category: req.params.category,
      createdBy: req.oidc.user.email,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      isPublic: req.body.isPublic === 'on'
    };

    await promptManager.createPrompt(promptData);
    res.redirect(`/prompts/${req.params.category}`);
  } catch (error) {
    console.error('Erro ao criar prompt:', error);
    res.status(500).render('error', {
      message: 'Erro ao criar prompt',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

app.get('/prompts/:category/:id/edit', isAdmin, async (req, res) => {
  try {
    const prompt = await promptManager.getPromptById(req.params.id);
    if (!prompt) {
      return res.status(404).render('error', {
        message: 'Prompt não encontrado',
        error: {}
      });
    }

    res.render('prompts/form', {
      category: req.params.category,
      prompt,
      isAuthenticated: req.oidc.isAuthenticated(),
      isAdmin: true
    });
  } catch (error) {
    console.error('Erro ao carregar prompt:', error);
    res.status(500).render('error', {
      message: 'Erro ao carregar prompt',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

app.post('/prompts/:category/:id', isAdmin, async (req, res) => {
  try {
    const promptData = {
      ...req.body,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      isPublic: req.body.isPublic === 'on'
    };

    const updatedPrompt = await promptManager.updatePrompt(req.params.id, promptData);
    if (!updatedPrompt) {
      return res.status(404).render('error', {
        message: 'Prompt não encontrado',
        error: {}
      });
    }

    res.redirect(`/prompts/${req.params.category}`);
  } catch (error) {
    console.error('Erro ao atualizar prompt:', error);
    res.status(500).render('error', {
      message: 'Erro ao atualizar prompt',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

app.post('/prompts/:category/:id/delete', isAdmin, async (req, res) => {
  try {
    const deleted = await promptManager.deletePrompt(req.params.id);
    if (!deleted) {
      return res.status(404).render('error', {
        message: 'Prompt não encontrado',
        error: {}
      });
    }

    res.redirect(`/prompts/${req.params.category}`);
  } catch (error) {
    console.error('Erro ao excluir prompt:', error);
    res.status(500).render('error', {
      message: 'Erro ao excluir prompt',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// Rotas de assinatura
app.get('/subscription', subscriptionController.showSubscriptionPage);
app.post('/subscription/generate-pix', subscriptionController.generatePix);
app.post('/webhook/pix', subscriptionController.webhookPix);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    message: 'Algo deu errado!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 