// server.js
require("dotenv").config(); // 👈 Importa variables del .env

const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = 10000;

app.use(cors());
app.use(express.json());

// Configura OpenAI usando variable de entorno
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // 👈 Segura
});

const openai = new OpenAIApi(configuration);

// Ruta principal
app.get("/", (req, res) => {
  res.send("Servidor activo para Netvalle 🤖");
});

// Ruta para procesar peticiones a ChatGPT
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // o gpt-4 si tienes acceso
      messages: [{ role: "user", content: message }],
    });

    const data = completion.data;
    console.log("🧠 OpenAI response:", data); // ✅ Te ayudará a debuggear

    res.json({
      response: data.choices[0].message.content.trim(),
    });
  } catch (error) {
    console.error("❌ Error OpenAI:", error?.response?.data || error.message);
    res.status(500).json({
      error: "Respuesta inválida de OpenAI. Verifica tu API key o la solicitud enviada.",
    });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
