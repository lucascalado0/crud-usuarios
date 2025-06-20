document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-container form');
    const inputNome = document.getElementById('inputNome');
    const inputSobrenome = document.getElementById('inputSobrenome');
    const inputEmail = document.getElementById('inputEmail');
    const inputTelefone = document.getElementById('inputTelefone');
    const content2 = document.querySelector('.content-2');
    const submitButton = document.querySelector('.form-container button[type="submit"]');

    const API_BASE_URL = 'http://localhost:8080/api/usuarios';

    
    document.getElementById('inputTelefone').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        let maskedValue = '';

        if (value.length > 0) {
            maskedValue += '(' + value.substring(0, 2);
        }
        if (value.length >= 3) {
            maskedValue += ') ' + value.substring(2, 7);
        }
        if (value.length >= 8) {
            maskedValue += '-' + value.substring(7, 11);
        }

        e.target.value = maskedValue;
    });


    async function carregarUsuarios() {
        try {
            const response = await fetch(API_BASE_URL + '/listar'); 
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erro HTTP! Status: ${response.status} - ${errorData.message || response.statusText}`);
            }

            const usuarios = await response.json();
            renderTable(usuarios);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            alert(`Erro ao carregar usuários: ${error.message}. Verifique o console para detalhes.`);
        }
    }


function renderTable(usuarios) {
    const tableContainer = document.createElement('div'); 
    tableContainer.classList.add('table-responsive-scroll'); 

    const table = document.createElement('table');
    table.classList.add('table', 'table-striped');

    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Sobrenome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;

    const tbody = table.querySelector('tbody');

    usuarios.forEach(user => {
        const row = tbody.insertRow();
        row.dataset.userId = user.id;

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nome}</td>
            <td>${user.sobrenome}</td>
            <td>${user.email}</td>
            <td>${user.telefone}</td>
            <td>
                <button class="btn btn-warning btn-sm edit-btn" data-id="${user.id}">Editar</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${user.id}">Excluir</button>
            </td>
        `;
    });

    tableContainer.appendChild(table); 
    content2.innerHTML = ''; 
    content2.appendChild(tableContainer); 
}

    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = form.dataset.editingId;
        const user = {
            nome: inputNome.value,
            sobrenome: inputSobrenome.value,
            email: inputEmail.value,
            telefone: inputTelefone.value
        };

        try {
            let response;
            if (id) {
                response = await fetch(`${API_BASE_URL}/${id}`, { 
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                });
            } else {
                response = await fetch(API_BASE_URL + '/cadastrar', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erro ao salvar usuário: ${errorData.message || response.statusText}`);
            }

            form.reset();
            delete form.dataset.editingId;
            submitButton.textContent = 'Cadastrar'; 
            carregarUsuarios(); 
            alert(`Usuário ${id ? 'atualizado' : 'cadastrado'} com sucesso!`);
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            alert(`Erro ao salvar usuário: ${error.message}. Verifique o console para mais detalhes.`);
        }
    });

    
    content2.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`); 
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Erro HTTP! Status: ${response.status} - ${errorData.message || response.statusText}`);
                }
                const user = await response.json();

                inputNome.value = user.nome;
                inputSobrenome.value = user.sobrenome;
                inputEmail.value = user.email;
                inputTelefone.value = user.telefone;

                form.dataset.editingId = user.id;
                submitButton.textContent = 'Atualizar'; 
            } catch (error) {
                console.error('Erro ao buscar usuário para edição:', error);
                alert(`Erro ao carregar usuário para edição: ${error.message}. Verifique o console para mais detalhes.`);
            }
        } else if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            if (confirm(`Tem certeza que deseja excluir o usuário com ID ${id}?`)) {
                try {
                    const response = await fetch(`${API_BASE_URL}/${id}`, { 
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Erro HTTP! Status: ${response.status} - ${errorData.message || response.statusText}`);
                    }
                    carregarUsuarios(); 
                    alert('Usuário excluído com sucesso!');
                } catch (error) {
                    console.error('Erro ao excluir usuário:', error);
                    alert(`Erro ao excluir usuário: ${error.message}. Verifique o console para mais detalhes.`);
                }
            }
        }
    });

    carregarUsuarios();
});