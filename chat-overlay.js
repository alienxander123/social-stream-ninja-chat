// Chat Color Cycle Script for Social Stream Ninja
// Aplica colores cíclicos a los mensajes del chat de forma confiable

(function() {
    'use strict';
    
    let messageCounter = 0;
    const colors = ['color-cycle-1', 'color-cycle-2', 'color-cycle-3', 'color-cycle-4', 'color-cycle-5', 'color-cycle-6'];
    
    // Función para aplicar color a un mensaje
    function applyColorToMessage(messageElement) {
        try {
            // Remover cualquier clase de color anterior
            colors.forEach(color => {
                if (messageElement.classList) {
                    messageElement.classList.remove(color);
                }
            });
            
            // Aplicar el color correspondiente al ciclo
            const colorIndex = messageCounter % 6;
            if (messageElement.classList) {
                messageElement.classList.add(colors[colorIndex]);
            }
            
            messageCounter++;
            
            // Debug log
            console.log(`Mensaje ${messageCounter}: aplicado ${colors[colorIndex]}`);
            
        } catch (error) {
            console.error('Error aplicando color:', error);
        }
    }
    
    // Función para procesar mensajes existentes
    function processExistingMessages() {
        try {
            const messageSelectors = [
                'div[id^="msg_"]',
                '.highlight-chat',
                '[data-id^="msg_"]',
                '.chatmessage'
            ];
            
            let allMessages = [];
            messageSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (!allMessages.includes(el)) {
                        allMessages.push(el);
                    }
                });
            });
            
            allMessages.forEach((msg, index) => {
                if (msg && !msg.hasAttribute('data-color-applied')) {
                    const colorIndex = index % 6;
                    colors.forEach(color => {
                        if (msg.classList) {
                            msg.classList.remove(color);
                        }
                    });
                    if (msg.classList) {
                        msg.classList.add(colors[colorIndex]);
                        msg.setAttribute('data-color-applied', 'true');
                    }
                }
            });
            
            messageCounter = allMessages.length;
            console.log(`Procesados ${allMessages.length} mensajes existentes`);
            
        } catch (error) {
            console.error('Error procesando mensajes existentes:', error);
        }
    }
    
    // Función para verificar si un nodo es un mensaje
    function isMessageNode(node) {
        if (!node || !node.nodeType || node.nodeType !== 1) return false;
        
        return (
            (node.id && node.id.startsWith('msg_')) ||
            node.classList.contains('highlight-chat') ||
            node.classList.contains('chatmessage') ||
            (node.getAttribute && node.getAttribute('data-id') && node.getAttribute('data-id').startsWith('msg_'))
        );
    }
    
    // Observer para detectar nuevos mensajes
    let observer;
    
    function createObserver() {
        try {
            observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1) { // Element node
                                // Verificar si el nodo es directamente un mensaje
                                if (isMessageNode(node) && !node.hasAttribute('data-color-applied')) {
                                    applyColorToMessage(node);
                                    node.setAttribute('data-color-applied', 'true');
                                }
                                
                                // Buscar mensajes dentro de nodos añadidos
                                if (node.querySelectorAll) {
                                    const messageSelectors = [
                                        'div[id^="msg_"]',
                                        '.highlight-chat',
                                        '[data-id^="msg_"]',
                                        '.chatmessage'
                                    ];
                                    
                                    messageSelectors.forEach(selector => {
                                        try {
                                            const childMessages = node.querySelectorAll(selector);
                                            childMessages.forEach(function(childMsg) {
                                                if (childMsg && !childMsg.hasAttribute('data-color-applied')) {
                                                    applyColorToMessage(childMsg);
                                                    childMsg.setAttribute('data-color-applied', 'true');
                                                }
                                            });
                                        } catch (selectorError) {
                                            console.warn('Error con selector:', selector, selectorError);
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            });
            
            return observer;
        } catch (error) {
            console.error('Error creando observer:', error);
            return null;
        }
    }
    
    // Función principal de inicialización
    function initColorCycle() {
        try {
            console.log('Iniciando sistema de colores cíclicos...');
            
            // Procesar mensajes existentes
            processExistingMessages();
            
            // Crear y configurar observer
            observer = createObserver();
            if (observer) {
                const targetNode = document.body || document.documentElement;
                observer.observe(targetNode, {
                    childList: true,
                    subtree: true
                });
                console.log('Observer configurado correctamente');
            } else {
                console.warn('No se pudo crear el observer');
            }
            
        } catch (error) {
            console.error('Error en inicialización:', error);
        }
    }
    
    // Sistema de respaldo que se ejecuta periódicamente
    function backupProcessor() {
        try {
            const messageSelectors = [
                'div[id^="msg_"]',
                '.highlight-chat',
                '[data-id^="msg_"]',
                '.chatmessage'
            ];
            
            let processedCount = 0;
            messageSelectors.forEach(selector => {
                try {
                    const messages = document.querySelectorAll(selector);
                    messages.forEach(function(msg, globalIndex) {
                        if (msg && !msg.hasAttribute('data-color-applied')) {
                            const colorIndex = globalIndex % 6;
                            colors.forEach(color => {
                                if (msg.classList) {
                                    msg.classList.remove(color);
                                }
                            });
                            if (msg.classList) {
                                msg.classList.add(colors[colorIndex]);
                                msg.setAttribute('data-color-applied', 'true');
                                processedCount++;
                            }
                        }
                    });
                } catch (selectorError) {
                    console.warn('Error en backup con selector:', selector, selectorError);
                }
            });
            
            if (processedCount > 0) {
                console.log(`Backup procesó ${processedCount} mensajes`);
            }
        } catch (error) {
            console.warn('Error en sistema de respaldo:', error);
        }
    }
    
    // Función para limpiar recursos
    function cleanup() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }
    
    // Inicializar cuando el documento esté listo
    function startWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initColorCycle);
        } else {
            // Si el documento ya está cargado, esperar un poco y luego inicializar
            setTimeout(initColorCycle, 100);
        }
    }
    
    // Inicializar el sistema
    startWhenReady();
    
    // Sistema de respaldo cada 10 segundos
    setInterval(backupProcessor, 10000);
    
    // Cleanup al cerrar la página
    window.addEventListener('beforeunload', cleanup);
    
    // Exponer funciones para debugging (opcional)
    window.chatColorCycle = {
        reinit: initColorCycle,
        backup: backupProcessor,
        counter: function() { return messageCounter; },
        cleanup: cleanup
    };
    
    console.log('Sistema de colores cíclicos cargado correctamente');
    
})();
