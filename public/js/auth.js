// Função para mostrar popup de erro
function showErrorPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'error-popup';
    popup.innerHTML = `
        <div class="error-popup-content">
            <h4>Erro</h4>
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()">Fechar</button>
        </div>
    `;
    document.body.appendChild(popup);
}

// Verificar se há erro na URL
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const error_description = urlParams.get('error_description');
    
    if (error === 'user_exists') {
        showErrorPopup('Usuário já existente. Por favor, faça login.');
    } else if (error) {
        showErrorPopup(error_description || 'Ocorreu um erro durante a autenticação.');
    }
}); 