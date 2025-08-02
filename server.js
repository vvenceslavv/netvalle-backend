const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Falta el mensaje en el cuerpo de la solicitud.' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // Asegúrate de usar este modelo
      messages: [{ role: "user", content: message }],
    });

    const data = completion.data;

    // 🔍 Para depuración en Render Logs
    console.log("Respuesta de OpenAI:", JSON.stringify(data, null, 2));

    if (data.choices && data.choices.length > 0) {
      res.json({ response: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: 'La respuesta de OpenAI no contiene resultados válidos.' });
    }

  } catch (error) {
    console.error("Error al procesar la solicitud:", error.response?.data || error.message);
    res.status(500).json({ error: "Respuesta inválida de OpenAI. Verifica tu API key o la solicitud enviada." });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
