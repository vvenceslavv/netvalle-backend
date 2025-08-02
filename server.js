import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un asesor jurídico experto en fibra óptica, infraestructura y permisos en México.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    console.log("Respuesta de OpenAI:", response.choices[0].message);
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Error con OpenAI:", error);
    res.status(500).json({ error: "Error al consultar ChatGPT" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
