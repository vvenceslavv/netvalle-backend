import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config(); // ✅ Cargar variables de entorno

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    const data = completion.data;
    console.log(data); // ✅ Útil para debug

    res.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error('Error en la solicitud a OpenAI:', error);
    res.status(500).json({
      error: 'Respuesta inválida de OpenAI. Verifica tu API key o la solicitud enviada.'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
