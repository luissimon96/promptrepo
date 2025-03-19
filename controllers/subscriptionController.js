const axios = require('axios');
const qrcode = require('qrcode');
const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

// Função para ler usuários
async function getUsers() {
  try {
    await fs.access(USERS_FILE);
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    await fs.writeFile(USERS_FILE, '[]');
    return [];
  }
}

// Função para salvar usuários
async function saveUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Função para atualizar status do usuário
async function updateUserStatus(email, isPro) {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    users.push({ email, isPro });
  } else {
    users[userIndex].isPro = isPro;
  }
  
  await saveUsers(users);
}

// Função para verificar se o usuário é Pro
async function isUserPro(email) {
  const users = await getUsers();
  const user = users.find(u => u.email === email);
  return user?.isPro || false;
}

// Controlador da página de assinatura
exports.showSubscriptionPage = async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/login');
  }

  try {
    // Gerar QR Code com a chave PIX
    const pixKey = process.env.PIX_KEY;
    const qrCodeData = await qrcode.toDataURL(pixKey);

    res.render('subscription', {
      user: req.oidc.user,
      isAuthenticated: true,
      isAdmin: req.oidc.user.email === process.env.ADMIN_EMAIL,
      qrCodeData,
      pixCopyPaste: pixKey
    });
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    res.status(500).render('error', {
      message: 'Erro ao gerar o QR Code',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Rota simplificada para gerar PIX (caso necessário recarregar)
exports.generatePix = async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/login');
  }

  try {
    const pixKey = process.env.PIX_KEY;
    const qrCodeData = await qrcode.toDataURL(pixKey);

    res.render('subscription', {
      user: req.oidc.user,
      isAuthenticated: true,
      isAdmin: req.oidc.user.email === process.env.ADMIN_EMAIL,
      qrCodeData,
      pixCopyPaste: pixKey
    });
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    res.status(500).render('error', {
      message: 'Erro ao gerar o QR Code',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Webhook para receber confirmação de pagamento
exports.webhookPix = async (req, res) => {
  try {
    // Verificar assinatura do webhook
    const signature = req.headers['x-openpix-signature'];
    if (!signature || !verifySignature(signature, req.body)) {
      return res.status(401).json({ error: 'Assinatura inválida' });
    }

    const { status, correlationID } = req.body;
    if (status === 'COMPLETED') {
      const email = correlationID.split('-')[1];
      await updateUserStatus(email, true);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
};

// Função para verificar assinatura do webhook
function verifySignature(signature, payload) {
  // Implementar verificação de assinatura conforme documentação da OpenPix
  return true; // Temporário
} 