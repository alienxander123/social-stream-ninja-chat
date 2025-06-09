// Solución definitiva para colores cíclicos en Social Stream Ninja
(function() {
    console.log('🎨 Iniciando sistema de colores mejorado para Social Stream Ninja');
    
    const colors = ['#6434e9', '#2c7ce5', '#49cc5c', '#f8c421', '#fb6640', '#f82553'];
    let messageCounter = 0;
    let processedMessages = new Set(); // Para evitar procesar el mismo mensaje dos veces
    
    // Función para generar un ID único del mensaje
    function getMessageId(element) {
        // Intentar usar el ID del mensaje si existe
        if (element.id) return element.id;
        
        // Crear ID basado en el contenido del nombre y parte del mensaje
        const nameElement = element.querySelector('.hl-name');
        const contentElement = element.querySelector('.hl-content');
        
        if (nameElement && contentElement) {
            const name = nameElement.textContent.trim();
            const content = contentElement.textContent.trim().substring(0, 20);
            const timestamp = Date.now();
            return `${name}-${content}-${timestamp}`.replace(/[^a-zA-Z0-9-]/g, '');
        }
        
        return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Función principal para aplicar colores
    function applyColorToMessage(messageElement) {
        const messageId = getMessageId(messageElement);
        
        // Evitar procesar el mismo mensaje dos veces
        if (processedMessages.has(messageId)) {
            return;
        }
        
        const nameElement = messageElement.querySelector('.hl-name');
        if (!nameElement) return;
        
        // Calcular índice del color
        const colorIndex = messageCounter % colors.length;
        const color = colors[colorIndex];
        
        // Aplicar el color con máxima fuerza
        nameElement.style.cssText = `
            background-color: ${color} !important;
            color: white !important;
            font-weight: bold !important;
            padding: 6px 12px !important;
            border-radius: 12px !important;
            border: 2px solid black !important;
            display: inline-block !important;
            position: relative !important;
            z-index: 2 !important;
            margin-bottom: -10px !important;
            margin-left: 0 !important;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.35) !important;
        `;
        
        // Marcar como procesado
        processedMessages.add(messageId);
        nameElement.setAttribute('data-color-applied', colorIndex.toString());
        nameElement.setAttribute('data-message-id', messageId);
        
        messageCounter++;
        
        console.log(`✅ Color aplicado: ${color} (mensaje #${messageCounter}, ID: ${messageId})`);
    }
    
    // Función para procesar todos los mensajes visibles
    function processAllMessages() {
        // Buscar diferentes tipos de contenedores de mensajes
        const selectors = [
            '[id^="msg_"]', // Mensajes con ID que empiece con "msg_"
            '.highlight-chat', // Contenedor de chat resaltado
            '.message-container', // Contenedor genérico de mensajes
            '[data-chatname]' // Elementos con atributo data-chatname
        ];
        
        let totalProcessed = 0;
        
        selectors.forEach(selector => {
            const messages = document.querySelectorAll(selector);
            messages.forEach(messageElement => {
                if (messageElement.querySelector('.hl-name')) {
                    applyColorToMessage(messageElement);
                    totalProcessed++;
                }
            });
        });
        
        // Si no encontramos mensajes con los selectores estándar, buscar directamente elementos .hl-name
        if (totalProcessed === 0) {
            const nameElements = document.querySelectorAll('.hl-name');
            nameElements.forEach((nameElement, index) => {
                if (!nameElement.hasAttribute('data-color-applied')) {
                    const colorIndex = index % colors.length;
                    const color = colors[colorIndex];
                    
                    nameElement.style.cssText = `
                        background-color: ${color} !important;
                        color: white !important;
                        font-weight: bold !important;
                        padding: 6px 12px !important;
                        border-radius: 12px !important;
                        border: 2px solid black !important;
                        display: inline-block !important;
                        position: relative !important;
                        z-index: 2 !important;
                        margin-bottom: -10px !important;
                        margin-left: 0 !important;
                        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.35) !important;
                    `;
                    
                    nameElement.setAttribute('data-color-applied', colorIndex.toString());
                    totalProcessed++;
                }
            });
            
            messageCounter = Math.max(messageCounter, nameElements.length);
        }
        
        if (totalProcessed > 0) {
            console.log(`🔄 Procesados ${totalProcessed} mensajes nuevos`);
        }
    }
    
    // Observer para detectar nuevos mensajes
    const observer = new MutationObserver(function(mutations) {
        let hasNewMessages = false;
        
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // Verificar si el nodo contiene elementos .hl-name
                    if (node.classList && node.classList.contains('hl-name')) {
                        hasNewMessages = true;
                    } else if (node.querySelector && node.querySelector('.hl-name')) {
                        hasNewMessages = true;
                    }
                }
            });
        });
        
        if (hasNewMessages) {
            // Pequeño delay para asegurar renderizado completo
            setTimeout(processAllMessages, 50);
        }
    });
    
    // Función de inicialización
    function initialize() {
        console.log('🚀 Inicializando sistema de colores...');
        
        // Procesar mensajes existentes
        processAllMessages();
        
        // Configurar observer
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👀 Observer configurado');
    }
    
    // Funciones de respaldo
    function backupProcessing() {
        const unprocessedNames = document.querySelectorAll('.hl-name:not([data-color-applied])');
        if (unprocessedNames.length > 0) {
            console.log(`🔧 Función de respaldo: ${unprocessedNames.length} elementos sin procesar`);
            processAllMessages();
        }
    }
    
    // Limpiar elementos procesados que ya no existen
    function cleanupProcessedSet() {
        const currentIds = new Set();
        document.querySelectorAll('.hl-name[data-message-id]').forEach(el => {
            currentIds.add(el.getAttribute('data-message-id'));
        });
        
        // Mantener solo los IDs que siguen existiendo en el DOM
        const newProcessedMessages = new Set();
        processedMessages.forEach(id => {
            if (currentIds.has(id)) {
                newProcessedMessages.add(id);
            }
        });
        
        const removedCount = processedMessages.size - newProcessedMessages.size;
        if (removedCount > 0) {
            console.log(`🧹 Limpieza: removidos ${removedCount} IDs obsoletos`);
        }
        
        processedMessages = newProcessedMessages;
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Configurar intervalos de respaldo
    setInterval(backupProcessing, 3000); // Cada 3 segundos
    setInterval(cleanupProcessedSet, 30000); // Limpieza cada 30 segundos
    
    // Función de debug global
    window.debugColors = function() {
        console.log('=== 🐛 DEBUG COLORES ===');
        console.log('Contador de mensajes:', messageCounter);
        console.log('Mensajes procesados:', processedMessages.size);
        console.log('Elementos .hl-name actuales:', document.querySelectorAll('.hl-name').length);
        console.log('Elementos sin color:', document.querySelectorAll('.hl-name:not([data-color-applied])').length);
        console.log('Colores disponibles:', colors);
        
        // Mostrar estado de cada elemento
        document.querySelectorAll('.hl-name').forEach((el, i) => {
            console.log(`Elemento ${i + 1}:`, {
                texto: el.textContent,
                color: el.style.backgroundColor,
                procesado: el.hasAttribute('data-color-applied'),
                messageId: el.getAttribute('data-message-id')
            });
        });
    };
    
    console.log('✨ Sistema de colores cargado completamente');
    
})();
