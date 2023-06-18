document.addEventListener('DOMContentLoaded', () => {
    const addItemForm = document.getElementById('addItemForm');
    const menuItems = document.getElementById('menuItems');
  
    // Função para carregar o cardápio completo
    function loadMenu() {
      fetch('http://localhost:3000/menu')
        .then(response => response.json())
        .then(data => {
          const menuItems = document.getElementById('menuItems');
          menuItems.innerHTML = '';
    
          data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${item.id}</td>
              <td>${item.nome}</td>
              <td>${item.descricao}</td>
              <td>${item.preco}</td>
            `;
            menuItems.appendChild(row);
          });
        })
        .catch(error => {
          console.error('Erro ao carregar o cardápio:', error);
        });
    }
    
  
    // Função para adicionar um item ao cardápio
    function addItem(event) {
      event.preventDefault();
  
      const nome = document.getElementById('nome').value;
      const descricao = document.getElementById('descricao').value;
      const preco = parseFloat(document.getElementById('preco').value);
  
      const newItem = {
        nome,
        descricao,
        preco
      };
  
      fetch('http://localhost:3000/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      })
        .then(response => response.json())
        .then(data => {
          console.log('Item adicionado:', data);
          addItemForm.reset();
          loadMenu();
        })
        .catch(error => {
          console.error('Erro ao adicionar item:', error);
        });
    }
  
    addItemForm.addEventListener('submit', addItem);
  
    loadMenu();
  });
  