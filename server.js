import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Eres un abogado experto en permisos de telecomunicaciones y fibra óptica en México. Brinda asesoría jurídica clara, útil y basada en normativa mexicana."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      console.error("Respuesta inesperada de OpenAI:", data);
      res.status(500).json({ error: "Respuesta inválida de OpenAI. Verifica tu API key o la solicitud enviada." });
    }
  } catch (error) {
    console.error("Error en la petición al modelo:", error);
    res.status(500).json({ error: "Error interno al consultar a OpenAI." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
