let currentBusinessId = null;
let deleteBusinessId = null;

// Detectar qual página está sendo usada
const currentPath = window.location.pathname;

// Inicialização baseada na página
document.addEventListener('DOMContentLoaded', function() {
    if (currentPath === '/cadastrar' || currentPath.includes('/cadastrar')) {
        initCadastrarPage();
    } else if (currentPath.includes('/empresa/')) {
        initDetailPage();
    }
});

// Página de Cadastro
function initCadastrarPage() {
    const form = document.getElementById('business-form');
    if (form) {
        form.addEventListener('submit', handleCreateSubmit);
    }
}

// Página de Detalhes
function initDetailPage() {
    const editForm = document.getElementById('edit-form');
    if (editForm) {
        editForm.addEventListener('submit', handleEditSubmit);
    }
}

// Criar nova empresa
async function handleCreateSubmit(e) {
    e.preventDefault();
    clearErrors();
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        observations: document.getElementById('observations').value.trim()
    };
    
    // Validação básica no frontend
    if (!formData.name) {
        showError('name-error', 'Nome é obrigatório');
        return;
    }
    
    if (!formData.email) {
        showError('email-error', 'Email é obrigatório');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showError('email-error', 'Email inválido');
        return;
    }
    
    if (!formData.phone) {
        showError('phone-error', 'Telefone é obrigatório');
        return;
    }
    
    try {
        const response = await fetch('/api/businesses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (data.error) {
                if (data.error.includes('Email')) {
                    showError('email-error', data.error);
                } else if (data.error.includes('Nome')) {
                    showError('name-error', data.error);
                } else if (data.error.includes('Telefone')) {
                    showError('phone-error', data.error);
                } else {
                    alert('Erro: ' + data.error);
                }
            } else {
                alert('Erro ao cadastrar empresa');
            }
            return;
        }
        
        // Sucesso - redirecionar para página de detalhes
        window.location.href = `/empresa/${data.id}`;
        
    } catch (error) {
        console.error('Erro ao cadastrar empresa:', error);
        alert('Erro ao cadastrar empresa. Tente novamente.');
    }
}

// Editar empresa (página de detalhes) - pega dados do data attribute
function editBusinessFromPage() {
    const card = document.querySelector('.business-detail-card');
    if (!card) return;
    
    const id = card.getAttribute('data-business-id');
    const name = card.getAttribute('data-business-name');
    const email = card.getAttribute('data-business-email');
    const phone = card.getAttribute('data-business-phone');
    const observations = card.getAttribute('data-business-observations') || '';
    
    if (!id || !name || !email || !phone) {
        alert('Erro ao carregar dados da empresa');
        return;
    }
    
    currentBusinessId = parseInt(id);
    
    document.getElementById('edit-business-id').value = id;
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-email').value = email;
    document.getElementById('edit-phone').value = phone;
    document.getElementById('edit-observations').value = observations;
    
    document.getElementById('edit-modal').classList.add('show');
}

// Fechar modal de edição
function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('show');
    clearErrors();
    currentBusinessId = null;
}

// Submeter edição
async function handleEditSubmit(e) {
    e.preventDefault();
    clearErrors();
    
    const id = document.getElementById('edit-business-id').value;
    if (!id) return;
    
    const formData = {
        name: document.getElementById('edit-name').value.trim(),
        email: document.getElementById('edit-email').value.trim(),
        phone: document.getElementById('edit-phone').value.trim(),
        observations: document.getElementById('edit-observations').value.trim()
    };
    
    // Validação básica
    if (!formData.name) {
        showError('edit-name-error', 'Nome é obrigatório');
        return;
    }
    
    if (!formData.email) {
        showError('edit-email-error', 'Email é obrigatório');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showError('edit-email-error', 'Email inválido');
        return;
    }
    
    if (!formData.phone) {
        showError('edit-phone-error', 'Telefone é obrigatório');
        return;
    }
    
    try {
        const response = await fetch(`/api/businesses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (data.error) {
                if (data.error.includes('Email')) {
                    showError('edit-email-error', data.error);
                } else if (data.error.includes('Nome')) {
                    showError('edit-name-error', data.error);
                } else if (data.error.includes('Telefone')) {
                    showError('edit-phone-error', data.error);
                } else {
                    alert('Erro: ' + data.error);
                }
            } else {
                alert('Erro ao atualizar empresa');
            }
            return;
        }
        
        // Sucesso - recarregar página
        window.location.reload();
        
    } catch (error) {
        console.error('Erro ao atualizar empresa:', error);
        alert('Erro ao atualizar empresa. Tente novamente.');
    }
}

// Abrir modal de exclusão
function openDeleteModal(id, name) {
    deleteBusinessId = id;
    document.getElementById('delete-business-name').textContent = name;
    document.getElementById('delete-modal').classList.add('show');
}

// Fechar modal de exclusão
function closeDeleteModal() {
    deleteBusinessId = null;
    document.getElementById('delete-modal').classList.remove('show');
}

// Confirmar exclusão
async function confirmDelete() {
    if (!deleteBusinessId) return;
    
    try {
        const response = await fetch(`/api/businesses/${deleteBusinessId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            alert('Erro ao excluir empresa');
            return;
        }
        
        // Redirecionar para lista de empresas
        window.location.href = '/empresas';
        
    } catch (error) {
        console.error('Erro ao excluir empresa:', error);
        alert('Erro ao excluir empresa. Tente novamente.');
    }
}

// Mostrar erro
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Limpar erros
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const editModal = document.getElementById('edit-modal');
    const deleteModal = document.getElementById('delete-modal');
    
    if (event.target === editModal) {
        closeEditModal();
    }
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
}
