<script>
(function() {
    let messageCounter = 0;
    const colors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6'];
    const processedMessages = new Set();

    function assignColors() {
        // Buscar todos los mensajes
        const messages = document.querySelectorAll('div[id^="msg_"], .highlight-chat');
        
        messages.forEach((message) => {
            const nameElement = message.querySelector('.hl-name');
            
            if (nameElement && !processedMessages.has(message.id || message)) {
                // Remover clases de color anteriores
                colors.forEach(colorClass => {
                    nameElement.classList.remove(colorClass);
                });
                
                // Asignar nuevo color basado en el contador
                const colorIndex = messageCounter % 6;
                nameElement.classList.add(colors[colorIndex]);
                
                // Marcar como procesado
                processedMessages.add(message.id || message);
                messageCounter++;
            }
        });
        
        // Limpiar el set de mensajes procesados si se vuelve muy grande
        if (processedMessages.size > 100) {
            processedMessages.clear();
        }
    }

    // Observer para detectar nuevos mensajes
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.id && node.id.startsWith('msg_') || 
                            node.classList && node.classList.contains('highlight-chat')) {
                            shouldProcess = true;
                        }
                    }
                });
            }
        });
        
        if (shouldProcess) {
            setTimeout(assignColors, 100);
        }
    });

    // Función para inicializar
    function init() {
        // Asignar colores a mensajes existentes
        assignColors();
        
        // Observar cambios en el DOM
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('Sistema de colores dinámicos inicializado');
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Backup: verificar cada 5 segundos por si acaso
    setInterval(assignColors, 5000);
})();
</script>
