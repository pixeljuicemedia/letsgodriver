// Chat Widget JavaScript
(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChat);
    } else {
        initChat();
    }

    function initChat() {
        // Chat Widget Variables
        const chatButton = document.getElementById('chatButton');
        const chatContainer = document.getElementById('chatContainer');
        const chatClose = document.getElementById('chatClose');
        const chatMessages = document.getElementById('chatMessages');
        const chatInput = document.getElementById('chatInput');
        let isTyping = false;

        if (!chatButton || !chatContainer) return;

        // Toggle chat
        chatButton.addEventListener('click', function() {
            chatContainer.classList.toggle('active');
            if (chatContainer.classList.contains('active')) {
                chatInput.focus();
            }
        });

        chatClose.addEventListener('click', function() {
            chatContainer.classList.remove('active');
        });

        // Make functions global
        window.handleChatKeyPress = function(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        };

        window.sendQuickMessage = function(message) {
            chatInput.value = message;
            sendMessage();
        };

        window.sendMessage = async function() {
            const message = chatInput.value.trim();
            if (!message || isTyping) return;

            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';

            // Show typing indicator
            showTypingIndicator();
            isTyping = true;

            try {
                // Call YOUR backend API (not Anthropic directly)
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message
                    })
                });

                const data = await response.json();
                removeTypingIndicator();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to get response');
                }

                addMessage(data.response || "I apologize, I'm having trouble responding right now. Please try again or call us at (555) 123-4567.", 'bot');
                
            } catch (error) {
                console.error('Chat error:', error);
                removeTypingIndicator();
                addMessage("I apologize, I'm having trouble connecting right now. Please try again or contact us directly at (555) 123-4567 📞", 'bot');
            }

            isTyping = false;
        };

        // Add message to chat
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${sender}-message`;
            
            if (sender === 'bot') {
                messageDiv.innerHTML = `
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p>${formatMessage(text)}</p>
                    </div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="message-content">
                        <p>${formatMessage(text)}</p>
                    </div>
                `;
            }
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Format message (convert line breaks, links, etc.)
        function formatMessage(text) {
            return text
                .replace(/\n/g, '<br>')
                .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')
                .replace(/booking\.html/g, '<a href="booking.html">booking page</a>');
        }

        // Show typing indicator
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message bot-message typing-indicator';
            typingDiv.id = 'typingIndicator';
            typingDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Remove typing indicator
        function removeTypingIndicator() {
            const indicator = document.getElementById('typingIndicator');
            if (indicator) {
                indicator.remove();
            }
        }
    }
})();
