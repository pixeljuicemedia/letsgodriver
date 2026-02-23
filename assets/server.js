const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from root

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Check for API key
        if (!process.env.ANTHROPIC_API_KEY) {
            return res.status(500).json({ 
                error: 'API key not configured. Please add ANTHROPIC_API_KEY to your environment variables.' 
            });
        }

        // Call Anthropic API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
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

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Anthropic API error:', errorData);
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        // Extract text from response
        const botResponse = data.content
            .filter(item => item.type === 'text')
            .map(item => item.text)
            .join('\n');

        res.json({ response: botResponse });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ 
            error: 'Failed to get response from AI. Please try again or contact us at (555) 123-4567.' 
        });
    }
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
