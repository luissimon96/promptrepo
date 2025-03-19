// Função para copiar o conteúdo do prompt
function copyPrompt(content) {
  navigator.clipboard.writeText(content).then(() => {
    alert('Prompt copiado para a área de transferência!');
  }).catch(err => {
    console.error('Erro ao copiar:', err);
    alert('Erro ao copiar o prompt');
  });
}

// Inicialização de tooltips do Bootstrap
document.addEventListener('DOMContentLoaded', function() {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}); 