import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { OpenAI } from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Servidor activo 🚀");
});

app.post("/api/chat", async (req, res) => {
  const { mensaje } = req.body;

  // 🛡️ Validación estricta para evitar nulls o vacíos
  if (!mensaje || typeof mensaje !== "string" || mensaje.trim() === "") {
    console.error("❌ Error: mensaje vacío o inválido recibido");
    return res.status(400).json({ error: "Mensaje vacío o inválido." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un asistente jurídico amigable y claro." },
        { role: "user", content: mensaje }
      ]
    });

    const respuesta = response.choices[0]?.message?.content?.trim();

    if (!respuesta) {
      console.error("⚠️ OpenAI regresó una respuesta vacía");
      return res.status(500).json({ error: "Respuesta vacía del modelo." });
    }

    res.json({ respuesta });

  } catch (error) {
    console.error("🔥 Error al consultar OpenAI:", error);
    res.status(500).json({ error: "Error al consultar ChatGPT" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
