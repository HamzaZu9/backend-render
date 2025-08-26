import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
app.get("/", (req, res) => res.send("Server is running!"));

app.post('/api/chat', async (req, res) => {
    const { ingredients } = req.body;
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: 'Invalid ingredients list' });
    }
    try {
        const response = await openai.responses.create({
            model: 'gpt-4o-mini',
            input: [
                { role: 'system', content: "You are a helpful assistant that creates recipes based on given ingredients." },
                { role: 'user', content: `Create a recipe using the following ingredients: ${ingredients.join(', ')}. Provide the recipe clearly.` }
            ],
            max_output_tokens: 500
        });

        const recipeText = response.output_text || response.output?.[0]?.content?.[0]?.text || "No recipe generated";
        res.json({ reply: recipeText });

    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        return res.status(500).json({ error: 'Error communicating with OpenAI' });
    }

});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
