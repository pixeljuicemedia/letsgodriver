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
                // Call AI API
                const response = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'claude-sonnet-4-20250514',
                        max_tokens: 1000,
                        system: `You are a helpful assistant for MyDriver, a premium chauffeur service in Orange County and Los Angeles. 

Our services include:
- Airport Transfers: Reliable pickup/drop-off with flight tracking ($150-250 depending on distance)
- Executive Chauffeur: Professional service for business meetings ($100/hour minimum 3 hours)
- Event Transportation: Elegant transport for weddings and special occasions ($200-400)
- City Tours: Guided tours with experienced drivers ($120/hour)
- Long Distance Travel: Comfortable long-distance journeys (quoted per trip)
- Day Rental: Full-day driver service ($800 for 8 hours)

Our fleet consists of luxury vehicles (2022-2024 models), primarily Cadillac Escalades. We offer 24/7 service, are fully insured, and have 15+ years of experience.

Contact information:
- Phone: (555) 123-4567 (24/7)
- Email: info@mydriver.com
- Service area: Orange County and Los Angeles County

When users want to book:
1. Ask for: pickup location, destination, date/time, number of passengers, service type
2. Recommend appropriate service based on their needs
3. Provide price estimate if they ask
4. Direct them to complete booking at booking.html or call (555) 123-4567

Keep responses friendly, concise (2-3 short paragraphs max), and professional. Use emojis sparingly (1-2 max per message). Always be helpful and encourage bookings. If asked about topics outside your scope, politely redirect to your services.`,
                        messages: [
                            { role: 'user', content: message }
                        ]
                    })
                });

                const data = await response.json();
                removeTypingIndicator();
                
                // Extract text from response
                const botResponse = data.content
                    .filter(item => item.type === 'text')
                    .map(item => item.text)
                    .join('\n');

                addMessage(botResponse || "I apologize, I'm having trouble responding right now. Please try again or call us at (555) 123-4567.", 'bot');
                
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
