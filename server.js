const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');


const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

const menuFilePath = './menu.json';

const serverFilePath = path.resolve(__dirname, 'server.js');
const publicFolderPath = path.resolve(__dirname, 'public');

if (path.dirname(serverFilePath) === publicFolderPath) {
  console.log('A pasta public está no mesmo diretório que o arquivo server.js');
} else {
  console.log('A pasta public não está no mesmo diretório que o arquivo server.js');
}

// Função para ler o arquivo JSON do cardápio
function getMenu() {
  const menuData = fs.readFileSync(menuFilePath);
  return JSON.parse(menuData);
}

// Função para salvar o cardápio no arquivo JSON
function saveMenu(menu) {
  const menuData = JSON.stringify(menu, null, 2);
  fs.writeFileSync(menuFilePath, menuData);
}


// Retornar o cardápio completo
app.get('/menu.', (req, res) => {
  try {
    const menuData = fs.readFileSync(menuFilePath, 'utf8');
    const menu = JSON.parse(menuData);

    // Verificar se o menu está vazio
    if (menu.length === 0) {
      return res.json([]);
    }

    res.json(menu);
  } catch (error) {
    console.error('Erro ao ler ou processar o arquivo do menu:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Adicionar um item ao cardápio
app.post('/menu', (req, res) => {
  const {nome, descricao, preco} = req.body;
  const menu = getMenu();

  const newItem = {
    id: menu.length + 1,
    nome,
    descricao,
    preco
  };

  menu.push(newItem);
  saveMenu(menu);

  res.status(201).json(newItem);
});



// Retornar um item específico do cardápio por ID
app.get('/menu/:id', (req, res) => {
  const {id} = req.params;
  const menu = getMenu();

  const item = menu.find(item => item.id === parseInt(id));

  if (item) {
    res.json(item);
  } else {
    res.status(404).json({error: 'Item não encontrado'});
  }
});

// Alterar um item do cardápio
app.put('/menu/:id', (req, res) => {
  const {id} = req.params;
  const {nome, descricao, preco} = req.body;
  const menu = getMenu();

  const item = menu.find(item => item.id === parseInt(id));

  if (item) {
    item.nome = nome || item.nome;
    item.descricao = descricao || item.descricao;
    item.preco = preco || item.preco;

    saveMenu(menu);

    res.json(item);
  } else {
    res.status(404).json({error: 'Item não encontrado'});
  }
});

// Excluir um item do cardápio
app.delete('/menu/:id', (req, res) => {
  const {id} = req.params;
  const menu = getMenu();

  const index = menu.findIndex(item => item.id === parseInt(id));

  if (index !== -1) {
    const deletedItem = menu.splice(index, 1)[0];
    saveMenu(menu);

    res.json(deletedItem);
  } else {
    res.status(404).json({ error: 'Item não encontrado' });
  }
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
