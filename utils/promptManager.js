const fs = require('fs').promises;
const path = require('path');

const PROMPTS_FILE = path.join(__dirname, '..', 'data', 'prompts.json');

// Garantir que o arquivo existe
async function ensureFile() {
  try {
    await fs.access(PROMPTS_FILE);
  } catch {
    await fs.writeFile(PROMPTS_FILE, '[]');
  }
}

// Ler todos os prompts
async function getAllPrompts() {
  await ensureFile();
  const data = await fs.readFile(PROMPTS_FILE, 'utf8');
  return JSON.parse(data);
}

// Salvar todos os prompts
async function savePrompts(prompts) {
  await fs.writeFile(PROMPTS_FILE, JSON.stringify(prompts, null, 2));
}

// Obter prompts por categoria
async function getPromptsByCategory(category) {
  const prompts = await getAllPrompts();
  return prompts.filter(p => p.category === category);
}

// Obter prompt por ID
async function getPromptById(id) {
  const prompts = await getAllPrompts();
  return prompts.find(p => p.id === id);
}

// Criar novo prompt
async function createPrompt(promptData) {
  const prompts = await getAllPrompts();
  const newPrompt = {
    id: Date.now().toString(),
    ...promptData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  prompts.push(newPrompt);
  await savePrompts(prompts);
  return newPrompt;
}

// Atualizar prompt
async function updatePrompt(id, promptData) {
  const prompts = await getAllPrompts();
  const index = prompts.findIndex(p => p.id === id);
  if (index === -1) return null;

  prompts[index] = {
    ...prompts[index],
    ...promptData,
    updatedAt: new Date().toISOString()
  };

  await savePrompts(prompts);
  return prompts[index];
}

// Deletar prompt
async function deletePrompt(id) {
  const prompts = await getAllPrompts();
  const index = prompts.findIndex(p => p.id === id);
  if (index === -1) return false;

  prompts.splice(index, 1);
  await savePrompts(prompts);
  return true;
}

module.exports = {
  getPromptsByCategory,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt
}; 