const API_URL = 'http://localhost:5077/api';

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

function editarVenda(id) {
    localStorage.setItem('editandoVendaId', id);
    window.location.href = 'editar-venda.html';
}

async function editarProduto(id) {
    localStorage.setItem('editandoProdutoId', id);
    window.location.href = 'editar-produto.html';
}

async function editarCategoria(id) {
    localStorage.setItem('editandoCategoriaId', id);
    window.location.href = 'editar-categoria.html';
}

async function editarFornecedor(id) {
    localStorage.setItem('editandoFornecedorId', id);
    window.location.href = 'editar-fornecedor.html';
}

async function editarMovimentacao(id) {
    localStorage.setItem('editandoMovimentacaoId', id);
    window.location.href = 'editar-movimentacao.html';
}

async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`);
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erro na requisição');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message || 'Erro ao carregar dados');
        return [];
    }
}

async function postData(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erro na requisição');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message || 'Erro ao salvar dados');
        return null;
    }
}

async function deleteData(endpoint, id) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erro na requisição');
        }
        
        return true;
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message || 'Erro ao excluir dados');
        return false;
    }
}
async function carregarProdutos(formContext) {
    try {
        const produtos = await fetchData('produto');
        const tbody = document.querySelector('#produtosTable tbody');
        const selectMovimentacao = document.getElementById('produtoMovimentacao');
        const selectVenda = document.getElementById('produtoVenda');
        
        if (tbody) {
            tbody.innerHTML = '';
            produtos.sort((a, b) => b.id - a.id).forEach(produto => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>${produto.descricao}</td>
                    <td>${produto.quantidade}</td>
                    <td>R$ ${produto.preco.toFixed(2)}</td>
                    <td>${produto.categoria?.nome || ''}</td>
                    <td>${produto.fornecedor?.nome || ''}</td>
                    <td class="acoes">
                        <button class="btn-editar" data-id="${produto.id}">Editar</button>
                        <button class="btn-excluir" data-id="${produto.id}">Excluir</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            tbody.querySelectorAll('.btn-editar').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    editarProduto(id);
                });
            });

            tbody.querySelectorAll('.btn-excluir').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    excluirProduto(id);
                });
            });
        }
        
        if (selectMovimentacao && formContext !== 'venda') {
            selectMovimentacao.innerHTML = '<option value="">Selecione um produto</option>';
            produtos.forEach(produto => {
                const option = document.createElement('option');
                option.value = produto.id;
                option.textContent = `${produto.nome} (Estoque: ${produto.quantidade})`;
                selectMovimentacao.appendChild(option);
            });
        }

        if (selectVenda && formContext === 'venda') {
            selectVenda.innerHTML = '<option value="">Selecione um produto</option>';
            produtos.forEach(produto => {
                const option = document.createElement('option');
                option.value = produto.id;
                option.dataset.preco = produto.preco;
                option.textContent = `${produto.nome} (Estoque: ${produto.quantidade})`;
                selectVenda.appendChild(option);
            });

            selectVenda.addEventListener('change', () => {
                const selectedOption = selectVenda.options[selectVenda.selectedIndex];
                const precoUnitarioInput = document.getElementById('precoUnitario');
                const precoTotalInput = document.getElementById('precoTotal');
                
                if (selectedOption.value) {
                    const precoUnitario = parseFloat(selectedOption.dataset.preco);
                    precoUnitarioInput.value = `R$ ${precoUnitario.toFixed(2)}`;
                    
                    const quantidade = document.getElementById('quantidadeVenda').value;
                    if (quantidade) {
                        const precoTotal = precoUnitario * parseInt(quantidade) * 100/8;
                        precoTotalInput.value = `R$ ${precoTotal.toFixed(2)}`;

                    } else {
                        precoTotalInput.value = '';
                    }
                } else {
                    precoUnitarioInput.value = '';
                    precoTotalInput.value = '';
                }
            });
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

async function adicionarProduto(event) {
    event.preventDefault();
    
    try {
        const nome = document.getElementById('nomeProduto')?.value.trim();
        const descricao = document.getElementById('descricaoProduto')?.value.trim();
        const quantidade = document.getElementById('quantidadeProduto')?.value;
        const preco = document.getElementById('precoProduto')?.value;
        const categoriaId = document.getElementById('categoriaProduto')?.value;
        const fornecedorId = document.getElementById('fornecedorProduto')?.value;

        if (!nome) {
            alert('Por favor, preencha o nome do produto');
            return;
        }
        if (!descricao) {
            alert('Por favor, preencha a descrição do produto');
            return;
        }
        if (!quantidade || quantidade <= 0) {
            alert('Por favor, insira uma quantidade válida maior que zero');
            return;
        }
        if (!preco || preco <= 0) {
            alert('Por favor, insira um preço válido maior que zero');
            return;
        }
        if (!categoriaId) {
            alert('Por favor, selecione uma categoria');
            return;
        }
        if (!fornecedorId) {
            alert('Por favor, selecione um fornecedor');
            return;
        }

        const produto = {
            nome: nome,
            descricao: descricao,
            quantidade: parseInt(quantidade),
            preco: parseFloat(preco),
            categoriaId: parseInt(categoriaId),
            fornecedorId: parseInt(fornecedorId)
        };

        const resultado = await postData('produto', produto);
        if (resultado) {
            alert('Produto adicionado com sucesso!');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        alert('Erro ao adicionar produto');
    }
}

async function excluirProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        const sucesso = await deleteData('produto', id);
        if (sucesso) carregarProdutos('produto');
    }
}

function limparFormulario() {
    const form = document.getElementById('produtoForm');
    if (form) {
        form.reset();
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Adicionar Produto';
        }
    }
}

async function verificarEdicao() {
    const produtoId = localStorage.getItem('editandoProdutoId');
    if (produtoId) {
        try {
            const produto = await fetchData(`produto/${produtoId}`);
            if (produto) {
                const nomeInput = document.getElementById('nomeProduto');
                const descricaoInput = document.getElementById('descricaoProduto');
                const precoInput = document.getElementById('precoProduto');
                const categoriaSelect = document.getElementById('categoriaProduto');
                const fornecedorSelect = document.getElementById('fornecedorProduto');
                const submitButton = document.querySelector('#produtoForm button[type="submit"]');
                const quantidadeInput = document.getElementById('quantidadeProduto');

                if (nomeInput) nomeInput.value = produto.nome;
                if (descricaoInput) descricaoInput.value = produto.descricao;
                if (precoInput) precoInput.value = produto.preco;
                if (categoriaSelect) categoriaSelect.value = produto.categoriaId;
                if (fornecedorSelect) fornecedorSelect.value = produto.fornecedorId;
                if (quantidadeInput) quantidadeInput.value = produto.quantidade;
                if (submitButton) submitButton.textContent = 'Atualizar Produto';
            }
        } catch (error) {
            console.error('Erro ao carregar produto:', error);
            alert('Erro ao carregar dados do produto');
        }
    }
    
    limparFormulario();
    const submitButton = document.querySelector('#produtoForm button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = 'Adicionar Produto';
    }
}

async function atualizarProduto(event) {
    event.preventDefault();
    
    try {
        const produtoId = localStorage.getItem('editandoProdutoId');
        if (!produtoId) {
            alert('ID do produto não encontrado');
            return;
        }

        const nome = document.getElementById('nomeProduto')?.value.trim();
        const descricao = document.getElementById('descricaoProduto')?.value.trim();
        const preco = document.getElementById('precoProduto')?.value;
        const categoriaId = document.getElementById('categoriaProduto')?.value;
        const fornecedorId = document.getElementById('fornecedorProduto')?.value;
        const quantidade = document.getElementById('quantidadeProduto')?.value;

        if (!nome) {
            alert('Por favor, preencha o nome do produto');
            return;
        }
        if (!descricao) {
            alert('Por favor, preencha a descrição do produto');
            return;
        }
        if (!preco || preco <= 0) {
            alert('Por favor, insira um preço válido maior que zero');
            return;
        }
        if (!categoriaId) {
            alert('Por favor, selecione uma categoria');
            return;
        }
        if (!fornecedorId) {
            alert('Por favor, selecione um fornecedor');
            return;
        }

        const produto = {
            nome: nome,
            descricao: descricao,
            quantidade: parseInt(quantidade),
            preco: parseFloat(preco),
            categoriaId: parseInt(categoriaId),
            fornecedorId: parseInt(fornecedorId)
        };

        const resultado = await fetch(`${API_URL}/produto/${produtoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produto)
        });

        if (!resultado) {
            throw new Error('Erro ao atualizar produto');
        }

        alert('Produto atualizado com sucesso!');
        localStorage.removeItem('editandoProdutoId');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        alert('Erro ao atualizar produto');
    }
}

async function carregarCategorias() {
    try {
        const categorias = await fetchData('categoria');
        const tbody = document.querySelector('#categoriasTable tbody');
        const select = document.getElementById('categoriaProduto');
        
        if (tbody) {
            tbody.innerHTML = '';
            categorias.sort((a, b) => b.id - a.id).forEach(categoria => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${categoria.id}</td>
                    <td>${categoria.nome}</td>
                    <td>${categoria.descricao}</td>
                    <td class="acoes">
                        <button class="btn-editar" data-id="${categoria.id}">Editar</button>
                        <button class="btn-excluir" data-id="${categoria.id}">Excluir</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            tbody.querySelectorAll('.btn-editar').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    editarCategoria(id);
                });
            });

            tbody.querySelectorAll('.btn-excluir').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    excluirCategoria(id);
                });
            });
        }
        
        if (select) {
            select.innerHTML = '<option value="">Selecione uma categoria</option>';
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.textContent = categoria.nome;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

async function adicionarCategoria(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nomeCategoria').value.trim();
    const descricao = document.getElementById('descricaoCategoria').value.trim();

    if (!nome) {
        alert('Por favor, preencha o nome da categoria');
        return;
    }
    if (!descricao) {
        alert('Por favor, preencha a descrição da categoria');
        return;
    }

    const categoria = {
        nome: nome,
        descricao: descricao
    };

    try {
        const resultado = await postData('categoria', categoria);
        if (resultado) {
            alert('Categoria adicionada com sucesso!');
            document.getElementById('categoriaForm').reset();
            localStorage.setItem('ultimaSecao', 'categorias');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Erro ao adicionar categoria:', error);
        alert('Erro ao adicionar categoria. Por favor, tente novamente.');
    }
}

async function excluirCategoria(id) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        const sucesso = await deleteData('categoria', id);
        if (sucesso) carregarCategorias();
    }
}

function limparFormularioCategoria() {
    const form = document.getElementById('categoriaForm');
    if (form) {
        form.reset();
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Salvar Categoria';
        }
    }

    const produtosSection = document.getElementById('produtosRelacionados');
    if (produtosSection) {
        produtosSection.remove();
    }
    localStorage.removeItem('editandoCategoriaId');
}

async function limparFormularioAoCarregar() {
    if (window.location.pathname.includes('cadastro-categoria.html')) {
        limparFormularioCategoria();
    }

    else if (window.location.pathname.includes('cadastro-fornecedor.html')) {
        limparFormularioFornecedor();
    }

    else if (window.location.pathname.includes('cadastro.html')) {
        limparFormulario();
        localStorage.removeItem('editandoProdutoId');
        await carregarCategorias();
        await carregarFornecedores();
    }
}

function limparFormularioFornecedor() {
    const form = document.getElementById('fornecedorForm');
    if (form) {
        form.reset();
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Salvar Fornecedor';
        }
    }
    localStorage.removeItem('editandoFornecedorId');
}

async function verificarEdicaoCategoria() {
    const categoriaId = localStorage.getItem('editandoCategoriaId');
    if (categoriaId) {
        try {
            const categoria = await fetchData(`categoria/${categoriaId}`);
            if (categoria) {
                const nomeInput = document.getElementById('nomeCategoria');
                const descricaoInput = document.getElementById('descricaoCategoria');
                const submitButton = document.querySelector('#categoriaForm button[type="submit"]');

                if (nomeInput) nomeInput.value = categoria.nome;
                if (descricaoInput) descricaoInput.value = categoria.descricao;
                if (submitButton) submitButton.textContent = 'Atualizar Categoria';

                const produtosSection = document.getElementById('produtosRelacionados');
                if (produtosSection) {
                    produtosSection.remove();
                }
            }
        } catch (error) {
            console.error('Erro ao carregar categoria:', error);
            alert('Erro ao carregar dados da categoria');
        }
    }
}

async function verificarEdicaoFornecedor() {
    const fornecedorId = localStorage.getItem('editandoFornecedorId');
    if (fornecedorId) {
        try {
            const fornecedor = await fetchData(`fornecedor/${fornecedorId}`);
            if (fornecedor) {
                const nomeInput = document.getElementById('nomeFornecedor');
                const cnpjInput = document.getElementById('cnpjFornecedor');
                const emailInput = document.getElementById('emailFornecedor');
                const contatoInput = document.getElementById('contatoFornecedor');
                const submitButton = document.querySelector('#fornecedorForm button[type="submit"]');

                if (nomeInput) nomeInput.value = fornecedor.nome;
                if (cnpjInput) cnpjInput.value = fornecedor.cnpj;
                if (emailInput) emailInput.value = fornecedor.email;
                if (contatoInput) contatoInput.value = fornecedor.contato;

                if (submitButton) {
                    submitButton.textContent = 'Atualizar Fornecedor';
                }

                const produtosSection = document.getElementById('produtosRelacionados');
                if (produtosSection) {
                    produtosSection.remove();
                }
            }
        } catch (error) {
            console.error('Erro ao carregar fornecedor para edição:', error);
            alert('Erro ao carregar dados do fornecedor para edição.');
        }
    } else {
        limparFormularioFornecedor();
    }
}

async function atualizarFornecedor(id) {
    try {
        const nome = document.getElementById('nomeFornecedor').value.trim();
        const cnpj = document.getElementById('cnpjFornecedor').value.trim();
        const email = document.getElementById('emailFornecedor').value.trim();
        const contato = document.getElementById('contatoFornecedor').value.trim();

        if (!nome) {
            alert('Por favor, preencha o nome do fornecedor');
            return;
        }
        if (!cnpj) {
            alert('Por favor, preencha o CNPJ do fornecedor');
            return;
        }
        if (!validarCNPJ(cnpj)) {
            alert('Por favor, preencha um CNPJ válido (14 dígitos)');
            return;
        }
        if (!email) {
            alert('Por favor, preencha o e-mail do fornecedor');
            return;
        }
        if (!validarEmail(email)) {
            alert('Por favor, preencha um e-mail válido');
            return;
        }
        if (!contato) {
            alert('Por favor, preencha o telefone do fornecedor');
            return;
        }
        if (!validarTelefone(contato)) {
            alert('Por favor, preencha um telefone válido (10 ou 11 dígitos)');
            return;
        }

        const fornecedor = {
            id: parseInt(id),
            nome: nome,
            cnpj: cnpj,
            email: email,
            contato: contato,
            telefone: contato,
            endereco: "Não informado",
            cidade: "Não informado",
            cep: "00000-000",
            estado: "SP"
        };

        console.log('Enviando dados para atualização:', fornecedor);
        const response = await fetch(`${API_URL}/fornecedor/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fornecedor)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na resposta ao atualizar fornecedor:', errorText);
            throw new Error(errorText || 'Erro ao atualizar fornecedor');
        }

        const fornecedorAtualizado = await response.json();
        console.log('Fornecedor atualizado com sucesso:', fornecedorAtualizado);

        alert('Fornecedor atualizado com sucesso!');

        localStorage.removeItem('editandoFornecedorId');
        localStorage.setItem('ultimaSecao', 'fornecedores');
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('Erro ao atualizar fornecedor:', error);
        alert(error.message || 'Erro ao atualizar fornecedor');
    }
}

function formatarCNPJ(cnpj) {
    let value = cnpj.replace(/\D/g, '');
    if (value.length > 14) {
        value = value.slice(0, 14);
    }
    if (value.length <= 14) {
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '. $1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    return value;
}

function formatarTelefone(telefone) {
    let value = telefone.replace(/\D/g, '');
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    }
    return value;
}

async function carregarFornecedores() {
    try {
        const fornecedores = await fetchData('fornecedor');
        const tbody = document.querySelector('#fornecedoresTable tbody');
        const select = document.getElementById('fornecedorProduto');
        
        if (tbody) {
            tbody.innerHTML = '';
            fornecedores.sort((a, b) => b.id - a.id).forEach(fornecedor => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${fornecedor.id}</td>
                    <td>${fornecedor.nome}</td>
                    <td>${formatarCNPJ(fornecedor.cnpj)}</td>
                    <td>${fornecedor.email}</td>
                    <td>${formatarTelefone(fornecedor.telefone)}</td>
                    <td class="acoes">
                        <button class="btn-editar" data-id="${fornecedor.id}">Editar</button>
                        <button class="btn-excluir" data-id="${fornecedor.id}">Excluir</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            tbody.querySelectorAll('.btn-editar').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    editarFornecedor(id);
                });
            });

            tbody.querySelectorAll('.btn-excluir').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    excluirFornecedor(id);
                });
            });
        }
        
        if (select) {
            select.innerHTML = '<option value="">Selecione um fornecedor</option>';
            fornecedores.forEach(fornecedor => {
                const option = document.createElement('option');
                option.value = fornecedor.id;
                option.textContent = fornecedor.nome;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
    }
}


function aplicarMascaraCNPJ(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 14) {
        value = value.slice(0, 14);
    }
    if (value.length <= 14) {
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    input.value = value;
}

function aplicarMascaraTelefone(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    }
    input.value = value;
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]/g, '');
    if (cnpj.length !== 14) {
        return false;
    }
    return true;
}

function validarTelefone(telefone) {
    telefone = telefone.replace(/[^\d]/g, '');
    if (telefone.length < 10 || telefone.length > 11) {
        return false;
    }
    return true;
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

async function adicionarFornecedor(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nomeFornecedor').value.trim();
    const cnpj = document.getElementById('cnpjFornecedor').value.trim();
    const email = document.getElementById('emailFornecedor').value.trim();
    const contato = document.getElementById('contatoFornecedor').value.trim();

    if (!nome) {
        alert('Por favor, preencha o nome do fornecedor');
        return;
    }
    if (!cnpj) {
        alert('Por favor, preencha o CNPJ do fornecedor');
        return;
    }
    if (!validarCNPJ(cnpj)) {
        alert('Por favor, preencha um CNPJ válido (14 dígitos)');
        return;
    }
    if (!email) {
        alert('Por favor, preencha o e-mail do fornecedor');
        return;
    }
    if (!validarEmail(email)) {
        alert('Por favor, preencha um e-mail válido');
        return;
    }
    if (!contato) {
        alert('Por favor, preencha o telefone do fornecedor');
        return;
    }
    if (!validarTelefone(contato)) {
        alert('Por favor, preencha um telefone válido (10 ou 11 dígitos)');
        return;
    }

    const fornecedor = {
        nome: nome,
        cnpj: cnpj,
        email: email,
        contato: contato,
        telefone: contato,
        endereco: "Não informado",
        cidade: "Não informado",
        cep: "00000-000",
        estado: "SP"
    };

    try {
        const resultado = await postData('fornecedor', fornecedor);
        if (resultado) {
            alert('Fornecedor adicionado com sucesso!');
            document.getElementById('fornecedorForm').reset();
            localStorage.setItem('ultimaSecao', 'fornecedores');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Erro ao adicionar fornecedor:', error);
        alert('Erro ao adicionar fornecedor. Por favor, tente novamente.');
    }
}

async function excluirFornecedor(id) {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
        const sucesso = await deleteData('fornecedor', id);
        if (sucesso) carregarFornecedores();
    }
}

function filtrarProdutos(termo) {
    const tbody = document.querySelector('#produtosTable tbody');
    const linhas = tbody.getElementsByTagName('tr');
    termo = termo.toLowerCase();

    for (let linha of linhas) {
        const texto = linha.textContent.toLowerCase();
        linha.style.display = texto.includes(termo) ? '' : 'none';
    }
}

function filtrarCategorias(termo) {
    const tbody = document.querySelector('#categoriasTable tbody');
    const linhas = tbody.getElementsByTagName('tr');
    termo = termo.toLowerCase();

    for (let linha of linhas) {
        const texto = linha.textContent.toLowerCase();
        linha.style.display = texto.includes(termo) ? '' : 'none';
    }
}

function filtrarFornecedores(termo) {
    const tbody = document.querySelector('#fornecedoresTable tbody');
    const linhas = tbody.getElementsByTagName('tr');
    termo = termo.toLowerCase();

    for (let linha of linhas) {
        const texto = linha.textContent.toLowerCase();
        linha.style.display = texto.includes(termo) ? '' : 'none';
    }
}

async function carregarMovimentacoes() {
    try {
        const movimentacoes = await fetchData('movimentacao');
        const tbody = document.querySelector('#movimentacoesTable tbody');
        
        if (tbody) {
            tbody.innerHTML = '';
            movimentacoes.sort((a, b) => b.id - a.id).forEach(movimentacao => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${movimentacao.id}</td>
                    <td>${new Date(movimentacao.data).toLocaleString()}</td>
                    <td>${movimentacao.produto?.nome || ''}</td>
                    <td>${movimentacao.tipo}</td>
                    <td>${movimentacao.quantidade}</td>
                    <td>${movimentacao.observacao || ''}</td>
                    <td class="acoes">
                        <button class="btn-editar" data-id="${movimentacao.id}">Editar</button>
                        <button class="btn-excluir" data-id="${movimentacao.id}">Excluir</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            tbody.querySelectorAll('.btn-editar').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    editarMovimentacao(id);
                });
            });

            tbody.querySelectorAll('.btn-excluir').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    excluirMovimentacao(id);
                });
            });
        }
    } catch (error) {
        console.error('Erro ao carregar movimentações:', error);
    }
}

async function adicionarMovimentacao(event) {
    event.preventDefault();
    
    try {
        const produtoId = document.getElementById('produtoMovimentacao').value;
        const tipo = document.getElementById('tipoMovimentacao').value;
        const quantidade = document.getElementById('quantidadeMovimentacao').value;
        const observacao = document.getElementById('observacaoMovimentacao').value.trim();

        if (!produtoId) {
            alert('Por favor, selecione um produto');
            return;
        }
        if (!tipo) {
            alert('Por favor, selecione o tipo de movimentação');
            return;
        }
        if (!quantidade || quantidade <= 0) {
            alert('Por favor, insira uma quantidade válida maior que zero');
            return;
        }

        const produto = await fetchData(`produto/${produtoId}`);
        if (!produto) {
            alert('Erro ao buscar dados do produto');
            return;
        }

        if (tipo === 'Saida' && produto.quantidade < parseInt(quantidade)) {
            alert('Quantidade insuficiente em estoque!');
            return;
        }

        const movimentacao = {
            produtoId: parseInt(produtoId),
            tipo: tipo,
            quantidade: parseInt(quantidade),
            observacao: observacao
        };

        const resultado = await postData('movimentacao', movimentacao);
        if (resultado) {
            const novaQuantidade = tipo === 'Entrada' 
                ? produto.quantidade + parseInt(quantidade)
                : produto.quantidade - parseInt(quantidade);

            const produtoAtualizado = {
                ...produto,
                quantidade: novaQuantidade
            };

            const response = await fetch(`${API_URL}/produto/${produtoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produtoAtualizado)
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar estoque do produto');
            }

            alert('Movimentação registrada com sucesso!');
            document.getElementById('movimentacaoForm').reset();
            localStorage.setItem('ultimaSecao', 'movimentacoes');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Erro ao adicionar movimentação:', error);
        alert('Erro ao adicionar movimentação. Por favor, tente novamente.');
    }
}

async function excluirMovimentacao(id) {
    if (confirm('Tem certeza que deseja excluir esta movimentação?')) {
        try {
            const movimentacao = await fetchData(`movimentacao/${id}`);
            if (!movimentacao) {
                throw new Error('Movimentação não encontrada');
            }

            const produto = await fetchData(`produto/${movimentacao.produtoId}`);
            if (!produto) {
                throw new Error('Produto não encontrado');
            }

            let novaQuantidade = produto.quantidade;
            if (movimentacao.tipo === 'Entrada') {a
                novaQuantidade = produto.quantidade - movimentacao.quantidade;
            } else if (movimentacao.tipo === 'Saida') {
                novaQuantidade = produto.quantidade + movimentacao.quantidade;
            }

            if (novaQuantidade < 0) {
                alert('Não é possível excluir esta movimentação pois o estoque ficaria negativo!');
                return;
            }

            const sucesso = await deleteData('movimentacao', id);
            if (!sucesso) {
                throw new Error('Erro ao excluir movimentação');
            }

            const produtoAtualizado = {
                ...produto,
                quantidade: novaQuantidade
            };

            const responseProduto = await fetch(`${API_URL}/produto/${movimentacao.produtoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produtoAtualizado)
            });

            if (!responseProduto.ok) {
                throw new Error('Erro ao atualizar estoque do produto');
            }

            alert('Movimentação excluída com sucesso!');
            carregarMovimentacoes();
            carregarProdutos('produto'); 
        } catch (error) {
            console.error('Erro ao excluir movimentação:', error);
            alert('Erro ao excluir movimentação. Por favor, tente novamente.');
        }
    }
}

function limparFormularioMovimentacao() {
    const form = document.getElementById('movimentacaoForm');
    if (form) {
        form.reset();
    }
}

function filtrarMovimentacoes(termo) {
    const tbody = document.querySelector('#movimentacoesTable tbody');
    const linhas = tbody.getElementsByTagName('tr');
    termo = termo.toLowerCase();

    for (let linha of linhas) {
        const texto = linha.textContent.toLowerCase();
        linha.style.display = texto.includes(termo) ? '' : 'none';
    }
}

async function carregarVendas() {
    try {
        const vendas = await fetchData('venda');
        const tbody = document.querySelector('#vendasTable tbody');
        
        if (tbody) {
            tbody.innerHTML = '';
            vendas.sort((a, b) => new Date(b.data) - new Date(a.data));

            for (const venda of vendas) {
                const produto = await fetchData(`produto/${venda.produtoId}`);

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${venda.id}</td>
                    <td>${new Date(venda.data).toLocaleString()}</td>
                    <td>${produto ? produto.nome : 'Produto não encontrado'}</td>
                    <td>${venda.quantidade}</td>
                    <td>R$ ${venda.precoUnitario.toFixed(2)}</td>
                    <td>R$ ${venda.total.toFixed(2)}</td>
                    <td>${venda.observacao || ''}</td>
                    <td class="acoes">
                        <button class="btn-editar" data-id="${venda.id}">Editar</button>
                        <button class="btn-excluir" data-id="${venda.id}">Excluir</button>
                    </td>
                `;
                tbody.appendChild(tr);
            }

            tbody.querySelectorAll('.btn-editar').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    editarVenda(id);
                });
            });

            tbody.querySelectorAll('.btn-excluir').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    excluirVenda(id);
                });
            });
        }
    } catch (error) {
        console.error('Erro ao carregar vendas:', error);
    }
}

async function adicionarVenda(event) {
    event.preventDefault();
    try {
        const produtoId = document.getElementById('produtoVenda').value;
        const quantidade = document.getElementById('quantidadeVenda').value;
        const observacao = document.getElementById('observacaoVenda').value.trim();
        if (!produtoId) {
            alert('Por favor, selecione um produto');
            return;
        }
        if (!quantidade || quantidade <= 0) {
            alert('Por favor, insira uma quantidade válida maior que zero');
            return;
        }

        const produto = await fetchData(`produto/${produtoId}`);
        if (!produto) {
            alert('Erro ao buscar dados do produto');
            return;
        }

        if (produto.quantidade < parseInt(quantidade)) {
             alert('Quantidade insuficiente em estoque!');
             return;
        }

        const venda = {
            produtoId: parseInt(produtoId),
            quantidade: parseInt(quantidade),
            precoUnitario: produto.preco,
            total: produto.preco * parseInt(quantidade),
            observacao: observacao
        };
        
        const resultado = await postData('venda', venda);
        if (resultado) {
            const novaQuantidade = produto.quantidade - parseInt(quantidade);
            const produtoAtualizado = {
                ...produto,
                quantidade: novaQuantidade
            };

            const responseProduto = await fetch(`${API_URL}/produto/${produtoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produtoAtualizado)
            });

            if (!responseProduto.ok) {
                 console.error('Erro ao atualizar estoque do produto após venda');
                 alert('Venda registrada, mas houve um erro ao atualizar o estoque.');
            } else {
                 alert('Venda registrada com sucesso!');
            }

            const form = document.getElementById('vendaForm');
            if (form) form.reset();
            localStorage.setItem('ultimaSecao', 'vendas');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Erro ao registrar venda:', error);
        alert('Erro ao registrar venda');
    }
}

async function excluirVenda(id) {
    if (confirm('Tem certeza que deseja excluir esta venda?')) {
        try {
            const sucesso = await deleteData('venda', id);
            
            if (!sucesso) {
                throw new Error('Erro ao excluir venda');
            }

            alert('Venda excluída com sucesso!');
            carregarVendas(); 
            carregarProdutos('produto'); 

        } catch (error) {
            console.error('Erro ao excluir venda:', error);
            alert(error.message || 'Erro ao excluir venda. Por favor, tente novamente.');
        }
    }
}

function limparFormularioVenda() {
    const form = document.getElementById('vendaForm');
    if (form) {
        form.reset();
        const precoUnitarioInput = document.getElementById('precoUnitario');
        const precoTotalInput = document.getElementById('precoTotal');
        if (precoUnitarioInput) precoUnitarioInput.value = '';
        if (precoTotalInput) precoTotalInput.value = '';
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Salvar Venda';
        }
    }
}

function filtrarVendas(termo) {
    const linhas = document.querySelectorAll('#vendasTable tbody tr');
    linhas.forEach(linha => {
        const texto = linha.textContent.toLowerCase();
        linha.style.display = texto.includes(termo.toLowerCase()) ? '' : 'none';
    });
}

async function verificarEdicaoVenda() {
    const vendaId = localStorage.getItem('editandoVendaId');
    if (vendaId) {
        try {
            const venda = await fetchData(`venda/${vendaId}`);
            if (venda) {
                const produtoSelect = document.getElementById('produtoVenda');
                const quantidadeInput = document.getElementById('quantidadeVenda');
                const observacaoInput = document.getElementById('observacaoVenda');
                const precoUnitarioInput = document.getElementById('precoUnitario');
                const precoTotalInput = document.getElementById('precoTotal');
                const submitButton = document.querySelector('#vendaForm button[type="submit"]');

                if (produtoSelect) produtoSelect.value = venda.produtoId;
                if (quantidadeInput) quantidadeInput.value = venda.quantidade;
                if (observacaoInput) observacaoInput.value = venda.observacao || '';
                if (precoUnitarioInput) precoUnitarioInput.value = `R$ ${venda.precoUnitario.toFixed(2)}`;
                if (precoTotalInput) precoTotalInput.value = `R$ ${venda.total.toFixed(2)}`;
                if (submitButton) submitButton.textContent = 'Atualizar Venda';
                localStorage.setItem('vendaOriginal', JSON.stringify(venda));
            }
        } catch (error) {
            console.error('Erro ao carregar venda:', error);
            alert('Erro ao carregar dados da venda');
        }
    } else {
        limparFormularioVenda();
        const submitButton = document.querySelector('#vendaForm button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Salvar Venda';
        }
    }
}

async function atualizarVenda(id) {
    try {
        const produtoId = document.getElementById('produtoVenda').value;
        const quantidade = document.getElementById('quantidadeVenda').value;
        const observacao = document.getElementById('observacaoVenda').value.trim();
        if (!produtoId) {
            alert('Por favor, selecione um produto');
            return;
        }
        if (!quantidade || quantidade <= 0) {
            alert('Por favor, insira uma quantidade válida maior que zero');
            return;
        }

        const vendaOriginal = JSON.parse(localStorage.getItem('vendaOriginal'));
        const produto = await fetchData(`produto/${produtoId}`);
        if (!produto) {
             alert('Erro ao buscar dados do produto');
             return;
        }

        let diferencaQuantidade = 0;
        let produtoOriginal = null;

        if (vendaOriginal.produtoId === parseInt(produtoId)) {
            diferencaQuantidade = parseInt(quantidade) - vendaOriginal.quantidade;
            if (diferencaQuantidade > 0 && produto.quantidade < diferencaQuantidade) {
                 alert('Quantidade insuficiente em estoque para atualizar a venda!');
                 return;
             }
        } else {
            produtoOriginal = await fetchData(`produto/${vendaOriginal.produtoId}`);
            if (!produtoOriginal) {
                alert('Erro ao buscar dados do produto original');
                return;
            }

            if (produto.quantidade < parseInt(quantidade)) {
                 alert('Quantidade insuficiente em estoque para o novo produto!');
                 return;
             }
        }

        const venda = {
            id: parseInt(id),
            produtoId: parseInt(produtoId),
            quantidade: parseInt(quantidade),
            precoUnitario: produto.preco,
            total: produto.preco * parseInt(quantidade),
            observacao: observacao,
            data: vendaOriginal.data
        };

        console.log('Enviando dados para atualização:', venda);
        const response = await fetch(`${API_URL}/venda/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(venda)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na resposta:', errorText);
            throw new Error(errorText || 'Erro ao atualizar venda');
        }

        const vendaAtualizada = await response.json();
        console.log('Venda atualizada com sucesso:', vendaAtualizada);
        const novaQuantidadeProdutoAtual = produto.quantidade - diferencaQuantidade;
        const produtoAtualizado = {
            ...produto,
            quantidade: novaQuantidadeProdutoAtual
        };

        const responseProdutoAtual = await fetch(`${API_URL}/produto/${produtoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produtoAtualizado)
        });

        if (!responseProdutoAtual.ok) {
            console.error('Erro ao atualizar estoque do produto atual após atualização da venda');
            alert('Venda atualizada, mas houve um erro ao atualizar o estoque do produto.');
        } else if (produtoOriginal) {
            const novaQuantidadeProdutoOriginal = produtoOriginal.quantidade + vendaOriginal.quantidade;
            const produtoOriginalAtualizado = {
                ...produtoOriginal,
                quantidade: novaQuantidadeProdutoOriginal
            };

            const responseProdutoOriginal = await fetch(`${API_URL}/produto/${vendaOriginal.produtoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produtoOriginalAtualizado)
            });

            if (!responseProdutoOriginal.ok) {
                console.error('Erro ao reverter estoque do produto original após atualização da venda');
            }
        }

        alert('Venda atualizada com sucesso!');
        
        const form = document.getElementById('vendaForm');
        if (form) {
            form.reset();
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.textContent = 'Salvar Venda';
            }
        }

        if (form) {
            form.onsubmit = null;
            form.addEventListener('submit', adicionarVenda);
        }
        
        localStorage.removeItem('editandoVendaId');
        localStorage.removeItem('vendaOriginal');
        localStorage.setItem('ultimaSecao', 'vendas');
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Erro ao atualizar venda:', error);
        alert(error.message || 'Erro ao atualizar venda. Por favor, tente novamente.');
    }
}

async function calcularPrecoTotal() {
    const produtoSelect = document.getElementById('produtoVenda');
    const quantidade = document.getElementById('quantidadeVenda').value;
    const precoUnitarioInput = document.getElementById('precoUnitario');
    const precoTotalInput = document.getElementById('precoTotal');

    if (produtoSelect && produtoSelect.value && quantidade) {
        const selectedOption = produtoSelect.options[produtoSelect.selectedIndex];
        const precoUnitario = parseFloat(selectedOption.dataset.preco);
        const precoTotal = precoUnitario * parseInt(quantidade);
        
        precoUnitarioInput.value = `R$ ${precoUnitario.toFixed(2)}`;
        precoTotalInput.value = `R$ ${precoTotal.toFixed(2)}`;
    } else {
        precoUnitarioInput.value = '';
        precoTotalInput.value = '';
    }
}

async function carregarDadosProduto() {
    const produtoId = localStorage.getItem('editandoProdutoId');
    if (!produtoId) {
        alert('ID do produto não encontrado');
        window.location.href = 'index.html';
        return;
    }

    try {
        await carregarCategorias();
        await carregarFornecedores();
        const produto = await fetchData(`produto/${produtoId}`);
        if (produto) {
            const nomeInput = document.getElementById('nomeProduto');
            const descricaoInput = document.getElementById('descricaoProduto');
            const precoInput = document.getElementById('precoProduto');
            const categoriaSelect = document.getElementById('categoriaProduto');
            const fornecedorSelect = document.getElementById('fornecedorProduto');
            const quantidadeInput = document.getElementById('quantidadeProduto');

            if (nomeInput) nomeInput.value = produto.nome;
            if (descricaoInput) descricaoInput.value = produto.descricao;
            if (precoInput) precoInput.value = produto.preco;
            if (categoriaSelect) categoriaSelect.value = produto.categoriaId;
            if (fornecedorSelect) fornecedorSelect.value = produto.fornecedorId;
            if (quantidadeInput) quantidadeInput.value = produto.quantidade;
        }
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        alert('Erro ao carregar dados do produto');
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await limparFormularioAoCarregar();

    const contatoInput = document.getElementById('contatoFornecedor');
    if (contatoInput) {
        contatoInput.addEventListener('input', function() {
            aplicarMascaraTelefone(this);
        });
    }

    const cnpjInput = document.getElementById('cnpjFornecedor');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', function() {
            aplicarMascaraCNPJ(this);
        });
    }

    const produtosTable = document.getElementById('produtosTable');
    if (produtosTable) {
        carregarProdutos('produto');
        carregarCategorias();
        carregarFornecedores();

        const ultimaSecao = localStorage.getItem('ultimaSecao');
        if (ultimaSecao) {
            showSection(ultimaSecao);
            localStorage.removeItem('ultimaSecao');
        }
    }

    const produtoForm = document.getElementById('produtoForm');
    if (produtoForm) {
        if (window.location.pathname.includes('editar-produto.html')) {
            produtoForm.addEventListener('submit', atualizarProduto);
            carregarDadosProduto();
        } else {
            produtoForm.addEventListener('submit', adicionarProduto);
        }
    }

    const categoriaForm = document.getElementById('categoriaForm');
    if (categoriaForm) {
        if (window.location.pathname.includes('editar-categoria.html')) {
            verificarEdicaoCategoria();
        }
        
        categoriaForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const categoriaId = localStorage.getItem('editandoCategoriaId');
            if (categoriaId) {
                await atualizarCategoria(categoriaId);
                localStorage.removeItem('editandoCategoriaId');
                window.location.href = 'index.html';
            } else {
                await adicionarCategoria(event);
                window.location.href = 'index.html';
            }
        });
    }

    const fornecedorForm = document.getElementById('fornecedorForm');
    if (fornecedorForm) {
        if (window.location.pathname.includes('editar-fornecedor.html')) {
            verificarEdicaoFornecedor();
        }
        
        fornecedorForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const fornecedorId = localStorage.getItem('editandoFornecedorId');
            if (fornecedorId) {
                await atualizarFornecedor(fornecedorId);
            } else {
                await adicionarFornecedor(event);
            }
            localStorage.removeItem('editandoFornecedorId');
            localStorage.setItem('ultimaSecao', 'fornecedores');
            window.location.href = 'index.html';
        });
    }

    const pesquisaProduto = document.getElementById('pesquisaProduto');
    if (pesquisaProduto) {
        pesquisaProduto.addEventListener('input', (e) => {
            filtrarProdutos(e.target.value);
        });
    }

    const pesquisaCategoria = document.getElementById('pesquisaCategoria');
    if (pesquisaCategoria) {
        pesquisaCategoria.addEventListener('input', (e) => {
            filtrarCategorias(e.target.value);
        });
    }

    const pesquisaFornecedor = document.getElementById('pesquisaFornecedor');
    if (pesquisaFornecedor) {
        pesquisaFornecedor.addEventListener('input', (e) => {
            filtrarFornecedores(e.target.value);
        });
    }

    const movimentacaoForm = document.getElementById('movimentacaoForm');
    if (movimentacaoForm) {
        carregarProdutos('produto');
        
        movimentacaoForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await adicionarMovimentacao(event);
        });
    }

    const pesquisaMovimentacao = document.getElementById('pesquisaMovimentacao');
    if (pesquisaMovimentacao) {
        pesquisaMovimentacao.addEventListener('input', (e) => {
            filtrarMovimentacoes(e.target.value);
        });
    }

    const movimentacoesTable = document.getElementById('movimentacoesTable');
    if (movimentacoesTable) {
        carregarMovimentacoes();
    }

    if (window.location.pathname.includes('editar-movimentacao.html')) {
        carregarProdutos();
        verificarEdicaoMovimentacao();
        
        const movimentacaoForm = document.getElementById('movimentacaoForm');
        if (movimentacaoForm) {
            movimentacaoForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const movimentacaoId = localStorage.getItem('editandoMovimentacaoId');
                if (movimentacaoId) {
                    await atualizarMovimentacao(movimentacaoId);
                }
            });
        }
    }

    const vendaForm = document.getElementById('vendaForm');
    if (vendaForm) {
        carregarProdutos('venda'); 
        const produtoSelect = document.getElementById('produtoVenda');
        const quantidadeInput = document.getElementById('quantidadeVenda');

        if (produtoSelect) {
            produtoSelect.addEventListener('change', calcularPrecoTotal);
        }
        if (quantidadeInput) {
            quantidadeInput.addEventListener('input', calcularPrecoTotal);
        }

        vendaForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const vendaId = localStorage.getItem('editandoVendaId');
            if (vendaId) {
                await atualizarVenda(vendaId);
            } else {
                await adicionarVenda(event);
            }
        });
    }

    const pesquisaVenda = document.getElementById('pesquisaVenda');
    if (pesquisaVenda) {
        pesquisaVenda.addEventListener('input', (e) => {
            filtrarVendas(e.target.value);
        });
    }
    
    const vendasTable = document.getElementById('vendasTable');
    if (vendasTable) {
        carregarVendas();
    }


    if (window.location.pathname.includes('editar-venda.html')) {
        carregarProdutos('venda'); 
        verificarEdicaoVenda();
        const vendaForm = document.getElementById('vendaForm');
        if (vendaForm) {
            vendaForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const vendaId = localStorage.getItem('editandoVendaId');
                if (vendaId) {
                    await atualizarVenda(vendaId);
                }
            });
        }
    }
});

async function atualizarCategoria(id) {
    try {
        const nome = document.getElementById('nomeCategoria').value.trim();
        const descricao = document.getElementById('descricaoCategoria').value.trim();

        if (!nome) {
            alert('Por favor, preencha o nome da categoria');
            return;
        }
        if (!descricao) {
            alert('Por favor, preencha a descrição da categoria');
            return;
        }

        const categoria = {
            id: parseInt(id),
            nome: nome,
            descricao: descricao
        };

        console.log('Enviando dados para atualização:', categoria);
        const response = await fetch(`${API_URL}/categoria/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoria)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na resposta:', errorText);
            throw new Error(errorText || 'Erro ao atualizar categoria');
        }

        const categoriaAtualizada = await response.json();
        console.log('Categoria atualizada com sucesso:', categoriaAtualizada);

        alert('Categoria atualizada com sucesso!');
        
        localStorage.removeItem('editandoCategoriaId');
        localStorage.setItem('ultimaSecao', 'categorias');
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('Erro ao atualizar categoria:', error);
        alert(error.message || 'Erro ao atualizar categoria');
    }
}

async function verificarEdicaoMovimentacao() {
    const movimentacaoId = localStorage.getItem('editandoMovimentacaoId');
    if (movimentacaoId) {
        try {
            const movimentacao = await fetchData(`movimentacao/${movimentacaoId}`);
            if (movimentacao) {
                const produtoSelect = document.getElementById('produtoMovimentacao');
                const tipoSelect = document.getElementById('tipoMovimentacao');
                const quantidadeInput = document.getElementById('quantidadeMovimentacao');
                const observacaoInput = document.getElementById('observacaoMovimentacao');

                if (produtoSelect) produtoSelect.value = movimentacao.produtoId;
                if (tipoSelect) tipoSelect.value = movimentacao.tipo;
                if (quantidadeInput) quantidadeInput.value = movimentacao.quantidade;
                if (observacaoInput) observacaoInput.value = movimentacao.observacao || '';

                localStorage.setItem('movimentacaoOriginal', JSON.stringify(movimentacao));
            }
        } catch (error) {
            console.error('Erro ao carregar movimentação:', error);
            alert('Erro ao carregar dados da movimentação');
        }
    }
}

async function atualizarMovimentacao(id) {
    try {
        const produtoId = document.getElementById('produtoMovimentacao').value;
        const tipo = document.getElementById('tipoMovimentacao').value;
        const observacao = document.getElementById('observacaoMovimentacao').value.trim();

        if (!produtoId) {
            alert('Por favor, selecione um produto');
            return;
        }
        if (!tipo) {
            alert('Por favor, selecione o tipo de movimentação');
            return;
        }

        const movimentacaoOriginal = JSON.parse(localStorage.getItem('movimentacaoOriginal'));
        
        const movimentacao = {
            id: parseInt(id),
            produtoId: parseInt(produtoId),
            tipo: tipo,
            quantidade: movimentacaoOriginal.quantidade, 
            observacao: observacao,
            data: movimentacaoOriginal.data
        };

        const response = await fetch(`${API_URL}/movimentacao/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movimentacao)
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar movimentação');
        }

        alert('Movimentação atualizada com sucesso!');
        localStorage.removeItem('editandoMovimentacaoId');
        localStorage.removeItem('movimentacaoOriginal');
        localStorage.setItem('ultimaSecao', 'movimentacoes');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro ao atualizar movimentação:', error);
        alert('Erro ao atualizar movimentação. Por favor, tente novamente.');
    }
} 