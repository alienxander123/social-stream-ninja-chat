<script>
(function() {
    let messageCounter = 0;
    const colors = ['color-cycle-1', 'color-cycle-2', 'color-cycle-3', 'color-cycle-4', 'color-cycle-5', 'color-cycle-6'];
    
    // Función para aplicar color a un mensaje
    function applyColorToMessage(messageElement) {
        // Remover cualquier clase de color anterior
        colors.forEach(color => messageElement.classList.remove(color));
        
        // Aplicar el color correspondiente al ciclo
        const colorIndex = messageCounter % 6;
        messageElement.classList.add(colors[colorIndex]);
        
        messageCounter++;
    }
    
    // Función para procesar mensajes existentes
    function processExistingMessages() {
        const messages = document.querySelectorAll('div[id^="msg_"], .highlight-chat');
        messages.forEach((msg, index) => {
            if (!msg.hasAttribute('data-color-applied')) {
                const colorIndex = index % 6;
                colors.forEach(color => msg.classList.remove(color));
                msg.classList.add(colors[colorIndex]);
                msg.setAttribute('data-color-applied', 'true');
            }
        });
        messageCounter = messages.length;
    }
    
    // Observer para detectar nuevos mensajes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // Buscar mensajes directos
                    if ((node.id && node.id.startsWith('msg_')) || node.classList.contains('highlight-chat')) {
                        if (!node.hasAttribute('data-color-applied')) {
                            applyColorToMessage(node);
                            node.setAttribute('data-color-applied', 'true');
                        }
                    }
                    
                    // Buscar mensajes dentro de nodos añadidos
                    const childMessages = node.querySelectorAll('div[id^="msg_"], .highlight-chat');
                    childMessages.forEach(function(childMsg) {
                        if (!childMsg.hasAttribute('data-color-applied')) {
                            applyColorToMessage(childMsg);
                            childMsg.setAttribute('data-color-applied', 'true');
                        }
                    });
                }
            });
        });
    });
    
    // Iniciar observación cuando el DOM esté listo
    function initColorCycle() {
        // Procesar mensajes existentes
        processExistingMessages();
        
        // Observar cambios en el contenedor del chat
        const chatContainer = document.body;
        observer.observe(chatContainer, {
            childList: true,
            subtree: true
        });
        
        console.log('Color cycle iniciado - Contador:', messageCounter);
    }
    
    // Inicializar cuando el documento esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initColorCycle);
    } else {
        initColorCycle();
    }
    
    // Re-procesar cada 5 segundos como backup
    setInterval(function() {
        const messages = document.querySelectorAll('div[id^="msg_"], .highlight-chat');
        messages.forEach(function(msg, index) {
            if (!msg.hasAttribute('data-color-applied')) {
                const colorIndex = index % 6;
                colors.forEach(color => msg.classList.remove(color));
                msg.classList.add(colors[colorIndex]);
                msg.setAttribute('data-color-applied', 'true');
            }
        });
    }, 5000);
})();
</script>
